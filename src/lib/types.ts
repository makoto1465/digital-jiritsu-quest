export type DeviceMode = "pc" | "mobile";

export type GuidanceLevel = "guided" | "supported" | "independent";

export type CompetencyId =
  | "safe-experiment"
  | "research"
  | "recovery"
  | "observation"
  | "transfer"
  | "independent-exploration";

export const knownActionIds = [
  "open-browser",
  "open-settings",
  "open-files",
  "open-mail",
  "open-help",
  "open-more",
  "switch-tab",
  "search-web",
  "open-result",
  "text-larger",
  "dismiss-popup",
  "open-account",
  "switch-account",
  "password-help",
  "select-file",
  "move-file",
  "attach-file",
  "read-error",
  "search-help",
  "write-question",
  "open-notes",
  "copy-text",
  "paste-text",
  "share-photo",
  "go-back",
  "go-home",
  "safe-cancel",
] as const;

export type KnownActionId = (typeof knownActionIds)[number];

export interface WorldDefinition {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  stageIds: string[];
  competencyIds: CompetencyId[];
  freePlayPrompt: string;
}

export interface StageDefinition {
  id: string;
  worldId: string;
  device: DeviceMode;
  order: number;
  code: string;
  title: string;
  description: string;
  objective: string;
  guidance: GuidanceLevel;
  estimatedMinutes: number;
  targetActions: KnownActionId[];
  hints: string[];
  glossaryTermIds: string[];
  xp: number;
  safetyNote: string;
  competencyIds: CompetencyId[];
  completionMessage: string;
}

export type GlossaryCategory =
  | "screen"
  | "internet"
  | "account"
  | "file"
  | "operation"
  | "help"
  | "safety";

export interface GlossaryTerm {
  id: string;
  term: string;
  reading: string;
  category: GlossaryCategory;
  shortDescription: string;
  description: string;
  example: string;
  relatedTermIds: string[];
  tryIt?: string;
}

export type FaqCategory =
  | "getting-started"
  | "operation"
  | "internet"
  | "account"
  | "file"
  | "troubleshooting"
  | "progress"
  | "safety";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  keywords: string[];
  relatedWorldIds: string[];
  relatedGlossaryTermIds: string[];
}

export interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  steps: string[];
  keywords: string[];
  relatedActionIds: KnownActionId[];
  relatedGlossaryTermIds: string[];
  relatedFaqIds: string[];
}

export type BadgeUnlockCondition =
  | { kind: "completed-stages"; count: number; device?: DeviceMode }
  | { kind: "completed-world"; worldId: string }
  | { kind: "completed-stage"; stageId: string }
  | { kind: "research-actions"; count: number }
  | { kind: "recovery-actions"; count: number }
  | { kind: "safe-cancels"; count: number }
  | { kind: "free-play-actions"; count: number }
  | { kind: "used-device-modes"; count: number }
  | { kind: "alternative-solutions"; count: number };

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  encouragement: string;
  xpBonus: number;
  unlockCondition: BadgeUnlockCondition;
}
