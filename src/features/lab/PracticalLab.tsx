"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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
import { evaluateChallenge, getChallengeRequirements, getChallengeStepInstructions, missionChallenges, type WorkspaceId } from "@/features/lab/mission-challenges";
import { getMissionCompletionText, getMissionTitle } from "@/lib/journey-copy";

interface ActionLog {
  id: number;
  eventId: string;
  message: string;
}

type AppWindowMode = "closed" | "maximized" | "minimized" | "normal";
type VisibleAppWindowMode = Exclude<AppWindowMode, "closed" | "minimized">;
type AppWindowAnimation = "opening-taskbar" | "restoring-taskbar" | "minimizing-taskbar" | "maximizing" | "restoring-down";

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
  if (workspace === "web") return "インターネットブラウザ";
  if (missionId === "attach-review") return "メール";
  if (workspace === "files" || missionId === "context") return environment === "windows" ? "エクスプローラー" : "ファイル";
  if (missionId === "typing") return "カレンダー";
  if (workspace === "text" || missionId === "recovery") return "メモ帳";
  if (workspace === "screens") return environment === "windows" ? "Windows 11 デスクトップ" : `${environmentNames[environment]} ホーム`;
  if (missionId === "permission-decision") return "設定";
  if (missionId === "account-recovery") return "Microsoft アカウント";
  if (missionId === "form-review") return "参加申込フォーム";
  if (missionId === "suspicious-message") return "メール";
  if (workspace === "safety") return "設定";
  if (missionId === "wifi-recovery") return "ネットワークとインターネット";
  if (missionId === "help-search") return "インターネットブラウザ";
  if (workspace === "recovery") return "設定";
  return missionId === "scroll" ? "インターネットブラウザ" : "カレンダー";
}

