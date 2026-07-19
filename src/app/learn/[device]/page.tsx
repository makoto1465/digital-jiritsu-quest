import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { WorldListClient } from "@/features/worlds/WorldListClient";
import { stages, worlds } from "@/content";
import type { DeviceMode } from "@/lib/types";

export const metadata: Metadata = { title: "WORLD一覧" };
export function generateStaticParams() { return [{ device: "pc" }, { device: "mobile" }]; }

export default async function LearnPage({ params }: { params: Promise<{ device: string }> }) {
  const { device: rawDevice } = await params;
  if (rawDevice !== "pc" && rawDevice !== "mobile") notFound();
  const device: DeviceMode = rawDevice;
  return (
    <div className="section-shell page-stack">
      <div className="page-heading split-heading">
        <div><p className="eyebrow">LEARNING MAP</p><span className="device-kicker"><Icon name={device === "pc" ? "monitor" : "smartphone"} />{device === "pc" ? "PC練習" : "スマートフォン練習"}</span><h1>7つのWORLDから選ぶ</h1><p>おすすめの順番はありますが、気になる場所から始めて大丈夫です。</p></div>
        <div className="heading-actions"><Link className="button button-secondary" href={`/learn/${device === "pc" ? "mobile" : "pc"}`}><Icon name={device === "pc" ? "smartphone" : "monitor"} />{device === "pc" ? "スマホ" : "PC"}へ切り替え</Link><Link className="button button-ghost" href={`/free-play/${device}`}><Icon name="practice" />フリープレイ</Link></div>
      </div>
      <div className="route-line" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
      <WorldListClient device={device} worlds={worlds} stages={stages} />
      <aside className="free-play-callout"><span><Icon name="practice" size={36} /></span><div><p className="eyebrow">NO MISSION, JUST TRY</p><h2>課題なしで自由に試す</h2><p>{device === "pc" ? "ブラウザや設定、ファイルを" : "アプリや共有、戻る操作を"}好きな順番で触れます。</p></div><Link className="button button-primary" href={`/free-play/${device}`}>フリープレイへ <Icon name="arrowRight" /></Link></aside>
    </div>
  );
}
