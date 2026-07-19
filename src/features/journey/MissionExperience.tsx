"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { journeyAreas, journeyMissions } from "@/content/journey";
import { PracticalLab } from "@/features/lab/PracticalLab";
import { useProgress, type JourneyEnvironment, type SupportLevel } from "@/features/progress/ProgressProvider";
import { getAreaTitle, getMissionSummary, getMissionTitle } from "@/lib/journey-copy";
import type { MissionDefinition } from "@/lib/journey-types";

type MissionPhase = "intro" | "practice";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows パソコン",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android スマートフォン",
};

export function MissionExperience({ environment, mission }: { environment: JourneyEnvironment; mission: MissionDefinition }) {
  const [phase, setPhase] = useState<MissionPhase>("intro");
  const [hintLevel, setHintLevel] = useState<SupportLevel>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { completeMission, recordMissionAttempt, recordJourneyHint, recordJourneyRecovery } = useProgress();
  const area = journeyAreas.find((item) => item.id === mission.areaId) ?? journeyAreas[0];
  const missionIndex = journeyMissions.findIndex((item) => item.id === mission.id);
  const nextMission = journeyMissions[missionIndex + 1];
  const missionTitle = getMissionTitle(mission, environment);
  const missionSummary = getMissionSummary(mission, environment);
  const areaTitle = getAreaTitle(area, environment);

  useEffect(() => { headingRef.current?.focus(); }, [phase]);

  function beginPractice() {
    recordMissionAttempt(environment, mission.id);
    setPhase("practice");
  }

  function revealHint() {
    if (hintLevel >= 3) return;
    const next = (hintLevel + 1) as SupportLevel;
    setHintLevel(next);
    recordJourneyHint(environment, mission.id);
  }

  const finishMission = useCallback((collectedEvidence: string[]) => {
    completeMission(environment, mission.id, mission.competencyIds, hintLevel, collectedEvidence);
  }, [completeMission, environment, hintLevel, mission.competencyIds, mission.id]);

  const hintText = hintLevel === 1 ? mission.hints.direction : hintLevel === 2 ? mission.hints.feature : hintLevel === 3 ? mission.hints.action[environment] : "";
  const completion = {
    hintLevel,
    menuHref: `/journey/${environment}`,
    nextHref: nextMission ? `/mission/${environment}/${nextMission.id}` : `/practice/${environment}`,
    nextLabel: nextMission ? "次の練習へ" : "自由練習へ",
  };

  return (
    <div className={`mission-page mission-phase--${phase}`}>
      <div className="mission-progress" aria-label={`全32項目中${mission.order}番目`}><span style={{ width: `${(mission.order / journeyMissions.length) * 100}%` }} /></div>

      {phase === "intro" ? (
        <section className="mission-intro shell shell--narrow">
          <header>
            <p>{area.order}. {areaTitle}　・　{mission.estimatedMinutes}分ほど</p>
            <h1 ref={headingRef} tabIndex={-1}>{missionTitle}</h1>
            <div className="mission-task"><span>練習すること</span><strong>{missionSummary}</strong></div>
          </header>

          <div className={`safety-boundary safety-boundary--${mission.danger.level}`}><span>{mission.danger.label}</span><p>{mission.danger.message}</p></div>
          <div className="mission-intro__actions">
            <Link href={`/journey/${environment}`}>学習メニューへ戻る</Link>
            <button className="primary-action" type="button" onClick={beginPractice}>練習を始める <span aria-hidden="true">→</span></button>
          </div>
        </section>
      ) : null}

      {phase === "practice" ? (
        <section className="mission-practice shell shell--wide">
          <header className="mission-practice__heading"><div><p>{environmentNames[environment]}で練習中</p><h1 ref={headingRef} tabIndex={-1}>{missionTitle}</h1></div><span className={`risk-chip risk-chip--${mission.danger.level}`}>{mission.danger.label}</span></header>
          <PracticalLab completion={completion} environment={environment} missionId={mission.id} onComplete={finishMission} onRecovery={() => recordJourneyRecovery(environment, mission.id)} />
          <aside className="hint-drawer" aria-label="ヒント">
            <div><span>ヒント {hintLevel} / 3</span>{hintText ? <p aria-live="polite">{hintText}</p> : <p>困ったときだけ、右のボタンを押してください。</p>}</div>
            <button type="button" onClick={revealHint} disabled={hintLevel >= 3}>{hintLevel === 0 ? "ヒントを見る" : hintLevel < 3 ? "次のヒントを見る" : "すべて表示しました"}</button>
          </aside>
        </section>
      ) : null}

    </div>
  );
}
