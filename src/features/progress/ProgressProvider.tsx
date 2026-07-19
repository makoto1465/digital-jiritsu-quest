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

export interface UserSettings {
  fontSize: FontSize;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface LearningProgress {
  version: 1;
  completedStageIds: string[];
  practicedDevices: ("pc" | "mobile")[];
  xp: number;
  attempts: number;
  hintUses: number;
  glossaryViews: number;
  recoveries: number;
  freePlayActionIds: string[];
  badgeIds: string[];
  competencyEvidence: Record<string, number>;
  settings: UserSettings;
}

interface ProgressContextValue {
  progress: LearningProgress;
  hydrated: boolean;
  completeStage: (stageId: string, xp: number, competencies: string[], device: "pc" | "mobile") => void;
  recordAttempt: () => void;
  recordHint: () => void;
  recordGlossaryView: () => void;
  recordRecovery: () => void;
  recordFreePlayAction: (actionId: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = "digital-jiritsu:profile:v1";

const defaultProgress: LearningProgress = {
  version: 1,
  completedStageIds: [],
  practicedDevices: [],
  xp: 0,
  attempts: 0,
  hintUses: 0,
  glossaryViews: 0,
  recoveries: 0,
  freePlayActionIds: [],
  badgeIds: [],
  competencyEvidence: {},
  settings: { fontSize: "standard", reduceMotion: false, highContrast: false },
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function parseStoredProgress(raw: string | null): LearningProgress {
  if (!raw) return defaultProgress;
  try {
    const value = JSON.parse(raw) as Partial<LearningProgress>;
    if (value.version !== 1 || !Array.isArray(value.completedStageIds)) return defaultProgress;
    return {
      ...defaultProgress,
      ...value,
      completedStageIds: value.completedStageIds.filter((id): id is string => typeof id === "string"),
      practicedDevices: Array.isArray(value.practicedDevices)
        ? value.practicedDevices.filter((device): device is "pc" | "mobile" => device === "pc" || device === "mobile")
        : [],
      settings: { ...defaultProgress.settings, ...value.settings },
      competencyEvidence: value.competencyEvidence ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

function deriveBadges(progress: LearningProgress): string[] {
  const badges = new Set(progress.badgeIds);
  if (progress.completedStageIds.length >= 1) badges.add("first-step");
  if (progress.glossaryViews >= 3) badges.add("researcher");
  if (progress.completedStageIds.some((id) => id.includes("-pc-"))) badges.add("pc-beginner");
  if (progress.completedStageIds.some((id) => id.includes("-mobile-"))) badges.add("mobile-beginner");
  if (progress.recoveries >= 2) badges.add("recovery-expert");
  if (progress.freePlayActionIds.length >= 6) badges.add("curious-explorer");
  if (progress.practicedDevices.includes("pc") && progress.practicedDevices.includes("mobile")) badges.add("pc-and-mobile");
  if (progress.completedStageIds.some((id) => id.startsWith("w7-"))) badges.add("independent-step");
  return [...badges];
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(parseStoredProgress(window.localStorage.getItem(STORAGE_KEY)));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Browser storage is optional; the in-memory experience remains usable.
    }
  }, [hydrated, progress]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = progress.settings.fontSize === "xlarge" ? "x-large" : progress.settings.fontSize;
    document.documentElement.dataset.reduceMotion = String(progress.settings.reduceMotion);
    document.documentElement.dataset.contrast = progress.settings.highContrast ? "high" : "standard";
  }, [progress.settings]);

  const completeStage = useCallback(
    (stageId: string, xp: number, competencies: string[], device: "pc" | "mobile") => {
      setProgress((current) => {
        if (current.completedStageIds.includes(stageId)) return current;
        const evidence = { ...current.competencyEvidence };
        competencies.forEach((competency) => {
          evidence[competency] = (evidence[competency] ?? 0) + 1;
        });
        const next: LearningProgress = {
          ...current,
          completedStageIds: [...current.completedStageIds, stageId],
          practicedDevices: current.practicedDevices.includes(device)
            ? current.practicedDevices
            : [...current.practicedDevices, device],
          xp: current.xp + xp,
          competencyEvidence: evidence,
        };
        return { ...next, badgeIds: deriveBadges(next) };
      });
    },
    [],
  );

  const recordAttempt = useCallback(() => setProgress((current) => ({ ...current, attempts: current.attempts + 1 })), []);
  const recordHint = useCallback(() => setProgress((current) => ({ ...current, hintUses: current.hintUses + 1, xp: current.xp + 5 })), []);
  const recordGlossaryView = useCallback(() => {
    setProgress((current) => {
      const next = { ...current, glossaryViews: current.glossaryViews + 1 };
      return { ...next, badgeIds: deriveBadges(next) };
    });
  }, []);
  const recordRecovery = useCallback(() => {
    setProgress((current) => {
      const next = { ...current, recoveries: current.recoveries + 1, xp: current.xp + 5 };
      return { ...next, badgeIds: deriveBadges(next) };
    });
  }, []);
  const recordFreePlayAction = useCallback((actionId: string) => {
    setProgress((current) => {
      if (current.freePlayActionIds.includes(actionId)) return current;
      const next = { ...current, freePlayActionIds: [...current.freePlayActionIds, actionId], xp: current.xp + 2 };
      return { ...next, badgeIds: deriveBadges(next) };
    });
  }, []);
  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);
  const resetProgress = useCallback(() => setProgress(defaultProgress), []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      completeStage,
      recordAttempt,
      recordHint,
      recordGlossaryView,
      recordRecovery,
      recordFreePlayAction,
      updateSettings,
      resetProgress,
    }),
    [progress, hydrated, completeStage, recordAttempt, recordHint, recordGlossaryView, recordRecovery, recordFreePlayAction, updateSettings, resetProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used within ProgressProvider");
  return value;
}
