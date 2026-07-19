"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { journeyAreas, journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows パソコン",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android スマートフォン",
};

export function JourneyMap({ environment }: { environment: JourneyEnvironment }) {
  const { progress, hydrated, selectEnvironment } = useProgress();
  useEffect(() => selectEnvironment(environment), [environment, selectEnvironment]);

  const completed = useMemo(
    () => new Set(progress.completedMissionKeys.filter((key) => key.startsWith(`${environment}:`)).map((key) => key.split(":")[1])),
    [environment, progress.completedMissionKeys],
  );
  const nextMission = journeyMissions.find((mission) => !completed.has(mission.id)) ?? journeyMissions[0];
  const completionRate = Math.round((completed.size / journeyMissions.length) * 100);

  return (
    <div className="journey-page">
      <section className="journey-launch shell" aria-labelledby="journey-title">
        <div className="journey-launch__heading">
          <p>{environmentNames[environment]}で練習します</p>
          <h1 id="journey-title">どこから始めますか？</h1>
          <Link href="/start">使う機器を変える</Link>
        </div>

        <div className="journey-launch__choices">
          <Link href={`/mission/${environment}/${nextMission.id}`}>
            <span className="journey-launch__badge">続き</span>
            <strong>{completed.size ? "前回の続きから始める" : "最初の練習を始める"}</strong>
            <small>{nextMission.title}</small>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href={`/mission/${environment}/pointer`}>
            <span className="journey-launch__badge">最初</span>
            <strong>最初から始める</strong>
            <small>日付をクリックする練習から始めます。記録は消えません。</small>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="journey-launch__progress" aria-label={hydrated ? `32項目中${completed.size}項目完了` : "記録を読み込み中"}>
          <span>できた項目：{hydrated ? `${completed.size} / ${journeyMissions.length}` : "— / 32"}</span>
          <div><span style={{ width: `${completionRate}%` }} /></div>
        </div>
      </section>

      <details className="learning-list shell">
        <summary>学習内容を見る（32項目）</summary>
        <div className="learning-list__content">
          {journeyAreas.map((area) => {
            const missions = journeyMissions.filter((mission) => mission.areaId === area.id);
            return (
              <section key={area.id}>
                <h2>{area.order}. {area.title}</h2>
                <ol>
                  {missions.map((mission) => (
                    <li key={mission.id} className={completed.has(mission.id) ? "is-done" : ""}>
                      <Link href={`/mission/${environment}/${mission.id}`}><span>{completed.has(mission.id) ? "✓" : mission.order}</span>{mission.title}</Link>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </details>
    </div>
  );
}
