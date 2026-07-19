"use client";

import Link from "next/link";

import { journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";
import { getAreaDescription, getAreaTitle, getMissionSummary, getMissionTitle } from "@/lib/journey-copy";
import type { JourneyArea } from "@/lib/journey-types";

export function AreaExperience({ environment, area }: { environment: JourneyEnvironment; area: JourneyArea }) {
  const { progress } = useProgress();
  const missions = journeyMissions.filter((mission) => mission.areaId === area.id);
  return (
    <div className="area-page shell">
      <Link className="back-link" href={`/journey/${environment}`}>← 学習メニューへ戻る</Link>
      <header className="area-page__header">
        <p className="section-label">{area.order}番目の内容・練習4項目</p>
        <h1>{getAreaTitle(area, environment)}</h1>
        <p>{getAreaDescription(area, environment)}</p>
        <div><span>この4項目でできるようになること</span><strong>{area.outcome}</strong></div>
      </header>
      <ol className="mission-list">
        {missions.map((mission, index) => {
          const completed = progress.completedMissionKeys.includes(`${environment}:${mission.id}`);
          return <li key={mission.id}><span className="mission-list__number">{completed ? "✓" : String(index + 1).padStart(2, "0")}</span><div><div className="mission-list__meta"><span>{mission.estimatedMinutes}分ほど</span><span className={`risk-chip risk-chip--${mission.danger.level}`}>{mission.danger.label}</span></div><h2>{getMissionTitle(mission, environment)}</h2><p>{getMissionSummary(mission, environment)}</p><small>{mission.competency}</small></div><Link href={`/mission/${environment}/${mission.id}`}>{completed ? "もう一度試す" : "始める"}<span aria-hidden="true">→</span></Link></li>;
        })}
      </ol>
    </div>
  );
}
