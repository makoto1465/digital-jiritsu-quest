"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { GlossaryText } from "@/components/learning/GlossaryTerm";
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
import { evaluateChallenge, missionChallenges, resolveChallengeObjective, type WorkspaceId } from "@/features/lab/mission-challenges";
import { getMissionTitle } from "@/lib/journey-copy";

interface ActionLog {
  id: number;
  eventId: string;
  message: string;
}

interface PracticalLabProps {
  completion?: {
    hintLevel: number;
    menuHref: string;
    nextHref: string;
    nextLabel: string;
  };
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

function practiceAppName(workspace: WorkspaceId, missionId: string, environment: JourneyEnvironment) {
  if (workspace === "web") return environment === "windows" ? "Microsoft Edge" : "ブラウザ";
  if (workspace === "files" || missionId === "context") return environment === "windows" ? "エクスプローラー" : "ファイル";
  if (workspace === "text" || missionId === "recovery") return "メモ帳";
  if (workspace === "screens") return environment === "windows" ? "Windows 11 デスクトップ" : `${environmentNames[environment]} ホーム`;
  if (workspace === "safety") return "設定とメール";
  if (workspace === "recovery") return "設定とヘルプ";
  return missionId === "scroll" ? "Microsoft Edge" : "カレンダー";
}

export function PracticalLab({ completion, environment, missionId = "pointer", onComplete, onAction, onRecovery, freePlay = false }: PracticalLabProps) {
  const challenge = missionChallenges[missionId] ?? missionChallenges.pointer;
  const mission = journeyMissions.find((item) => item.id === missionId);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>(challenge.workspace);
  const [actions, setActions] = useState<ActionLog[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const sequenceRef = useRef(0);
  const completionReported = useRef(false);
  const completionLinkRef = useRef<HTMLAnchorElement>(null);
  const eventIds = useMemo(() => actions.map((action) => action.eventId), [actions]);
  const evaluation = useMemo(() => evaluateChallenge(challenge, eventIds), [challenge, eventIds]);
  const successEvidence = useMemo(() => {
    if (!evaluation.complete || !mission) return eventIds;
    return [
      ...mission.success.states.map((state) => `state:${state.key}`),
      ...mission.success.evidence.filter((item) => item.required).map((item) => `evidence:${item.key}`),
    ];
  }, [evaluation.complete, eventIds, mission]);
  const displayedObjective = resolveChallengeObjective(challenge, environment);

  useEffect(() => {
    if (freePlay || !evaluation.complete || completionReported.current) return;
    completionReported.current = true;
    onComplete?.(successEvidence);
    setShowSuccess(true);
  }, [evaluation.complete, freePlay, onComplete, successEvidence]);

  useEffect(() => {
    if (showSuccess) completionLinkRef.current?.focus();
  }, [showSuccess]);

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
    setShowSuccess(false);
    completionReported.current = false;
    onRecovery?.();
  };

  const renderWorkspace = (workspace: WorkspaceId) => workspaceComponents[workspace]({
    environment,
    missionId: freePlay ? "free-play" : missionId,
    emit,
  });

  return (
    <section className={`practical-lab practical-lab--${environment}`} aria-label={`${environmentNames[environment]}の練習画面`}>
      <header className="practical-lab__header">
        <div>
          <p><span className="live-dot" /> 操作練習</p>
          <strong>{environmentNames[environment]}の画面</strong>
        </div>
        <p>この画面では、本物の送信・削除・購入は行いません</p>
      </header>

      {freePlay ? (
        <nav className="lab-workspace-tabs" aria-label="練習する場所">
          {(Object.keys(workspaceLabels) as WorkspaceId[]).filter((id) => id !== "independent").map((id) => (
            <button aria-pressed={activeWorkspace === id} key={id} type="button" onClick={() => setActiveWorkspace(id)}>{workspaceLabels[id]}</button>
          ))}
        </nav>
      ) : (
        <div className="lab-mission-strip">
          <span>やること</span>
          <p><GlossaryText text={displayedObjective} /></p>
          <div className="lab-state-meter" aria-label={`${evaluation.totalGroups}項目中${evaluation.completedGroups}項目の状態を確認`}>
            {challenge.required.map((_, index) => <span className={index < evaluation.completedGroups ? "is-done" : ""} key={index} />)}
          </div>
        </div>
      )}

      <div className={`practice-device-frame practice-device-frame--${environment}`} key={`${activeWorkspace}-${sessionKey}`}>
        {environment === "windows" ? <div className="windows-desktop-icons" aria-hidden="true"><span>🗑<small>ごみ箱</small></span><span>📁<small>資料</small></span></div> : null}
        <div className="practice-app-window">
          <div className="practice-app-window__titlebar">
            {environment === "mac" ? <span className="mac-title-dots" aria-hidden="true" /> : <span className="practice-app-icon" aria-hidden="true">{activeWorkspace === "web" || missionId === "scroll" ? "e" : activeWorkspace === "files" || missionId === "context" ? "▰" : "▤"}</span>}
            <strong>{practiceAppName(activeWorkspace, missionId, environment)}</strong>
            {environment === "windows" ? <span className="practice-window-controls" aria-hidden="true">—　□　×</span> : environment === "iphone" || environment === "android" ? <span className="mobile-status-icons" aria-hidden="true">11:24　●●●</span> : null}
          </div>
          {activeWorkspace === "movement" && missionId === "scroll" ? <div className="practice-browser-toolbar" aria-hidden="true"><span>←</span><span>↻</span><div>🔒 https://www.midori-city.example/event/summer</div><span>…</span></div> : null}
          <div className="practical-lab__body">{renderWorkspace(activeWorkspace)}</div>
        </div>
        {environment === "windows" ? <div className="windows-taskbar" aria-hidden="true"><span className="windows-start">⊞</span><span>⌕</span><span>▰</span><span>e</span><time>11:24</time></div> : environment === "mac" ? <div className="mac-dock" aria-hidden="true"><span>⌘</span><span>🌐</span><span>📁</span></div> : <div className="mobile-home-indicator" aria-hidden="true" />}
      </div>

      {evaluation.complete && showSuccess ? (
        <div className="lab-success" role="dialog" aria-modal="true" aria-labelledby="lab-success-title">
          <div className="lab-success__card">
            <div className="lab-success__mark" aria-hidden="true"><span>✓</span></div>
            <p>正しく操作できました</p>
            <h2 id="lab-success-title">できました！</h2>
            <p>{mission?.afterCompletion ?? challenge.successNote}</p>
            <div className="lab-success__evidence">
              <p>今回できたこと</p>
              <dl>
                <div><dt>練習した操作</dt><dd>{mission ? getMissionTitle(mission, environment) : "操作練習"}</dd></div>
                <div><dt>使ったヒント</dt><dd>{completion?.hintLevel ? `${completion.hintLevel}回` : "なし"}</dd></div>
                <div><dt>確認できたこと</dt><dd>{successEvidence.length}件</dd></div>
              </dl>
            </div>
            {completion ? (
              <nav className="lab-success__actions" aria-label="練習完了後の移動先">
                <Link ref={completionLinkRef} className="is-primary" href={completion.nextHref}>{completion.nextLabel} <span aria-hidden="true">→</span></Link>
                <button type="button" onClick={reset}>同じ練習をもう一度</button>
                <Link href={completion.menuHref}>練習を選ぶ</Link>
                <Link href="/">ホームへ戻る</Link>
              </nav>
            ) : null}
          </div>
        </div>
      ) : null}

      <footer className="practical-lab__footer">
        <div className={`lab-feedback${evaluation.blocked ? " is-warning" : evaluation.complete ? " is-complete" : ""}`} aria-live="polite">
          <span aria-hidden="true">{evaluation.blocked ? "!" : evaluation.complete ? "✓" : actions.length ? "↳" : "○"}</span>
          <p>{evaluation.blocked ? "確定する前に止める操作です。最初からやり直して、別の方法を試してください。" : evaluation.complete ? "できました。上の画面から、次に進む場所を選べます。" : actions.at(-1)?.message ?? "上の『やること』を見て、画面の中を操作してください。"}</p>
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
