"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { journeyAreas, journeyMissions } from "@/content/journey";
import { PracticalLab } from "@/features/lab/PracticalLab";
import { useProgress, type JourneyEnvironment, type SupportLevel } from "@/features/progress/ProgressProvider";
import type { MissionDefinition } from "@/lib/journey-types";

type MissionPhase = "purpose" | "orientation" | "practice" | "complete";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android",
};

export function MissionExperience({ environment, mission }: { environment: JourneyEnvironment; mission: MissionDefinition }) {
  const [phase, setPhase] = useState<MissionPhase>("purpose");
  const [hintLevel, setHintLevel] = useState<SupportLevel>(0);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [wasCompletedBeforeAttempt, setWasCompletedBeforeAttempt] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
    progress,
    completeMission,
    recordMissionAttempt,
    recordJourneyHint,
    recordJourneyRecovery,
  } = useProgress();
  const area = journeyAreas.find((item) => item.id === mission.areaId) ?? journeyAreas[0];
  const missionIndex = journeyMissions.findIndex((item) => item.id === mission.id);
  const nextMission = journeyMissions[missionIndex + 1];
  const alreadyCompleted = progress.completedMissionKeys.includes(`${environment}:${mission.id}`);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  const beginPractice = () => {
    setWasCompletedBeforeAttempt(alreadyCompleted);
    recordMissionAttempt(environment, mission.id);
    setPhase("practice");
  };

  const revealHint = () => {
    if (hintLevel >= 3) return;
    const next = (hintLevel + 1) as SupportLevel;
    setHintLevel(next);
    recordJourneyHint(environment, mission.id);
  };

  const finishMission = useCallback((collectedEvidence: string[]) => {
    setEvidence(collectedEvidence);
    completeMission(environment, mission.id, mission.competencyIds, hintLevel, collectedEvidence);
    setPhase("complete");
  }, [completeMission, environment, hintLevel, mission.competencyIds, mission.id]);

  const restart = () => {
    setEvidence([]);
    setHintLevel(0);
    setPhase("purpose");
  };

  const hintText = hintLevel === 1
    ? mission.hints.direction
    : hintLevel === 2
      ? mission.hints.feature
      : hintLevel === 3
        ? mission.hints.action[environment]
        : "";

  return (
    <div className={`mission-page mission-phase--${phase}`}>
      <div className="mission-progress" aria-label={`全32ミッション中${mission.order}番目`}>
        <span style={{ width: `${(mission.order / journeyMissions.length) * 100}%` }} />
      </div>

      {phase === "purpose" ? (
        <section className="mission-brief shell shell--narrow">
          <div className="mission-brief__meta"><span>AREA {area.order}・{area.title}</span><span>{mission.estimatedMinutes}分ほど</span></div>
          <p className="section-label">MISSION {String(mission.order).padStart(2, "0")}</p>
          <h1 ref={headingRef} tabIndex={-1}>{mission.title}</h1>
          <p className="mission-statement">{mission.mission}</p>
          <div className="briefing-focus"><span aria-hidden="true">◎</span><div><p>今日できるようになること</p><strong>{mission.objective}</strong></div></div>
          <div className={`safety-boundary safety-boundary--${mission.danger.level}`}><span>{mission.danger.label}</span><p>{mission.danger.message}</p></div>
          <div className="mission-brief__actions"><Link className="text-link" href={`/journey/${environment}`}>今日はやめておく</Link><button className="primary-action" type="button" onClick={() => setPhase("orientation")}>練習の準備へ <span aria-hidden="true">→</span></button></div>
        </section>
      ) : null}

      {phase === "orientation" ? (
        <section className="mission-brief shell shell--narrow">
          <p className="section-label">{environmentNames[environment]}で試します</p>
          <h1 ref={headingRef} tabIndex={-1}>最初に、画面の手掛かりを見ます</h1>
          <p className="mission-statement">練習画面は壊れません。すぐに正解を探さず、操作した後に何が変わったかを見てください。</p>
          {mission.guidance === "show" ? (
            <div className="orientation-example"><span>最初のミッションなので見本があります</span><ol>{mission.environmentOperations[environment].steps.map((step) => <li key={step}>{step}</li>)}</ol><p>{mission.environmentOperations[environment].difference}</p></div>
          ) : mission.guidance === "coach" ? (
            <div className="orientation-example orientation-example--light"><span>覚えておく手掛かり</span><p>{mission.environmentOperations[environment].difference}</p><p>必要になったら、練習中にヒントを一段ずつ開けます。</p></div>
          ) : (
            <div className="orientation-example orientation-example--challenge"><span>自力チャレンジ</span><p>操作手順は先に表示しません。目的と安全範囲を手掛かりに進み、困ったときは調べる方法も選べます。</p></div>
          )}
          <div className="mission-brief__actions"><button className="secondary-action" type="button" onClick={() => setPhase("purpose")}>← 目的を見直す</button><button className="primary-action" type="button" onClick={beginPractice}>安全な練習画面を開く <span aria-hidden="true">→</span></button></div>
        </section>
      ) : null}

      {phase === "practice" ? (
        <section className="mission-practice shell shell--wide">
          <header className="mission-practice__heading"><div><p className="section-label">MISSION {String(mission.order).padStart(2, "0")} ・ {environmentNames[environment]}</p><h1 ref={headingRef} tabIndex={-1}>{mission.title}</h1></div><span className={`risk-chip risk-chip--${mission.danger.level}`}>{mission.danger.label}</span></header>
          <PracticalLab environment={environment} missionId={mission.id} onComplete={finishMission} onRecovery={() => recordJourneyRecovery(environment, mission.id)} />
          <aside className="hint-drawer" aria-label="段階ヒント">
            <div><span>手掛かり {hintLevel} / 3</span>{hintText ? <p aria-live="polite">{hintText}</p> : <p>まだ手掛かりを使っていません。まず自由に観察できます。</p>}</div>
            <button type="button" onClick={revealHint} disabled={hintLevel >= 3}>{hintLevel === 0 ? "手掛かりを一つ見る" : hintLevel < 3 ? "もう少し具体的に" : "すべて表示済み"}</button>
          </aside>
        </section>
      ) : null}

      {phase === "complete" ? (
        <section className="mission-clear shell shell--narrow">
          <div className="clear-orbit" aria-hidden="true"><span>✓</span></div>
          <p className="section-label">MISSION COMPLETE</p>
          <h1 ref={headingRef} tabIndex={-1}>{wasCompletedBeforeAttempt ? "もう一度、確かめられました。" : "生活で使える一歩です。"}</h1>
          <p className="mission-statement">{mission.afterCompletion}</p>
          <div className="clear-evidence"><p>今回の記録</p><dl><div><dt>支援</dt><dd>{hintLevel === 0 ? "ヒントなし" : hintLevel === 1 ? "方向だけ" : hintLevel === 2 ? "機能名まで" : "具体操作まで"}</dd></div><div><dt>確かめた状態</dt><dd>{evidence.length}件</dd></div><div><dt>次に再登場</dt><dd>{mission.transferTo.length ? journeyMissions.find((item) => item.id === mission.transferTo[0])?.title ?? "別の生活場面" : "自由練習"}</dd></div></dl></div>
          <blockquote>「正しいボタンを覚えた」ではなく、<strong>画面を見て、試し、結果を確かめた</strong>ことが今回の成果です。</blockquote>
          <div className="clear-actions">{nextMission ? <Link className="primary-action" href={`/mission/${environment}/${nextMission.id}`}>次のミッションへ <span aria-hidden="true">→</span></Link> : <Link className="primary-action" href={`/practice/${environment}`}>自由練習へ <span aria-hidden="true">→</span></Link>}<Link className="secondary-action" href={`/journey/${environment}`}>全体の道を見る</Link><button className="text-button" type="button" onClick={restart}>同じ練習をもう一度</button></div>
        </section>
      ) : null}
    </div>
  );
}
