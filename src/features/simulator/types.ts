export type SimulatorApp =
  | "home"
  | "browser"
  | "settings"
  | "files"
  | "mail"
  | "help"
  | "notes"
  | "photos"
  | "calendar"
  | "chat";

export type BrowserView = "start" | "results" | "article";

export interface BrowserArticle {
  title: string;
  eyebrow: string;
  paragraphs: string[];
  copyText?: string;
}

export interface BrowserScenario {
  prompt: string;
  expectedTerms: string[];
  resultTitle: string;
  resultSummary: string;
  primaryArticle: BrowserArticle;
  secondaryArticle?: BrowserArticle;
  tabLabels: [string, string];
  featuredResult?: boolean;
}

export interface VirtualFile {
  name: string;
  description: string;
  isTarget?: boolean;
}

export interface ErrorScenario {
  title: string;
  message: string;
  code?: string;
}

export interface HelpScenario {
  prompt: string;
  expectedTerms: string[];
  resultTitle: string;
  resultSteps: string[];
  questionText?: string;
}

export interface SimulatorScenario {
  id: string;
  stageId?: string;
  initialApp: SimulatorApp;
  initialBrowserView?: BrowserView;
  homeCopyText: string;
  notesSourceText: string;
  browser: BrowserScenario;
  files: VirtualFile[];
  moveTarget: string;
  error: ErrorScenario;
  help: HelpScenario;
}

export interface SimulatorState {
  activeApp: SimulatorApp;
  previousApp: SimulatorApp | null;
  browserQuery: string;
  browserSearched: boolean;
  browserResultOpen: boolean;
  browserHistory: BrowserView[];
  browserSearchStatus: "idle" | "empty" | "wrong" | "found";
  activeTab: number;
  textSize: "standard" | "large";
  popupOpen: boolean;
  moreMenuOpen: boolean;
  accountPanelOpen: boolean;
  accountName: string;
  passwordResetStarted: boolean;
  authCodeViewed: boolean;
  selectedFile: string | null;
  fileLocation: string;
  attachedFile: string | null;
  shareChooserOpen: boolean;
  helpQuery: string;
  helpSearched: boolean;
  helpSearchStatus: "idle" | "empty" | "wrong" | "found";
  lastErrorRead: boolean;
  helpQuestion: string;
  helpQuestionSaved: boolean;
  clipboardText: string;
  noteText: string;
  photoShared: boolean;
  mailDraftSaved: boolean;
  lastNotice: string;
}

export interface SimulatorCommand {
  id: number;
  type: "undo" | "redo" | "reset";
}

export const initialSimulatorState: SimulatorState = {
  activeApp: "home",
  previousApp: null,
  browserQuery: "",
  browserSearched: false,
  browserResultOpen: false,
  browserHistory: [],
  browserSearchStatus: "idle",
  activeTab: 0,
  textSize: "standard",
  popupOpen: true,
  moreMenuOpen: false,
  accountPanelOpen: false,
  accountName: "練習アカウントA",
  passwordResetStarted: false,
  authCodeViewed: false,
  selectedFile: null,
  fileLocation: "ダウンロード",
  attachedFile: null,
  shareChooserOpen: false,
  helpQuery: "",
  helpSearched: false,
  helpSearchStatus: "idle",
  lastErrorRead: false,
  helpQuestion: "",
  helpQuestionSaved: false,
  clipboardText: "",
  noteText: "",
  photoShared: false,
  mailDraftSaved: false,
  lastNotice: "",
};