export function PracticalLab({ completion, environment, missionId = "pointer", onComplete, onAction, onRecovery, freePlay = false }: PracticalLabProps) {
  const challenge = missionChallenges[missionId] ?? missionChallenges.pointer;
  const mission = journeyMissions.find((item) => item.id === missionId);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>(challenge.workspace);
  const [actions, setActions] = useState<ActionLog[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appWindowMode, setAppWindowMode] = useState<AppWindowMode>("normal");
  const [lastVisibleAppWindowMode, setLastVisibleAppWindowMode] = useState<VisibleAppWindowMode>("normal");
  const [appWindowAnimation, setAppWindowAnimation] = useState<AppWindowAnimation | null>(environment === "windows" ? "opening-taskbar" : null);
  const [appWindowPosition, setAppWindowPosition] = useState({ x: 0, y: 0 });
  const sequenceRef = useRef(0);
  const appWindowDragRef = useRef<{ moved: boolean; originX: number; originY: number; startX: number; startY: number } | null>(null);
  const appWindowAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionReported = useRef(false);
  const completionLinkRef = useRef<HTMLAnchorElement>(null);
  const eventIds = useMemo(() => actions.map((action) => action.eventId), [actions]);
  const eventIdSet = useMemo(() => new Set(eventIds), [eventIds]);
  const challengeRequirements = useMemo(() => getChallengeRequirements(challenge, environment), [challenge, environment]);
  const stepInstructions = useMemo(() => getChallengeStepInstructions(missionId, challenge, environment), [challenge, environment, missionId]);
  const evaluation = useMemo(() => evaluateChallenge(challenge, eventIds, environment), [challenge, environment, eventIds]);
  const successEvidence = useMemo(() => {
    if (!evaluation.complete || !mission) return eventIds;
    return [
      ...mission.success.states.map((state) => `state:${state.key}`),
      ...mission.success.evidence.filter((item) => item.required).map((item) => `evidence:${item.key}`),
    ];
  }, [evaluation.complete, eventIds, mission]);
  const firstIncompleteStepIndex = challengeRequirements.findIndex((alternatives) => !alternatives.some((eventId) => eventIdSet.has(eventId)));
  const currentStepIndex = firstIncompleteStepIndex === -1 ? Math.max(0, challengeRequirements.length - 1) : firstIncompleteStepIndex;
  const currentInstruction = stepInstructions[Math.min(currentStepIndex, stepInstructions.length - 1)];
  const workspaceOwnsDeviceScreen = activeWorkspace === "screens" || (environment === "windows" && missionId === "recovery");
  const currentAppName = practiceAppName(activeWorkspace, missionId, environment);

  const animateAppWindow = (animation: AppWindowAnimation, onFinish?: () => void) => {
    if (appWindowAnimationTimerRef.current) clearTimeout(appWindowAnimationTimerRef.current);
    setAppWindowAnimation(animation);
    appWindowAnimationTimerRef.current = setTimeout(() => {
      setAppWindowAnimation(null);
      appWindowAnimationTimerRef.current = null;
      onFinish?.();
    }, animation === "minimizing-taskbar" ? 230 : 210);
  };

  useEffect(() => {
    if (environment !== "windows" || appWindowAnimation !== "opening-taskbar" || appWindowAnimationTimerRef.current) return;
    appWindowAnimationTimerRef.current = setTimeout(() => {
      setAppWindowAnimation(null);
      appWindowAnimationTimerRef.current = null;
    }, 210);
  }, [appWindowAnimation, environment]);

  useEffect(() => () => {
    if (appWindowAnimationTimerRef.current) clearTimeout(appWindowAnimationTimerRef.current);
    appWindowAnimationTimerRef.current = null;
  }, []);

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
    setAppWindowMode("normal");
    setLastVisibleAppWindowMode("normal");
    setAppWindowPosition({ x: 0, y: 0 });
    if (environment === "windows") animateAppWindow("opening-taskbar");
    completionReported.current = false;
    onRecovery?.();
  };

  const minimizeAppWindow = () => {
    if (appWindowAnimation || (appWindowMode !== "normal" && appWindowMode !== "maximized")) return;
    setLastVisibleAppWindowMode(appWindowMode);
    animateAppWindow("minimizing-taskbar", () => setAppWindowMode("minimized"));
  };

  const toggleAppWindowMaximize = () => {
    if (appWindowAnimation) return;
    const nextMode: VisibleAppWindowMode = appWindowMode === "maximized" ? "normal" : "maximized";
    setAppWindowMode(nextMode);
    setLastVisibleAppWindowMode(nextMode);
    animateAppWindow(appWindowMode === "maximized" ? "restoring-down" : "maximizing");
  };

  const closeAppWindow = () => {
    if (appWindowAnimationTimerRef.current) clearTimeout(appWindowAnimationTimerRef.current);
    appWindowAnimationTimerRef.current = null;
    setAppWindowAnimation(null);
    setAppWindowMode("closed");
  };

  const activateTaskbarAppWindow = () => {
    if (appWindowAnimation) return;
    if (appWindowMode === "closed") {
      setAppWindowMode("normal");
      setLastVisibleAppWindowMode("normal");
      animateAppWindow("opening-taskbar");
      return;
    }
    if (appWindowMode === "minimized") {
      setAppWindowMode(lastVisibleAppWindowMode);
      animateAppWindow("restoring-taskbar");
      return;
    }
    minimizeAppWindow();
  };

  const beginAppWindowDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (environment !== "windows" || appWindowMode !== "normal" || (event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    appWindowDragRef.current = {
      moved: false,
      originX: appWindowPosition.x,
      originY: appWindowPosition.y,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const dragAppWindow = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = appWindowDragRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 6) drag.moved = true;
    setAppWindowPosition({
      x: Math.max(-180, Math.min(180, drag.originX + deltaX)),
      y: Math.max(-18, Math.min(95, drag.originY + deltaY)),
    });
  };

  const endAppWindowDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    appWindowDragRef.current = null;
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
            <button aria-pressed={activeWorkspace === id} key={id} type="button" onClick={() => { setActiveWorkspace(id); setAppWindowMode("normal"); setLastVisibleAppWindowMode("normal"); setAppWindowPosition({ x: 0, y: 0 }); if (environment === "windows") animateAppWindow("opening-taskbar"); }}>{workspaceLabels[id]}</button>
          ))}
        </nav>
      ) : (
        <div className="lab-mission-strip">
          <span>{currentStepIndex === 0 ? "まず、これだけ" : "次は、これだけ"}</span>
          <p key={`${missionId}-${currentStepIndex}`} aria-live="polite"><GlossaryText text={currentInstruction} /></p>
          <strong className="lab-step-count">{Math.min(currentStepIndex + 1, evaluation.totalGroups)} / {evaluation.totalGroups}</strong>
        </div>
      )}

      <div className={`practice-device-frame practice-device-frame--${environment}${workspaceOwnsDeviceScreen ? " is-device-desktop" : ""}`} key={`${activeWorkspace}-${sessionKey}`}>
        {workspaceOwnsDeviceScreen ? renderWorkspace(activeWorkspace) : <>
          {environment === "windows" ? <div className="windows-desktop-icons" aria-hidden="true"><span>🗑<small>ごみ箱</small></span><span>📁<small>資料</small></span></div> : null}
          {appWindowMode !== "closed" && appWindowMode !== "minimized" ? <div className={`practice-app-window is-${appWindowMode}${appWindowAnimation ? ` is-${appWindowAnimation}` : ""}`} style={appWindowMode === "normal" ? { transform: `translate(${appWindowPosition.x}px, ${appWindowPosition.y}px)` } : undefined}>
            <div className="practice-app-window__titlebar" onPointerDown={beginAppWindowDrag} onPointerMove={dragAppWindow} onPointerUp={endAppWindowDrag}>
              {environment === "mac" ? <span className="mac-title-dots" aria-hidden="true" /> : <span className="practice-app-icon" aria-hidden="true">{activeWorkspace === "web" || missionId === "scroll" ? "🌐" : activeWorkspace === "files" || missionId === "context" ? "▰" : "▤"}</span>}
              <strong>{currentAppName}</strong>
              {environment === "windows" ? <div className="practice-window-controls">
                <button type="button" aria-label={`${currentAppName}の「―（最小化）」ボタン`} title="―（最小化）" onClick={minimizeAppWindow}>―</button>
                <button type="button" aria-label={appWindowMode === "maximized" ? `${currentAppName}の「❐（元のサイズに戻す）」ボタン` : `${currentAppName}の「□（最大化）」ボタン`} title={appWindowMode === "maximized" ? "❐（元のサイズに戻す）" : "□（最大化）"} onClick={toggleAppWindowMaximize}>{appWindowMode === "maximized" ? "❐" : "□"}</button>
                <button className="is-close" type="button" aria-label={`${currentAppName}の「×（閉じる）」ボタン`} title="×（閉じる）" onClick={closeAppWindow}>×</button>
              </div> : environment === "iphone" || environment === "android" ? <span className="mobile-status-icons" aria-hidden="true">11:24　●●●</span> : null}
            </div>
            {activeWorkspace === "movement" && missionId === "scroll" ? <div className="practice-browser-toolbar" aria-hidden="true"><span>←</span><span>↻</span><div>🔒 https://www.midori-city.example/event/summer</div><span>…</span></div> : null}
            <div className="practical-lab__body">{renderWorkspace(activeWorkspace)}</div>
          </div> : null}
          {environment === "windows" ? <div className="windows-taskbar"><span className="windows-start" aria-hidden="true">⊞</span><span aria-hidden="true">⌕</span><span aria-hidden="true">▰</span><button className={appWindowMode !== "closed" ? "is-open" : ""} aria-pressed={appWindowMode === "normal" || appWindowMode === "maximized"} type="button" aria-label={appWindowMode === "closed" ? `${currentAppName}を開く` : appWindowMode === "minimized" ? `${currentAppName}を最小化前の大きさで表示` : `${currentAppName}を最小化`} onClick={activateTaskbarAppWindow}><span aria-hidden="true">{activeWorkspace === "web" || missionId === "scroll" ? "🌐" : activeWorkspace === "files" || missionId === "context" ? "▰" : "▤"}</span></button><time>11:24</time></div> : environment === "mac" ? <div className="mac-dock" aria-hidden="true"><span>⌘</span><span>🌐</span><span>📁</span></div> : <div className="mobile-home-indicator" aria-hidden="true" />}
        </>}
      </div>

      {evaluation.complete && showSuccess ? (
        <div className="lab-success" role="dialog" aria-modal="true" aria-labelledby="lab-success-title">
          <div className="lab-success__card">
            <div className="lab-success__mark" aria-hidden="true"><span>✓</span></div>
            <p>正しく操作できました</p>
            <h2 id="lab-success-title">できました！</h2>
            <p>{mission ? getMissionCompletionText(mission, environment) : challenge.successNote}</p>
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
          <p>{evaluation.blocked ? "確定する前に止める操作です。最初からやり直して、別の方法を試してください。" : evaluation.complete ? "できました。上の画面から、次に進む場所を選べます。" : actions.at(-1)?.message ?? "上の短い案内を見て、画面の中を操作してください。"}</p>
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
