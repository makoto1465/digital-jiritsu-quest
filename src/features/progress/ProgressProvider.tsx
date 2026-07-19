"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FontSize = "standard" | "large" | "xlarge";
export type JourneyEnvironment = "windows" | "mac" | "iphone" | "android";
export type SupportLevel = 0 | 1 | 2 | 3;

export interface UserSettings {
  fontSize: FontSize;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface MissionRecord {
  missionId: string;
  environment: JourneyEnvironment;
  completedAt: string;
  bestSupportLevel: SupportLevel;
  attempts: number;
  hintUses: number;
  recoveries: number;
  evidence: string[];
}

export interface LearningProgress {
  version: 2;
  selectedEnvironment: JourneyEnvironment | null;
  completedMissionKeys: string[];
  missionRecords: Record<string, MissionRecord>;
  competencyEvidence: Record<string, number>;
  attempts: number;
  hintUses: number;
  recoveries: number;
  freePlayActionIds: string[];
  glossaryViews: number;
  settings: UserSettings;
  // Compatibility fields keep old bookmarked screens readable during migration.
  completedStageIds: string[];
  practicedDevices: ("pc" | "mobile")[];
  xp: number;
  badgeIds: string[];
}

interface ProgressContextValue {
  progress: LearningProgress;
  hydrated: boolean;
  selectEnvironment: (environment: JourneyEnvironment) => void;
  completeMission: (
    environment: JourneyEnvironment,
    missionId: string,
    competencies: readonly string[],
    supportLevel: SupportLevel,
    evidence: readonly string[],
  ) => void;
  recordMissionAttempt: (environment: JourneyEnvironment, missionId: string) => void;
  recordJourneyHint: (environment: JourneyEnvironment, missionId: string) => void;
  recordJourneyRecovery: (environment: JourneyEnvironment, missionId: string) => void;
  completeStage: (stageId: string, xp: number, competencies: string[], device: "pc" | "mobile") => void;
  recordAttempt: () => void;
  recordHint: () => void;
  recordGlossaryView: () => void;
  recordRecovery: () => void;
  recordFreePlayAction: (actionId: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = "digital-jiritsu:profile:v2";
const LEGACY_STORAGE_KEY = "digital-jiritsu:profile:v1";

const defaultProgress: LearningProgress = {
  version: 2,
  selectedEnvironment: null,
  completedMissionKeys: [],
  missionRecords: {},
  competencyEvidence: {},
  attempts: 0,
  hintUses: 0,
  recoveries: 0,
  freePlayActionIds: [],
  glossaryViews: 0,
  settings: { fontSize: "standard", reduceMotion: false, highContrast: false },
  completedStageIds: [],
  practicedDevices: [],
  xp: 0,
  badgeIds: [],
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function isEnvironment(value: unknown): value is JourneyEnvironment {
  return value === "windows" || value === "mac" || value === "iphone" || value === "android";
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function parseStoredProgress(raw: string | null, legacyRaw: string | null): LearningProgress {
  try {
    if (raw) {
      const value = JSON.parse(raw) as Partial<LearningProgress>;
      if (value.version === 2) {
        return {
          ...defaultProgress,
          ...value,
          selectedEnvironment: isEnvironment(value.selectedEnvironment) ? value.selectedEnvironment : null,
          completedMissionKeys: strings(value.completedMissionKeys),
          completedStageIds: strings(value.completedStageIds),
          freePlayActionIds: strings(value.freePlayActionIds),
          badgeIds: strings(value.badgeIds),
          missionRecords: value.missionRecords ?? {},
          competencyEvidence: value.competencyEvidence ?? {},
          settings: { ...defaultProgress.settings, ...value.settings },
        };
      }
    }
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as Record<string, unknown>;
      return {
        ...defaultProgress,
        completedStageIds: strings(legacy.completedStageIds),
        freePlayActionIds: strings(legacy.freePlayActionIds),
        badgeIds: strings(legacy.badgeIds),
        attempts: typeof legacy.attempts === "number" ? legacy.attempts : 0,
        hintUses: typeof legacy.hintUses === "number" ? legacy.hintUses : 0,
        recoveries: typeof legacy.recoveries === "number" ? legacy.recoveries : 0,
        glossaryViews: typeof legacy.glossaryViews === "number" ? legacy.glossaryViews : 0,
        xp: typeof legacy.xp === "number" ? legacy.xp : 0,
        competencyEvidence:
          legacy.competencyEvidence && typeof legacy.competencyEvidence === "object"
            ? (legacy.competencyEvidence as Record<string, number>)
            : {},
        practicedDevices: Array.isArray(legacy.practicedDevices)
          ? legacy.practicedDevices.filter((item): item is "pc" | "mobile" => item === "pc" || item === "mobile")
          : [],
        settings:
          legacy.settings && typeof legacy.settings === "object"
            ? { ...defaultProgress.settings, ...(legacy.settings as Partial<UserSettings>) }
            : defaultProgress.settings,
      };
    }
  } catch {
    return defaultProgress;
  }
  return defaultProgress;
}

function missionKey(environment: JourneyEnvironment, missionId: string) {
  return `${environment}:${missionId}`;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(parseStoredProgress(window.localStorage.getItem(STORAGE_KEY), window.localStorage.getItem(LEGACY_STORAGE_KEY)));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      if (progress.selectedEnvironment) window.localStorage.setItem("djq-start-environment", progress.selectedEnvironment);
    } catch {
      // The lesson still works in memory when storage is disabled.
    }
  }, [hydrated, progress]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = progress.settings.fontSize === "xlarge" ? "x-large" : progress.settings.fontSize;
    document.documentElement.dataset.reduceMotion = String(progress.settings.reduceMotion);
    document.documentElement.dataset.contrast = progress.settings.highContrast ? "high" : "standard";
  }, [progress.settings]);

