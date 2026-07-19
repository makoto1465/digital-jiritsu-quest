import { redirect } from "next/navigation";
import { worlds } from "@/content";

export function generateStaticParams() { return worlds.flatMap((world) => ([{ device: "pc", worldId: world.id }, { device: "mobile", worldId: world.id }])); }

export default async function LegacyWorldPage({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  redirect(device === "mobile" ? "/journey/iphone" : "/journey/windows");
}
