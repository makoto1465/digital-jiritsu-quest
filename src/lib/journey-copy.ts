import type { JourneyArea, LearningEnvironment, MissionDefinition } from "@/lib/journey-types";

function isTouchDevice(environment: LearningEnvironment) {
  return environment === "iphone" || environment === "android";
}

export function getMissionTitle(
  mission: Pick<MissionDefinition, "id" | "title">,
  environment: LearningEnvironment,
) {
  if (environment === "windows") {
    if (mission.id === "navigation") return "Microsoft Edgeの『戻る』を使う";
    if (mission.id === "open-close") return "最小化・閉じる・もう一度開く";
    if (mission.id === "menu-discovery") return "ウィンドウの大きさと場所を変える";
  }
  if (mission.id === "pointer" && isTouchDevice(environment)) {
    return "日付をタップする";
  }
  return mission.title;
}

export function getMissionSummary(
  mission: Pick<MissionDefinition, "id" | "mission">,
  environment: LearningEnvironment,
) {
  if (environment === "windows") {
    if (mission.id === "navigation") return "Microsoft Edgeで施設案内を開き、検索結果へ戻ります。";
    if (mission.id === "open-close") return "メモ帳を最小化・再表示・閉じる・再起動します。";
    if (mission.id === "menu-discovery") return "Microsoft Edgeの大きさと位置を、本来のウィンドウ操作で変えます。";
  }
  if (mission.id === "pointer" && isTouchDevice(environment)) {
    return "カレンダーの『7月19日』をタップしてください。";
  }
  return mission.mission;
}

export function getMissionCompletionText(
  mission: Pick<MissionDefinition, "id" | "afterCompletion">,
  environment: LearningEnvironment,
) {
  if (environment === "windows") {
    if (mission.id === "navigation") return "Microsoft Edgeの『戻る』で、一つ前の検索結果へ戻れます。";
    if (mission.id === "open-close") return "最小化と閉じるの違いを確認し、タスクバーから画面を戻せます。";
    if (mission.id === "menu-discovery") return "ウィンドウを元のサイズに戻し、移動し、最大化できます。";
  }
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
