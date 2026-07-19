"use client";

import Link from "next/link";

import { journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";
import type { JourneyArea } from "@/lib/journey-types";

export function AreaExperience({ environment, area }: { environment: JourneyEnvironment; area: JourneyArea }) {
  const { progress } = useProgress();
  const missions = journeyMissions.filter((mission) => mission.areaId === area.id);
  return (
    <div className="area-page shell">
      <Link className="back-link" href={`/journey/${environment}`}>← 全体の道へ戻る</Link>
      <header className="area-page__header">
        <p className="section-label">AREA {String(area.order).padStart(2, "0")} ・ 4 MISSIONS</p>
        <h1>{area.title}</h1>
        <p>{area.description}</p>
        <div><span>このエリアの到達点</span><strong>{area.outcome}</strong></div>
      </header>
      <ol className="mission-list">
        {missions.map((mission, index) => {
          const completed = progress.completedMissionKeys.includes(`${environment}:${mission.id}`);
          return <li key={mission.id}><span className="mission-list__number">{completed ? "✓" : String(index + 1).padStart(2, "0")}</span><div><div className="mission-list__meta"><span>{mission.estimatedMinutes}分ほど</span><span className={`risk-chip risk-chip--${mission.danger.level}`}>{mission.danger.label}</span></div><h2>{mission.title}</h2><p>{mission.mission}</p><small>{mission.competency}</small></div><Link href={`/mission/${environment}/${mission.id}`}>{completed ? "もう一度試す" : "始める"}<span aria-hidden="true">→</span></Link></li>;
        })}
      </ol>
    </div>
  );
}
