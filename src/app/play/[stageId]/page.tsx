import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages } from "@/content";
import { StagePlayer } from "@/features/stages/StagePlayer";

export const metadata: Metadata = { title: "ステージをプレイ" };
export function generateStaticParams() { return stages.map((stage) => ({ stageId: stage.id })); }

export default async function PlayPage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const stage = stages.find((item) => item.id === stageId);
  if (!stage) notFound();
  return <StagePlayer stage={stage} />;
}
