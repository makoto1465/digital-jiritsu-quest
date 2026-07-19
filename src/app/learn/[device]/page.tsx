import { redirect } from "next/navigation";

export function generateStaticParams() { return [{ device: "pc" }, { device: "mobile" }]; }

export default async function LegacyLearnPage({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  redirect(device === "mobile" ? "/journey/iphone" : "/journey/windows");
}
