import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { FreePlayExperience } from "@/features/os/FreePlayExperience";
import { osIds, osMeta, type OsId } from "@/features/os/os-config";

export function generateStaticParams() {
  return [...osIds.map((device) => ({ device })), { device: "pc" }, { device: "mobile" }];
}

export default async function FreePlayPage({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  if (device === "pc") redirect("/free-play/windows");
  if (device === "mobile") redirect("/free-play/iphone");
  if (!osIds.includes(device as OsId)) notFound();
  return <FreePlayExperience device={device as OsId} />;
}

export async function generateMetadata({ params }: { params: Promise<{ device: string }> }): Promise<Metadata> {
  const { device } = await params;
  if (!osIds.includes(device as OsId)) return { title: "フリープレイ" };
  return { title: `${osMeta[device as OsId].deviceName}のフリープレイ` };
}
