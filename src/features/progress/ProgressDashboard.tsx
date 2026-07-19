"use client";

import Link from "next/link";
import { badges, stages, worlds } from "@/content";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "./ProgressProvider";

const competencyDetails: { id: string; label: string; description: string; icon: IconName }[] = [
  { id: "safe-experiment", label: "安全に試す", description: "試しやすい操作と注意する操作を見分ける", icon: "shield" },
  { id: "research", label: "自分で調べる", description: "検索・辞典・FAQから手がかりを探す", icon: "search" },
  { id: "recovery", label: "元に戻す", description: "戻る・閉じる・やり直しで落ち着いて復旧する", icon: "undo" },
  { id: "observation", label: "画面を観察する", description: "文字、マーク、配置から次の操作を考える", icon: "eye" },
  { id: "transfer", label: "別の場面へ応用する", description: "覚えた考え方を違うアプリでも使う", icon: "practice" },
  { id: "independent-exploration", label: "未知の画面を探索する", description: "目的を分けて、自分で道筋を組み立てる", icon: "award" },
];

export function ProgressDashboard() {
  const { progress, hydrated } = useProgress();
  const completeRate = (progress.completedStageIds.length / stages.length) * 100;
  return (
    <div className="progress-dashboard">
      <section className="progress-hero">
        <div><p className="eyebrow">YOUR PROGRESS</p><h1>できるようになったこと</h1><p>速さや正解率ではなく、試したこと・調べたこと・戻せたことを記録しています。</p></div>
        <div className="level-card"><span>いまの称号</span><strong>{progress.completedStageIds.length >= 7 ? "自分で進む探検家" : progress.completedStageIds.length >= 3 ? "落ち着いて試せる人" : "はじめの一歩"}</strong><p><Icon name="star" /> {progress.xp} XP</p></div>
      </section>
      {!hydrated ? <p className="loading-note" role="status">保存した記録を読み込んでいます…</p> : null}
      <section className="overall-progress card-surface"><div><h2>全体の進み具合</h2><p>{stages.length}ステージ中 {progress.completedStageIds.length}ステージを体験</p></div><ProgressBar value={completeRate} label="全ステージ" /><Link className="button button-primary" href="/start">練習をつづける<Icon name="arrowRight" /></Link></section>
      <section aria-labelledby="activity-heading"><div className="section-heading-row"><div><p className="eyebrow">LEARNING EVIDENCE</p><h2 id="activity-heading">あなたが積み重ねた行動</h2></div></div><div className="stat-grid"><article><Icon name="practice" /><strong>{progress.attempts}</strong><span>回 試してみた</span></article><article><Icon name="lightbulb" /><strong>{progress.hintUses}</strong><span>回 ヒントで発見</span></article><article><Icon name="book" /><strong>{progress.glossaryViews}</strong><span>回 ことばを確認</span></article><article><Icon name="undo" /><strong>{progress.recoveries}</strong><span>回 戻して解決</span></article></div></section>
      <section aria-labelledby="skills-heading"><div className="section-heading-row"><div><p className="eyebrow">SIX COMPETENCIES</p><h2 id="skills-heading">育っている6つの力</h2></div></div><div className="competency-grid">{competencyDetails.map((item) => { const count = progress.competencyEvidence[item.id] ?? 0; return <article key={item.id}><span className={count ? "has-evidence" : ""}><Icon name={item.icon} /></span><div><h3>{item.label}</h3><p>{item.description}</p><small>{count === 0 ? "これから" : count === 1 ? "やってみた" : count < 3 ? "慣れてきた" : "自分でできた"}</small></div></article>; })}</div></section>
      <section aria-labelledby="world-progress-heading"><div className="section-heading-row"><div><p className="eyebrow">WORLD MAP</p><h2 id="world-progress-heading">WORLDごとの記録</h2></div></div><div className="world-progress-list">{worlds.map((world) => { const worldStages = stages.filter((stage) => stage.worldId === world.id); const done = worldStages.filter((stage) => progress.completedStageIds.includes(stage.id)).length; return <article key={world.id}><span className={`world-number world-${world.order}`}>{world.order}</span><div><h3>{world.shortTitle}</h3><ProgressBar value={(done / worldStages.length) * 100} label={`${done} / ${worldStages.length} ステージ`} /></div><Link href="/start">練習する<span className="sr-only">：{world.shortTitle}</span><Icon name="chevronRight" /></Link></article>; })}</div></section>
      <section aria-labelledby="badges-heading"><div className="section-heading-row"><div><p className="eyebrow">BADGES</p><h2 id="badges-heading">見つけたバッジ</h2></div><p>{progress.badgeIds.length} / {badges.length}</p></div><div className="badge-grid">{badges.map((badge) => { const earned = progress.badgeIds.includes(badge.id); return <article className={earned ? "is-earned" : "is-locked"} key={badge.id}><span aria-hidden="true">{earned ? badge.icon : "○"}</span><div><h3>{earned ? badge.name : "これから見つかるバッジ"}</h3><p>{earned ? badge.encouragement : badge.description}</p></div></article>; })}</div></section>
    </div>
  );
}
