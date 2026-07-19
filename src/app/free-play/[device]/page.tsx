import { redirect } from "next/navigation";

export function generateStaticParams() { return [{ device: "pc" }, { device: "mobile" }]; }

export default async function LegacyFreePlayPage({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  redirect(device === "mobile" ? "/practice/iphone" : "/practice/windows");
}
