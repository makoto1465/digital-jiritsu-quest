import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JourneyMap } from "@/features/journey/JourneyMap";
import { learningEnvironments, type LearningEnvironment } from "@/lib/journey-types";

export const metadata: Metadata = { title: "学びの道" };
export function generateStaticParams() { return learningEnvironments.map((environment) => ({ environment })); }

export default async function JourneyPage({ params }: { params: Promise<{ environment: string }> }) {
  const { environment } = await params;
  if (!learningEnvironments.includes(environment as LearningEnvironment)) notFound();
  return <JourneyMap environment={environment as LearningEnvironment} />;
}
