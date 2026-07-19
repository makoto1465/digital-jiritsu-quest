import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreePlayClient } from "@/features/simulator/FreePlayClient";

export const metadata: Metadata = { title: "フリープレイ" };
export function generateStaticParams() { return [{ device: "pc" }, { device: "mobile" }]; }

export default async function FreePlayPage({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  if (device !== "pc" && device !== "mobile") notFound();
  return <FreePlayClient device={device} />;
}
