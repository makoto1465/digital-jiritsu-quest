"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

import { journeyAreas, journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android",
};

const areaMarks = ["●", "↗", "Aa", "⌕", "▰", "◇", "?", "◎"];

export function JourneyMap({ environment }: { environment: JourneyEnvironment }) {
  const { progress, hydrated, selectEnvironment } = useProgress();
  useEffect(() => selectEnvironment(environment), [environment, selectEnvironment]);

  const completed = useMemo(
    () => new Set(progress.completedMissionKeys.filter((key) => key.startsWith(`${environment}:`)).map((key) => key.split(":")[1])),
    [environment, progress.completedMissionKeys],
  );
  const nextMission = journeyMissions.find((mission) => !completed.has(mission.id)) ?? journeyMissions[0];
  const nextArea = journeyAreas.find((area) => area.id === nextMission.areaId) ?? journeyAreas[0];
  const completionRate = Math.round((completed.size / journeyMissions.length) * 100);

  return (
    <div className="journey-page">
      <section className="journey-hero shell">
        <div className="journey-hero__intro">
          <p className="section-label">あなたの練習環境</p>
          <div className="environment-line"><strong>{environmentNames[environment]}</strong><Link href="/start">環境を変える</Link></div>
          <h1>{completed.size === 0 ? "最初の一歩を、いっしょに。" : "今日は、この続きから。"}</h1>
          <p>全部を覚える必要はありません。画面を見て、小さく試し、戻せる力を一つずつ増やします。</p>
        </div>
        <aside className="next-mission" aria-label="次におすすめのミッション">
          <div className="next-mission__meta"><span>次におすすめ</span><span>{hydrated ? `${completed.size} / ${journeyMissions.length}` : "— / 32"}</span></div>
          <div className="next-mission__area"><span aria-hidden="true">{areaMarks[nextArea.order - 1]}</span>エリア {nextArea.order}・{nextArea.title}</div>
          <h2>{nextMission.title}</h2>
          <p>{nextMission.mission}</p>
          <Link className="primary-action" href={`/mission/${environment}/${nextMission.id}`}>{completed.size === 0 ? "最初の練習へ" : "続きを始める"}<span aria-hidden="true">→</span></Link>
          <div className="quiet-progress" aria-label={`全体の${completionRate}%完了`}><span style={{ width: `${completionRate}%` }} /></div>
        </aside>
      </section>

      <section className="learning-path shell" aria-labelledby="path-title">
        <div className="section-heading"><div><p className="section-label">32の実践ミッション</p><h2 id="path-title">できることが、つながっていく道</h2></div><p>同じ力が別の場面でも繰り返し現れます。気になる場所から試しても大丈夫です。</p></div>
        <ol className="area-path">
          {journeyAreas.map((area, areaIndex) => {
            const areaMissions = journeyMissions.filter((mission) => mission.areaId === area.id);
            const areaDone = areaMissions.filter((mission) => completed.has(mission.id)).length;
            const current = area.id === nextArea.id;
            return (
              <li aria-current={current ? "step" : undefined} className={`${current ? "is-current" : ""}${areaDone === 4 ? " is-complete" : ""}`} key={area.id}>
                <div className="area-path__rail"><span>{areaDone === 4 ? "✓" : areaMarks[areaIndex]}</span></div>
                <article>
                  <div className="area-path__heading"><p>AREA {String(area.order).padStart(2, "0")}</p><span>{areaDone} / 4{current ? <span className="sr-only">・現在のおすすめエリア</span> : null}</span></div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <ol className="mission-mini-list">
                    {areaMissions.map((mission) => (
                      <li key={mission.id} className={completed.has(mission.id) ? "is-done" : ""}>
                        <Link href={`/mission/${environment}/${mission.id}`}><span>{completed.has(mission.id) ? "✓" : mission.order}</span>{mission.title}</Link>
                      </li>
                    ))}
                  </ol>
                  <Link className="text-link" href={`/journey/${environment}/area/${area.id}`}>{area.title}を見る <span aria-hidden="true">→</span></Link>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="practice-invite shell">
        <div><p className="section-label">自由練習</p><h2>課題を離れて、好きに触ってみる</h2><p>ブラウザ、文字、ファイル、設定。操作の結果は履歴で確かめられ、いつでも元へ戻せます。</p></div>
        <Link className="secondary-action" href={`/practice/${environment}`}>自由練習を開く <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
