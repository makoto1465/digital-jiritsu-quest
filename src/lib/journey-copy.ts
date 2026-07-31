import type { JourneyArea, LearningEnvironment, MissionDefinition } from "@/lib/journey-types";

function isTouchDevice(environment: LearningEnvironment) {
  return environment === "iphone" || environment === "android";
}

/** 実機と同じアプリ名で説明する（他の端末を触ったときに同じ名前を探せるように） */
const browserName: Record<LearningEnvironment, string> = {
  windows: "Microsoft Edge",
  mac: "Safari",
  iphone: "Safari",
  android: "Chrome",
};

const notesName: Record<LearningEnvironment, string> = {
  windows: "メモ帳",
  mac: "テキストエディット",
  iphone: "メモ",
  android: "Keep メモ",
};

const backName: Record<LearningEnvironment, string> = {
  windows: "←（戻る）",
  mac: "←（戻る）",
  iphone: "←（戻る）",
  android: "◁（戻る）",
};

export function getMissionTitle(
  mission: Pick<MissionDefinition, "id" | "title">,
  environment: LearningEnvironment,
) {
  if (mission.id === "navigation") return `${browserName[environment]}の『${backName[environment]}』を使う`;
  if (mission.id === "open-close") {
    if (environment === "windows") return "最小化・閉じる・もう一度開く";
    if (environment === "mac") return "閉じるとアプリの終了は違う";
    return `${notesName[environment]}を終了して、もう一度開く`;
  }
  if (mission.id === "menu-discovery") {
    if (environment === "windows") return "ウィンドウの大きさと場所を変える";
    if (environment === "mac") return "メニューバーから表示を変える";
    return `${browserName[environment]}のメニューで文字を大きくする`;
  }
  if (mission.id === "pointer" && isTouchDevice(environment)) return "日付をタップする";
  return mission.title;
}

export function getMissionSummary(
  mission: Pick<MissionDefinition, "id" | "mission">,
  environment: LearningEnvironment,
) {
  if (mission.id === "navigation") return `${browserName[environment]}で施設案内を開き、検索結果へ戻ります。`;
  if (mission.id === "open-close") {
    if (environment === "windows") return "メモ帳を開き、しまう・戻す・閉じる違いを練習します。";
    if (environment === "mac") return "テキストエディットを赤いボタンで閉じ、Dock から開き直します。";
    if (environment === "iphone") return "メモを App スイッチャーで終了し、もう一度開きます。";
    return "Keep メモを最近使ったアプリで終了し、もう一度開きます。";
  }
  if (mission.id === "app-switch") return `${browserName[environment]}と${notesName[environment]}を、閉じずに行き来します。`;
  if (mission.id === "menu-discovery") {
    if (environment === "windows") return "Microsoft Edge の大きさと位置を、本来のウィンドウ操作で変えます。";
    if (environment === "mac") return "メニューバーの『表示』から、文字の大きさを変えます。";
    if (environment === "iphone") return "Safari の『ぁA』から、文字の大きさを変えます。";
    return "Chrome の『⋮』から、文字の大きさを変えます。";
  }
  if (mission.id === "pointer" && isTouchDevice(environment)) return "カレンダーの『7月19日』をタップしてください。";
  return mission.mission;
}

export function getMissionCompletionText(
  mission: Pick<MissionDefinition, "id" | "afterCompletion">,
  environment: LearningEnvironment,
) {
  if (mission.id === "navigation") return `${browserName[environment]}の『${backName[environment]}』で、一つ前の検索結果へ戻れます。`;
  if (mission.id === "open-close") {
    if (environment === "windows") return "最小化と閉じるの違いを確認し、タスクバーから画面を戻せます。";
    if (environment === "mac") return "赤いボタンはウインドウを閉じるだけで、アプリは Dock で動いたままだと分かりました。";
    return "終了したアプリを、ホーム画面からもう一度開けます。";
  }
  if (mission.id === "menu-discovery" && environment === "windows") return "ウィンドウを元のサイズに戻し、移動し、最大化できます。";
  if (mission.id === "menu-discovery") return "メニューの場所が分かれば、文字の大きさを自分で変えられます。";
  return mission.afterCompletion;
}

export function getAreaTitle(
  area: Pick<JourneyArea, "id" | "title">,
  environment: LearningEnvironment,
) {
  if (area.id === "touch-and-move" && isTouchDevice(environment)) {
    return "タップと画面操作";
  }
  return area.title;
}

export function getAreaDescription(
  area: Pick<JourneyArea, "id" | "description">,
  environment: LearningEnvironment,
) {
  if (area.id === "touch-and-move" && isTouchDevice(environment)) {
    return "タップ、スワイプ、長押し、コピー・貼り付けを練習します。";
  }
  return area.description;
}
