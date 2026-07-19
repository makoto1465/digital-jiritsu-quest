"use client";

import Link from "next/link";

import { journeyAreas, journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";

const competencyCopy = [
  ["C1", "操作する", "選ぶ・動かす・入力する"],
  ["C2", "画面を読む", "現在地・戻る・切替を理解する"],
  ["C3", "探して確かめる", "検索し、発信元と日付を見る"],
  ["C4", "情報を整理する", "ファイル・写真・添付を扱う"],
  ["C5", "安全に判断する", "確定前に止まり、必要性を考える"],
  ["C6", "戻して直す", "エラーを読み、復旧する"],
  ["C7", "別の場面で使う", "未知の画面でも目的へ進む"],
] as const;

const environmentNames: Record<JourneyEnvironment, string> = { windows: "Windows", mac: "Mac", iphone: "iPhone", android: "Android" };

export function ProgressDashboard() {
  const { progress, hydrated } = useProgress();
  const environment = progress.selectedEnvironment ?? "windows";
  const completed = new Set(progress.completedMissionKeys.filter((key) => key.startsWith(`${environment}:`)).map((key) => key.split(":")[1]));
  const nextMission = journeyMissions.find((mission) => !completed.has(mission.id));
  const completionRate = Math.round((completed.size / journeyMissions.length) * 100);

  return <div className="progress-page shell">
    <header className="progress-hero"><div><p className="section-label">YOUR LEARNING EVIDENCE</p><h1>点数ではなく、<br />できるようになったこと。</h1><p>ヒントを使ったことも、間違いを戻したことも、次に自力で進むための大切な記録です。</p></div><div className="progress-orbit"><strong>{hydrated ? completionRate : 0}<small>%</small></strong><span>{environmentNames[environment]}・{completed.size} / 32</span></div></header>
    <section className="next-step-band"><div><span>次の一歩</span><strong>{nextMission?.title ?? "32ミッションを一巡しました"}</strong></div>{nextMission ? <Link className="primary-action" href={`/mission/${environment}/${nextMission.id}`}>続きを試す →</Link> : <Link className="primary-action" href={`/practice/${environment}`}>自由練習へ →</Link>}</section>
    <section className="evidence-section" aria-labelledby="ability-title"><div className="section-heading"><div><p className="section-label">7つの自立する力</p><h2 id="ability-title">経験が、別の場面へつながる</h2></div><p>「一度できた」から、別の場面でも自分でできる状態を目指します。</p></div><div className="ability-grid">{competencyCopy.map(([id, title, description], index) => { const count = progress.competencyEvidence[id] ?? 0; const level = count === 0 ? "これから" : count < 2 ? "一緒にできた" : count < 4 ? "手掛かりでできた" : count < 6 ? "自力でできた" : "別の場面でもできた"; return <article key={id}><span className={count ? "has-evidence" : ""}>{index + 1}</span><div><h3>{title}</h3><p>{description}</p><strong>{level}</strong></div></article>; })}</div></section>
    <section className="evidence-section" aria-labelledby="area-record-title"><div className="section-heading"><div><p className="section-label">8つのエリア</p><h2 id="area-record-title">学びの記録</h2></div><p>完了数より、どんな操作を自分で再現できたかを見直せます。</p></div><ol className="progress-area-list">{journeyAreas.map((area) => { const missions = journeyMissions.filter((mission) => mission.areaId === area.id); const count = missions.filter((mission) => completed.has(mission.id)).length; return <li key={area.id}><span>{String(area.order).padStart(2, "0")}</span><div><h3>{area.title}</h3><div className="quiet-progress"><span style={{ width: `${(count / 4) * 100}%` }} /></div></div><strong>{count} / 4</strong><Link href={`/journey/${environment}/area/${area.id}`}>見る<span className="sr-only">：{area.title}</span></Link></li>; })}</ol></section>
    <section className="learning-behavior"><div><span>↶</span><strong>{progress.recoveries}</strong><p>回、戻して解決した</p></div><div><span>?</span><strong>{progress.hintUses}</strong><p>回、手掛かりを使った</p></div><div><span>◎</span><strong>{progress.attempts}</strong><p>回、まず試してみた</p></div></section>
    <p className="privacy-footnote">記録はこのブラウザ内だけに保存されます。氏名、入力した文章、パスワードは保存しません。</p>
  </div>;
}
