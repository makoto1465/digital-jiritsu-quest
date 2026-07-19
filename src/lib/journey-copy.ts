import type { JourneyArea, LearningEnvironment, MissionDefinition } from "@/lib/journey-types";

function isTouchDevice(environment: LearningEnvironment) {
  return environment === "iphone" || environment === "android";
}

export function getMissionTitle(
  mission: Pick<MissionDefinition, "id" | "title">,
  environment: LearningEnvironment,
) {
  if (mission.id === "pointer" && isTouchDevice(environment)) {
    return "日付をタップする";
  }
  return mission.title;
}

export function getMissionSummary(
  mission: Pick<MissionDefinition, "id" | "mission">,
  environment: LearningEnvironment,
) {
  if (mission.id === "pointer" && isTouchDevice(environment)) {
    return "カレンダーの『7月19日』をタップしてください。";
  }
  return mission.mission;
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
