export const learningEnvironments = [
  "windows",
  "mac",
  "iphone",
  "android",
] as const;

export type LearningEnvironment = (typeof learningEnvironments)[number];

export type GuidanceBand = "show" | "coach" | "challenge";

export type InteractionKind =
  | "pointer"
  | "scroll"
  | "context-menu"
  | "recovery"
  | "navigation"
  | "open-close"
  | "app-switch"
  | "menu-discovery"
  | "typing"
  | "text-selection"
  | "copy-paste"
  | "edit-undo"
  | "browser-search"
  | "search-refine"
  | "tabs-compare"
  | "source-check"
  | "file-concepts"
  | "file-organize"
  | "download-locate"
  | "attach-review"
  | "permission-decision"
  | "account-recovery"
  | "form-review"
  | "suspicious-message"
  | "error-reading"
  | "wifi-recovery"
  | "help-search"
  | "alternate-solution"
  | "independent-research"
  | "independent-file"
  | "independent-settings"
  | "independent-troubleshoot";

export type JourneyAreaId =
  | "touch-and-move"
  | "navigate-screens"
  | "work-with-text"
  | "find-and-check"
  | "files-and-photos"
  | "proceed-safely"
  | "solve-problems"
  | "independent-challenge";

export type MissionId =
  | "pointer"
  | "scroll"
  | "context"
  | "recovery"
  | "navigation"
  | "open-close"
  | "app-switch"
  | "menu-discovery"
  | "typing"
  | "text-selection"
  | "copy-paste"
  | "edit-undo"
  | "browser-search"
  | "search-refine"
  | "tabs-compare"
  | "source-check"
  | "file-concepts"
  | "file-organize"
  | "download-locate"
  | "attach-review"
  | "permission-decision"
  | "account-recovery"
  | "form-review"
  | "suspicious-message"
  | "error-reading"
  | "wifi-recovery"
  | "help-search"
  | "alternate-solution"
  | "independent-research"
  | "independent-file"
  | "independent-settings"
  | "independent-troubleshoot";

export type JourneyCompetencyId = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7";

export type DangerLevel = "green" | "yellow" | "red";

export type EvidenceKind =
  | "observation"
  | "interaction"
  | "decision"
  | "recovery"
  | "comparison"
  | "explanation";

export interface JourneyArea {
  readonly id: JourneyAreaId;
  readonly order: number;
  readonly title: string;
  readonly description: string;
  readonly outcome: string;
  readonly missionIds: readonly MissionId[];
}

export interface EnvironmentOperation {
  readonly label: string;
  readonly steps: readonly string[];
  readonly difference: string;
}

export type EnvironmentOperations = Readonly<
  Record<LearningEnvironment, EnvironmentOperation>
>;

export interface ProgressiveHints {
  /** Level 1: direction only; keeps room for exploration. */
  readonly direction: string;
  /** Level 2: names the useful landmark or feature. */
  readonly feature: string;
  /** Level 3: a complete route translated to the selected environment. */
  readonly action: Readonly<Record<LearningEnvironment, string>>;
}

export interface DangerDefinition {
  readonly level: DangerLevel;
  readonly label: string;
  readonly message: string;
}

export interface StateRequirement {
  /** Stable key consumed by a simulator goal predicate. */
  readonly key: string;
  readonly description: string;
}

export interface EvidenceRequirement {
  /** Stable key emitted to the learning evidence log. */
  readonly key: string;
  readonly kind: EvidenceKind;
  readonly description: string;
  readonly required: boolean;
}

export interface MissionSuccess {
  readonly summary: string;
  readonly states: readonly StateRequirement[];
  readonly evidence: readonly EvidenceRequirement[];
  readonly orderIndependent: true;
}

export interface MissionDefinition {
  readonly id: MissionId;
  readonly areaId: JourneyAreaId;
  readonly order: number;
  readonly title: string;
  /** One short line shown before entering the simulator. */
  readonly mission: string;
  readonly objective: string;
  readonly competency: string;
  readonly competencyIds: readonly JourneyCompetencyId[];
  readonly prerequisites: readonly MissionId[];
  readonly transferTo: readonly MissionId[];
  readonly guidance: GuidanceBand;
  readonly estimatedMinutes: number;
  readonly interactions: readonly InteractionKind[];
  readonly realWorldActions: readonly string[];
  readonly commonConcepts: readonly string[];
  readonly environmentOperations: EnvironmentOperations;
  readonly hints: ProgressiveHints;
  readonly afterCompletion: string;
  readonly xp: number;
  readonly danger: DangerDefinition;
  readonly success: MissionSuccess;
}
