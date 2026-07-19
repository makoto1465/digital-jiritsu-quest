import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { StageListClient } from "@/features/worlds/StageListClient";
import { stages, worlds } from "@/content";
import type { DeviceMode } from "@/lib/types";

export const metadata: Metadata = { title: "STAGE一覧" };

export function generateStaticParams() {
  return worlds.flatMap((world) => ([{ device: "pc", worldId: world.id }, { device: "mobile", worldId: world.id }]));
}

export default async function WorldPage({ params }: { params: Promise<{ device: string; worldId: string }> }) {
  const { device: rawDevice, worldId } = await params;
  if (rawDevice !== "pc" && rawDevice !== "mobile") notFound();
  const device: DeviceMode = rawDevice;
  const world = worlds.find((item) => item.id === worldId);
  if (!world) notFound();
  const deviceStages = stages.filter((stage) => stage.worldId === world.id && stage.device === device);
  return (
    <div className="section-shell page-stack">
      <nav className="breadcrumbs" aria-label="現在地"><Link href="/">ホーム</Link><Icon name="chevronRight" size={16} /><Link href={`/learn/${device}`}>{device === "pc" ? "PC練習" : "スマホ練習"}</Link><Icon name="chevronRight" size={16} /><span aria-current="page">WORLD {world.order}</span></nav>
      <div className="world-detail-heading">
        <div className={`world-number world-${world.order}`}><span>WORLD</span><strong>{world.order}</strong></div>
        <div><p className="eyebrow">{device === "pc" ? "PC PRACTICE" : "MOBILE PRACTICE"}</p><h1>{world.shortTitle}</h1><p>{world.description}</p></div>
      </div>
      <aside className="world-purpose"><Icon name="award" /><p><strong>このWORLDで育てる力</strong>{world.freePlayPrompt}</p></aside>
      <StageListClient device={device} stages={deviceStages} />
      <div className="bottom-actions"><Link className="button button-ghost" href={`/learn/${device}`}><Icon name="arrowLeft" />WORLD一覧へ戻る</Link><Link className="button button-secondary" href={`/free-play/${device}`}><Icon name="practice" />フリープレイへ</Link></div>
    </div>
  );
}
