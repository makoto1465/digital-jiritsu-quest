"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { journeyMissions } from "@/content/journey";
import type { JourneyEnvironment } from "@/features/progress/ProgressProvider";
import {
  FilesWorkspace,
  IndependentWorkspace,
  MovementWorkspace,
  RecoveryWorkspace,
  SafetyWorkspace,
  ScreensWorkspace,
  TextWorkspace,
  WebWorkspace,
  type WorkspaceProps,
} from "@/features/lab/LabWorkspaces";
import { evaluateChallenge, missionChallenges, type WorkspaceId } from "@/features/lab/mission-challenges";

interface ActionLog {
  id: number;
  eventId: string;
  message: string;
}

interface PracticalLabProps {
  environment: JourneyEnvironment;
  missionId?: string;
  onComplete?: (evidence: string[]) => void;
  onAction?: (eventId: string) => void;
  onRecovery?: () => void;
  freePlay?: boolean;
}

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android",
};

const workspaceLabels: Record<WorkspaceId, string> = {
  movement: "基本操作",
  screens: "画面とアプリ",
  text: "文字",
  web: "検索",
  files: "ファイル",
  safety: "安全",
  recovery: "困ったとき",
  independent: "総合練習",
};

const workspaceComponents: Record<WorkspaceId, (props: WorkspaceProps) => React.ReactNode> = {
  movement: (props) => <MovementWorkspace {...props} />,
  screens: (props) => <ScreensWorkspace {...props} />,
  text: (props) => <TextWorkspace {...props} />,
  web: (props) => <WebWorkspace {...props} />,
  files: (props) => <FilesWorkspace {...props} />,
  safety: (props) => <SafetyWorkspace {...props} />,
  recovery: (props) => <RecoveryWorkspace {...props} />,
  independent: (props) => <IndependentWorkspace {...props} />,
};

export function PracticalLab({ environment, missionId = "pointer", onComplete, onAction, onRecovery, freePlay = false }: PracticalLabProps) {
  const challenge = missionChallenges[missionId] ?? missionChallenges.pointer;
  const mission = journeyMissions.find((item) => item.id === missionId);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>(challenge.workspace);
  const [actions, setActions] = useState<ActionLog[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const sequenceRef = useRef(0);
  const completionReported = useRef(false);
  const eventIds = useMemo(() => actions.map((action) => action.eventId), [actions]);
  const evaluation = useMemo(() => evaluateChallenge(challenge, eventIds), [challenge, eventIds]);
  const successEvidence = useMemo(() => {
    if (!evaluation.complete || !mission) return eventIds;
    return [
      ...mission.success.states.map((state) => `state:${state.key}`),
      ...mission.success.evidence.filter((item) => item.required).map((item) => `evidence:${item.key}`),
    ];
  }, [evaluation.complete, eventIds, mission]);
  const displayedObjective = missionId === "pointer" && (environment === "windows" || environment === "mac")
    ? `${challenge.objective} 青いフォルダーではダブルクリックも自由に試せます。`
    : challenge.objective;

  useEffect(() => {
    if (freePlay || !evaluation.complete || completionReported.current) return;
    completionReported.current = true;
    onComplete?.(successEvidence);
  }, [evaluation.complete, freePlay, onComplete, successEvidence]);

  const emit = (eventId: string, message: string) => {
    setActions((current) => {
      if (current.some((action) => action.eventId === eventId)) return current;
      onAction?.(eventId);
      sequenceRef.current += 1;
      return [...current, { id: sequenceRef.current, eventId, message }];
    });
  };

  const reset = () => {
    setActions([]);
    setSessionKey((current) => current + 1);
    completionReported.current = false;
    onRecovery?.();
  };

  const renderWorkspace = (workspace: WorkspaceId) => workspaceComponents[workspace]({
    environment,
    missionId,
    emit,
  });

  return (
    <section className={`practical-lab practical-lab--${environment}`} aria-label={`${environmentNames[environment]}の練習画面`}>
      <header className="practical-lab__header">
        <div>
          <p><span className="live-dot" /> 安全な練習環境</p>
          <strong>{environmentNames[environment]} ラボ</strong>
        </div>
        <p>この中の操作は実際のデータへ影響しません</p>
      </header>

      {freePlay ? (
        <nav className="lab-workspace-tabs" aria-label="練習する場所">
          {(Object.keys(workspaceLabels) as WorkspaceId[]).filter((id) => id !== "independent").map((id) => (
            <button aria-pressed={activeWorkspace === id} key={id} type="button" onClick={() => setActiveWorkspace(id)}>{workspaceLabels[id]}</button>
          ))}
        </nav>
      ) : (
        <div className="lab-mission-strip">
          <span>今回の目的</span>
          <p>{displayedObjective}</p>
          <div className="lab-state-meter" aria-label={`${evaluation.totalGroups}項目中${evaluation.completedGroups}項目の状態を確認`}>
            {challenge.required.map((_, index) => <span className={index < evaluation.completedGroups ? "is-done" : ""} key={index} />)}
          </div>
        </div>
      )}

      <div className="practical-lab__body" key={`${activeWorkspace}-${sessionKey}`}>
        {renderWorkspace(activeWorkspace)}
      </div>

      <footer className="practical-lab__footer">
        <div className={`lab-feedback${evaluation.blocked ? " is-warning" : evaluation.complete ? " is-complete" : ""}`} aria-live="polite">
          <span aria-hidden="true">{evaluation.blocked ? "!" : evaluation.complete ? "✓" : actions.length ? "↳" : "○"}</span>
          <p>{evaluation.blocked ? "確定前に止まりたい操作でした。練習をやり直し、別の安全な経路を探せます。" : evaluation.complete ? mission?.success.summary ?? challenge.successNote : actions.at(-1)?.message ?? "まず画面を観察して、試してよい操作から始めましょう。"}</p>
        </div>
        <div className="lab-recovery-actions">
          <button type="button" onClick={reset}>↶ この練習を最初からやり直す</button>
        </div>
        <details className="action-history">
          <summary>操作と画面の変化を見る <span>{actions.length}</span></summary>
          {actions.length ? <ol>{actions.map((action) => <li key={action.id}>{action.message}</li>)}</ol> : <p>操作すると、ここに画面の変化が残ります。</p>}
        </details>
      </footer>
    </section>
  );
}
