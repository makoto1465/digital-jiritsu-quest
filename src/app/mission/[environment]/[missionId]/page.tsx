import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { journeyMissions } from "@/content/journey";
import { MissionExperience } from "@/features/journey/MissionExperience";
import { learningEnvironments, type LearningEnvironment, type MissionId } from "@/lib/journey-types";

export const metadata: Metadata = { title: "実践ミッション" };
export function generateStaticParams() { return learningEnvironments.flatMap((environment) => journeyMissions.map((mission) => ({ environment, missionId: mission.id }))); }

export default async function MissionPage({ params }: { params: Promise<{ environment: string; missionId: string }> }) {
  const { environment, missionId } = await params;
  if (!learningEnvironments.includes(environment as LearningEnvironment)) notFound();
  const mission = journeyMissions.find((item) => item.id === missionId as MissionId);
  if (!mission) notFound();
  return <MissionExperience environment={environment as LearningEnvironment} mission={mission} />;
}
