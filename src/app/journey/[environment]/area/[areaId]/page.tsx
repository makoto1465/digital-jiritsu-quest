import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { journeyAreas } from "@/content/journey";
import { AreaExperience } from "@/features/journey/AreaExperience";
import { learningEnvironments, type JourneyAreaId, type LearningEnvironment } from "@/lib/journey-types";

export const metadata: Metadata = { title: "エリアのミッション" };
export function generateStaticParams() { return learningEnvironments.flatMap((environment) => journeyAreas.map((area) => ({ environment, areaId: area.id }))); }

export default async function AreaPage({ params }: { params: Promise<{ environment: string; areaId: string }> }) {
  const { environment, areaId } = await params;
  if (!learningEnvironments.includes(environment as LearningEnvironment)) notFound();
  const area = journeyAreas.find((item) => item.id === areaId as JourneyAreaId);
  if (!area) notFound();
  return <AreaExperience environment={environment as LearningEnvironment} area={area} />;
}
