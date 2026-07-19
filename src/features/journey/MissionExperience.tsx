"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlossaryTerm, areaTerms } from "@/components/learning/GlossaryTerm";
import { journeyAreas, journeyMissions } from "@/content/journey";
import { PracticalLab } from "@/features/lab/PracticalLab";
import { useProgress, type JourneyEnvironment, type SupportLevel } from "@/features/progress/ProgressProvider";
import type { MissionDefinition } from "@/lib/journey-types";

type MissionPhase = "intro" | "practice" | "complete";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows パソコン",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android スマートフォン",
};

export function MissionExperience({ environment, mission }: { environment: JourneyEnvironment; mission: MissionDefinition }) {
  const [phase, setPhase] = useState<MissionPhase>("intro");
  const [hintLevel, setHintLevel] = useState<SupportLevel>(0);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [wasCompletedBeforeAttempt, setWasCompletedBeforeAttempt] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { progress, completeMission, recordMissionAttempt, recordJourneyHint, recordJourneyRecovery } = useProgress();
  const area = journeyAreas.find((item) => item.id === mission.areaId) ?? journeyAreas[0];
  const missionIndex = journeyMissions.findIndex((item) => item.id === mission.id);
  const nextMission = journeyMissions[missionIndex + 1];
  const alreadyCompleted = progress.completedMissionKeys.includes(`${environment}:${mission.id}`);
  const operation = mission.environmentOperations[environment];

  useEffect(() => { headingRef.current?.focus(); }, [phase]);

  function beginPractice() {
    setWasCompletedBeforeAttempt(alreadyCompleted);
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
    setEvidence(collectedEvidence);
    completeMission(environment, mission.id, mission.competencyIds, hintLevel, collectedEvidence);
    setPhase("complete");
  }, [completeMission, environment, hintLevel, mission.competencyIds, mission.id]);

  function restart() {
    setEvidence([]);
    setHintLevel(0);
    setPhase("intro");
  }

  const hintText = hintLevel === 1 ? mission.hints.direction : hintLevel === 2 ? mission.hints.feature : hintLevel === 3 ? mission.hints.action[environment] : "";

  return (
    <div className={`mission-page mission-phase--${phase}`}>
      <div className="mission-progress" aria-label={`全32項目中${mission.order}番目`}><span style={{ width: `${(mission.order / journeyMissions.length) * 100}%` }} /></div>

      {phase === "intro" ? (
        <section className="mission-intro shell shell--narrow">
          <header>
            <p>{area.order}. {area.title}　・　{mission.estimatedMinutes}分ほど</p>
            <h1 ref={headingRef} tabIndex={-1}>{mission.title}</h1>
            <div className="mission-task"><span>やること</span><strong>{mission.mission}</strong></div>
          </header>

          <section className="mission-steps" aria-labelledby="steps-title">
            <h2 id="steps-title">この順番で操作します</h2>
            <ol>
              {operation.steps.slice(0, 3).map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}
            </ol>
            <p>{operation.difference}</p>
          </section>

          <section className="mission-terms" aria-label="先に覚える言葉">
            <strong>青い言葉を押すと、意味が分かります。</strong>
            <div>{areaTerms[mission.areaId].map((term) => <GlossaryTerm key={term} term={term} />)}</div>
          </section>

          <div className={`safety-boundary safety-boundary--${mission.danger.level}`}><span>{mission.danger.label}</span><p>{mission.danger.message}</p></div>
          <div className="mission-intro__actions">
            <Link href={`/journey/${environment}`}>学習メニューへ戻る</Link>
            <button className="primary-action" type="button" onClick={beginPractice}>練習を始める <span aria-hidden="true">→</span></button>
          </div>
        </section>
      ) : null}

      {phase === "practice" ? (
        <section className="mission-practice shell shell--wide">
          <header className="mission-practice__heading"><div><p>{environmentNames[environment]}で練習中</p><h1 ref={headingRef} tabIndex={-1}>{mission.title}</h1></div><span className={`risk-chip risk-chip--${mission.danger.level}`}>{mission.danger.label}</span></header>
          <PracticalLab environment={environment} missionId={mission.id} onComplete={finishMission} onRecovery={() => recordJourneyRecovery(environment, mission.id)} />
          <aside className="hint-drawer" aria-label="ヒント">
            <div><span>ヒント {hintLevel} / 3</span>{hintText ? <p aria-live="polite">{hintText}</p> : <p>困ったときだけ、右のボタンを押してください。</p>}</div>
            <button type="button" onClick={revealHint} disabled={hintLevel >= 3}>{hintLevel === 0 ? "ヒントを見る" : hintLevel < 3 ? "次のヒントを見る" : "すべて表示しました"}</button>
          </aside>
        </section>
      ) : null}

      {phase === "complete" ? (
        <section className="mission-clear shell shell--narrow">
          <div className="celebration" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}<span>✓</span></div>
          <p className="mission-clear__label">練習できました</p>
          <h1 ref={headingRef} tabIndex={-1}>{wasCompletedBeforeAttempt ? "もう一度できました！" : "できました！"}</h1>
          <p className="mission-statement">{mission.afterCompletion}</p>
          <div className="clear-evidence">
            <p>今回できたこと</p>
            <dl><div><dt>練習した操作</dt><dd>{mission.title}</dd></div><div><dt>使ったヒント</dt><dd>{hintLevel === 0 ? "なし" : `${hintLevel}回`}</dd></div><div><dt>確認できたこと</dt><dd>{evidence.length}件</dd></div></dl>
          </div>
          <div className="clear-actions">
            {nextMission ? <Link className="primary-action" href={`/mission/${environment}/${nextMission.id}`}>次の練習へ <span aria-hidden="true">→</span></Link> : <Link className="primary-action" href={`/practice/${environment}`}>自由練習へ <span aria-hidden="true">→</span></Link>}
            <Link className="secondary-action" href={`/journey/${environment}`}>学習メニューへ戻る</Link>
            <button className="text-button" type="button" onClick={restart}>同じ練習をもう一度</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
