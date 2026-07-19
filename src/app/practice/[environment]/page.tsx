import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeExperience } from "@/features/journey/PracticeExperience";
import { learningEnvironments, type LearningEnvironment } from "@/lib/journey-types";

export const metadata: Metadata = { title: "自由練習" };
export function generateStaticParams() { return learningEnvironments.map((environment) => ({ environment })); }

export default async function PracticePage({ params }: { params: Promise<{ environment: string }> }) {
  const { environment } = await params;
  if (!learningEnvironments.includes(environment as LearningEnvironment)) notFound();
  return <PracticeExperience environment={environment as LearningEnvironment} />;
}
