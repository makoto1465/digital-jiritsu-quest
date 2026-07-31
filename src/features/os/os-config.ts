import type { JourneyEnvironment } from "@/features/progress/ProgressProvider";

export type OsId = JourneyEnvironment;

export const osIds: readonly OsId[] = ["windows", "mac", "iphone", "android"];

export type AppKey =
  | "browser"
  | "files"
  | "notes"
  | "settings"
  | "mail"
  | "photos"
  | "camera"
  | "phone"
  | "messages"
  | "calculator"
  | "store"
  | "clock"
  | "maps"
  | "music"
  | "trash";

export interface OsMeta {
  /** 画面に出す正式名 */
  name: string;
  /** 機器の呼び方 */
  deviceName: string;
  /** 入力の呼び方（タップ／クリック） */
  tapWord: string;
  /** 長押し・右クリックの呼び方 */
  contextWord: string;
  family: "desktop" | "mobile";
  /** 端末に表示される時計 */
  clock: string;
  /** 端末に表示される日付 */
  date: string;
}

export const osMeta: Record<OsId, OsMeta> = {
  windows: { name: "Windows 11", deviceName: "Windows パソコン", tapWord: "左クリック", contextWord: "右クリック", family: "desktop", clock: "14:30", date: "2026/07/31" },
  mac: { name: "macOS", deviceName: "Mac", tapWord: "クリック", contextWord: "Control クリック", family: "desktop", clock: "14:30", date: "7月31日(金)" },
  iphone: { name: "iOS", deviceName: "iPhone", tapWord: "タップ", contextWord: "長押し", family: "mobile", clock: "14:30", date: "7月31日 金曜日" },
  android: { name: "Android", deviceName: "Android スマートフォン", tapWord: "タップ", contextWord: "長押し", family: "mobile", clock: "14:30", date: "7月31日(金)" },
};

/** 実機と同じアプリ名。初心者が実機で同じ名前を探せるようにする。 */
export const appLabels: Record<OsId, Record<AppKey, string>> = {
  windows: {
    browser: "Microsoft Edge",
    files: "エクスプローラー",
    notes: "メモ帳",
    settings: "設定",
    mail: "メール",
    photos: "フォト",
    camera: "カメラ",
    phone: "電話",
    messages: "メッセージ",
    calculator: "電卓",
    store: "Microsoft Store",
    clock: "時計",
    maps: "マップ",
    music: "メディア プレーヤー",
    trash: "ごみ箱",
  },
  mac: {
    browser: "Safari",
    files: "Finder",
    notes: "テキストエディット",
    settings: "システム設定",
    mail: "メール",
    photos: "写真",
    camera: "Photo Booth",
    phone: "FaceTime",
    messages: "メッセージ",
    calculator: "計算機",
    store: "App Store",
    clock: "時計",
    maps: "マップ",
    music: "ミュージック",
    trash: "ゴミ箱",
  },
  iphone: {
    browser: "Safari",
    files: "ファイル",
    notes: "メモ",
    settings: "設定",
    mail: "メール",
    photos: "写真",
    camera: "カメラ",
    phone: "電話",
    messages: "メッセージ",
    calculator: "計算機",
    store: "App Store",
    clock: "時計",
    maps: "マップ",
    music: "ミュージック",
    trash: "ゴミ箱",
  },
  android: {
    browser: "Chrome",
    files: "Files",
    notes: "Keep メモ",
    settings: "設定",
    mail: "Gmail",
    photos: "フォト",
    camera: "カメラ",
    phone: "電話",
    messages: "メッセージ",
    calculator: "電卓",
    store: "Play ストア",
    clock: "時計",
    maps: "マップ",
    music: "YouTube Music",
    trash: "ゴミ箱",
  },
};

/** デスクトップに置くアイコン／ホーム画面1ページ目に並ぶアプリ */
export const osHomeApps: Record<OsId, readonly AppKey[]> = {
  windows: ["browser", "notes", "files", "trash"],
  mac: [],
  iphone: ["phone", "messages", "camera", "clock", "maps", "photos", "notes", "files", "calculator", "store", "mail", "music"],
  android: ["phone", "messages", "camera", "clock", "photos", "notes", "files", "calculator", "store", "maps", "mail", "music"],
};

/** タスクバー／Dock に並ぶアプリ */
export const osDockApps: Record<OsId, readonly AppKey[]> = {
  windows: ["browser", "files", "notes", "mail", "settings", "store"],
  mac: ["browser", "files", "notes", "mail", "photos", "calculator", "settings"],
  iphone: ["browser", "settings", "mail", "music"],
  android: ["browser", "settings", "mail", "camera"],
};

/** 実機に近づけるための、OSごとのウィンドウ／画面の呼び方 */
export const osScreenWords: Record<OsId, { home: string; back: string; switcher: string }> = {
  windows: { home: "デスクトップ", back: "戻る", switcher: "タスクバー" },
  mac: { home: "デスクトップ", back: "戻る", switcher: "Dock" },
  iphone: { home: "ホーム画面", back: "戻る", switcher: "App スイッチャー" },
  android: { home: "ホーム画面", back: "戻る", switcher: "最近使ったアプリ" },
};

export function appLabel(os: OsId, app: AppKey) {
  return appLabels[os][app];
}