  const selectEnvironment = useCallback((environment: JourneyEnvironment) => {
    setProgress((current) => ({ ...current, selectedEnvironment: environment }));
  }, []);

  const completeMission = useCallback(
    (
      environment: JourneyEnvironment,
      missionId: string,
      competencies: readonly string[],
      supportLevel: SupportLevel,
      evidence: readonly string[],
    ) => {
      setProgress((current) => {
        const key = missionKey(environment, missionId);
        const existing = current.missionRecords[key];
        const competencyEvidence = { ...current.competencyEvidence };
        if (!existing?.completedAt) {
          competencies.forEach((competency) => {
            competencyEvidence[competency] = (competencyEvidence[competency] ?? 0) + 1;
          });
        }
        return {
          ...current,
          selectedEnvironment: environment,
          completedMissionKeys: current.completedMissionKeys.includes(key)
            ? current.completedMissionKeys
            : [...current.completedMissionKeys, key],
          competencyEvidence,
          missionRecords: {
            ...current.missionRecords,
            [key]: {
              missionId,
              environment,
              completedAt: new Date().toISOString(),
              bestSupportLevel: existing ? (Math.min(existing.bestSupportLevel, supportLevel) as SupportLevel) : supportLevel,
              attempts: Math.max(existing?.attempts ?? 0, 1),
              hintUses: Math.min(existing?.hintUses ?? supportLevel, supportLevel),
              recoveries: existing?.recoveries ?? 0,
              evidence: [...new Set([...(existing?.evidence ?? []), ...evidence])],
            },
          },
        };
      });
    },
    [],
  );

  const updateMissionRecord = useCallback(
    (environment: JourneyEnvironment, missionId: string, field: "attempts" | "hintUses" | "recoveries") => {
      setProgress((current) => {
        const key = missionKey(environment, missionId);
        const existing = current.missionRecords[key];
        const base: MissionRecord = existing ?? {
          missionId,
          environment,
          completedAt: "",
          bestSupportLevel: 3,
          attempts: 0,
          hintUses: 0,
          recoveries: 0,
          evidence: [],
        };
        return {
          ...current,
          [field]: current[field] + 1,
          missionRecords: { ...current.missionRecords, [key]: { ...base, [field]: base[field] + 1 } },
        };
      });
    },
    [],
  );

  const recordMissionAttempt = useCallback(
    (environment: JourneyEnvironment, missionId: string) => updateMissionRecord(environment, missionId, "attempts"),
    [updateMissionRecord],
  );
  const recordJourneyHint = useCallback(
    (environment: JourneyEnvironment, missionId: string) => updateMissionRecord(environment, missionId, "hintUses"),
    [updateMissionRecord],
  );
  const recordJourneyRecovery = useCallback(
    (environment: JourneyEnvironment, missionId: string) => updateMissionRecord(environment, missionId, "recoveries"),
    [updateMissionRecord],
  );

  const completeStage = useCallback((stageId: string, xp: number, competencies: string[], device: "pc" | "mobile") => {
    setProgress((current) => {
      if (current.completedStageIds.includes(stageId)) return current;
      const evidence = { ...current.competencyEvidence };
      competencies.forEach((competency) => { evidence[competency] = (evidence[competency] ?? 0) + 1; });
      return {
        ...current,
        completedStageIds: [...current.completedStageIds, stageId],
        practicedDevices: current.practicedDevices.includes(device) ? current.practicedDevices : [...current.practicedDevices, device],
        xp: current.xp + xp,
        competencyEvidence: evidence,
      };
    });
  }, []);

  const recordAttempt = useCallback(() => setProgress((current) => ({ ...current, attempts: current.attempts + 1 })), []);
  const recordHint = useCallback(() => setProgress((current) => ({ ...current, hintUses: current.hintUses + 1 })), []);
  const recordGlossaryView = useCallback(() => setProgress((current) => ({ ...current, glossaryViews: current.glossaryViews + 1 })), []);
  const recordRecovery = useCallback(() => setProgress((current) => ({ ...current, recoveries: current.recoveries + 1 })), []);
  const recordFreePlayAction = useCallback((actionId: string) => {
    setProgress((current) => current.freePlayActionIds.includes(actionId)
      ? current
      : { ...current, freePlayActionIds: [...current.freePlayActionIds, actionId] });
  }, []);
  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);
  const resetProgress = useCallback(() => setProgress(defaultProgress), []);

  const value = useMemo<ProgressContextValue>(() => ({
    progress,
    hydrated,
    selectEnvironment,
    completeMission,
    recordMissionAttempt,
    recordJourneyHint,
    recordJourneyRecovery,
    completeStage,
    recordAttempt,
    recordHint,
    recordGlossaryView,
    recordRecovery,
    recordFreePlayAction,
    updateSettings,
    resetProgress,
  }), [
    progress,
    hydrated,
    selectEnvironment,
    completeMission,
    recordMissionAttempt,
    recordJourneyHint,
    recordJourneyRecovery,
    completeStage,
    recordAttempt,
    recordHint,
    recordGlossaryView,
    recordRecovery,
    recordFreePlayAction,
    updateSettings,
    resetProgress,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used within ProgressProvider");
  return value;
}
