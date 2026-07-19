"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TermButton } from "@/components/ui/TermButton";
import { useProgress } from "@/features/progress/ProgressProvider";
import { DeviceSimulator } from "@/features/simulator/DeviceSimulator";
import type { SimulatorCommand } from "@/features/simulator/types";
import type { StageDefinition } from "@/lib/types";

const actionLabels: Record<string, string> = {
  "open-browser": "ブラウザを開く",
  "open-settings": "設定を開く",
  "open-files": "ファイルを開く",
  "open-mail": "メールを開く",
  "open-help": "ヘルプを開く",
  "open-more": "その他のメニューを開く",
  "switch-tab": "タブを切り替える",
  "search-web": "言葉を入力して検索する",
  "open-result": "検索結果を開く",
  "text-larger": "文字を大きくする",
  "dismiss-popup": "案内を閉じる",
  "open-account": "アカウントの設定を開く",
  "switch-account": "アカウントを切り替える",
  "password-help": "パスワードの助けを見る",
  "select-file": "ファイルを選ぶ",
  "move-file": "ファイルを移動する",
  "attach-file": "ファイルを添付する",
  "read-error": "エラーの内容を読む",
  "search-help": "ヘルプで調べる",
  "write-question": "質問文を組み立てる",
  "open-notes": "メモを開く",
  "copy-text": "文章をコピーする",
  "paste-text": "文章を貼り付ける",
  "share-photo": "写真の共有を練習する",
  "go-back": "練習画面で戻る",
  "go-home": "練習画面のホームへ戻る",
  "safe-cancel": "確認して操作をやめる",
};

function getGentleFeedback(actionId: string) {
  const action = actionLabels[actionId] ?? "別の機能";
  return `「${action}」を試しました。画面の変化を見られたことも前進です。今回は、目的に合う別の目印も探してみましょう。`;
}

export function StagePlayer({ stage }: { stage: StageDefinition }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [feedback, setFeedback] = useState("気になる場所を選んで大丈夫です。いつでも元に戻せます。");
  const [complete, setComplete] = useState(false);
  const [command, setCommand] = useState<SimulatorCommand | undefined>();
  const actionHistory = useRef<{ actionId: string; advanced: boolean }[]>([]);
  const redoHistory = useRef<{ actionId: string; advanced: boolean }[]>([]);
  const { progress, completeStage, recordAttempt, recordHint, recordRecovery } = useProgress();
  const expectedAction = stage.targetActions[stepIndex];
  const alreadyRecorded = progress.completedStageIds.includes(stage.id);

  const handleAction = useCallback((actionId: string) => {
    if (actionId === "undo") {
      const undone = actionHistory.current.pop();
      if (!undone) return;
      redoHistory.current.unshift(undone);
      recordRecovery();
      if (undone.advanced) {
        setStepIndex((current) => Math.max(0, current - 1));
        setComplete(false);
      }
      setFeedback("1つ前の状態に戻りました。戻して確かめる力も、大切なデジタルスキルです。");
      return;
    }
    if (actionId === "reset") {
      actionHistory.current = [];
      redoHistory.current = [];
      setStepIndex(0);
      setComplete(false);
      setFeedback("練習画面を最初の状態に戻しました。学習の記録は消えていません。");
      return;
    }
    if (actionId === "redo") {
      const redone = redoHistory.current.shift();
      if (!redone) return;
      actionHistory.current.push(redone);
      if (redone.advanced) {
        const nextStep = stepIndex + 1;
        setStepIndex(nextStep);
        if (nextStep >= stage.targetActions.length) {
          setComplete(true);
          setFeedback(stage.completionMessage);
          completeStage(stage.id, stage.xp, [...stage.competencyIds], stage.device);
        } else {
          setFeedback("やり直した操作をもう一度進めました。画面を見比べてみましょう。");
        }
      } else {
        setFeedback("やり直した操作をもう一度進めました。画面を見比べてみましょう。");
      }
      return;
    }

    recordAttempt();
    redoHistory.current = [];
    if (actionId !== stage.targetActions[stepIndex]) {
      actionHistory.current.push({ actionId, advanced: false });
      setFeedback(getGentleFeedback(actionId));
      return;
    }

    actionHistory.current.push({ actionId, advanced: true });
    const nextStep = stepIndex + 1;
    if (nextStep >= stage.targetActions.length) {
      setStepIndex(nextStep);
      setComplete(true);
      setFeedback(stage.completionMessage);
      completeStage(stage.id, stage.xp, [...stage.competencyIds], stage.device);
      return;
    }

    setStepIndex(nextStep);
    setFeedback(`できています。次は「${actionLabels[stage.targetActions[nextStep]] ?? "次の操作"}」を探してみましょう。`);
  }, [completeStage, recordAttempt, recordRecovery, stage, stepIndex]);

  const revealHint = () => {
    if (hintCount >= stage.hints.length) return;
    setHintCount((current) => current + 1);
    recordHint();
    setFeedback("ヒントを使って見つけることも、自分で解決する方法のひとつです。");
  };

  const sendCommand = (type: SimulatorCommand["type"]) => {
    setCommand({ id: Date.now(), type });
  };

  const stageProgress = Math.round((stepIndex / stage.targetActions.length) * 100);
  const termIds = useMemo(() => stage.glossaryTermIds.slice(0, 4), [stage.glossaryTermIds]);

  return (
    <div className="stage-layout section-shell">
      <aside className="objective-panel" aria-label="今回の課題">
        <div className="stage-location"><span>WORLD {stage.worldId.replace("world-", "")}</span><Icon name="chevronRight" size={17} /><strong>{stage.code}</strong></div>
        <span className={`guidance-badge guidance-${stage.guidance}`}>
          {stage.guidance === "guided" ? "案内つき" : stage.guidance === "supported" ? "少し自分で" : "自立チャレンジ"}
        </span>
        <h1>{stage.title}</h1>
        <p className="objective-text">{stage.objective}</p>
        <div className="safety-note"><Icon name="shield" /><p><strong>安全メモ</strong>{stage.safetyNote}</p></div>
        <ProgressBar value={stageProgress} label="このステージ" />
        <ol className="step-list" aria-label="練習の進み具合">
          {stage.targetActions.map((action, index) => (
            <li aria-current={index === stepIndex && !complete ? "step" : undefined} className={index < stepIndex ? "is-done" : index === stepIndex ? "is-current" : ""} key={`${action}-${index}`}>
              <span>{index < stepIndex ? <><Icon name="check" size={17} /><span className="sr-only">完了</span></> : index + 1}</span>
              <p>{actionLabels[action] ?? `操作 ${index + 1}`}</p>
            </li>
          ))}
        </ol>
        {termIds.length > 0 ? (
          <div className="stage-terms"><strong>出てくる言葉</strong><div>{termIds.map((termId) => <TermButton key={termId} termId={termId} />)}</div></div>
        ) : null}
        <Link className="text-link" href={`/learn/${stage.device}/world/${stage.worldId}`}><Icon name="arrowLeft" size={18} />ステージ一覧へ戻る</Link>
      </aside>

      <section className="practice-area" aria-label="ステージ練習画面">
        <div className="practice-heading">
          <div><p className="eyebrow">PRACTICE SCREEN</p><h2>{stage.device === "pc" ? "練習用PC" : "練習用スマートフォン"}</h2></div>
          {alreadyRecorded ? <span className="status-pill status-complete"><Icon name="check" size={16} />記録済み</span> : null}
        </div>

        <DeviceSimulator
          device={stage.device}
          stageId={stage.id}
          onAction={handleAction}
          command={command}
          highlightAction={hintCount >= 3 ? expectedAction : undefined}
        />

        <div className="gentle-feedback" aria-live="polite">
          <span><Icon name={complete ? "check" : "info"} /></span>
          <p><strong>{complete ? "できました！" : "いまの発見"}</strong>{feedback}</p>
        </div>

        {complete ? (
          <div className="complete-card">
            <div className="complete-icon"><Icon name="award" size={34} /></div>
            <div><p className="eyebrow">STAGE COMPLETE</p><h2>{stage.completionMessage}</h2><p>+{stage.xp} XP。ヒントを使っていても、同じように「できた」と記録されます。</p></div>
            <div className="button-row">
              <Link className="button button-primary" href={`/learn/${stage.device}/world/${stage.worldId}`}>次のステージを選ぶ</Link>
              <button className="button button-secondary" type="button" onClick={() => { setStepIndex(0); setComplete(false); sendCommand("reset"); }}>もう一度ためす</button>
            </div>
          </div>
        ) : null}

        <div className="hint-panel">
          <div className="hint-heading"><span><Icon name="lightbulb" /><strong>段階ヒント</strong></span><small>{hintCount} / {stage.hints.length}</small></div>
          {hintCount === 0 ? <p>最初は自分で探しても、すぐにヒントを見ても大丈夫です。</p> : (
            <ol>{stage.hints.slice(0, hintCount).map((hint, index) => <li key={hint}><span>ヒント {index + 1}</span>{hint}</li>)}</ol>
          )}
          <button className="button button-hint" type="button" onClick={revealHint} disabled={hintCount >= stage.hints.length}>
            <Icon name="lightbulb" />{hintCount >= stage.hints.length ? "すべてのヒントを表示中" : `ヒント ${hintCount + 1} を見る`}
          </button>
        </div>

        <nav className="recovery-tray" aria-label="練習画面の復旧操作">
          <span><Icon name="shield" /><strong>安心トレイ</strong></span>
          <button type="button" onClick={() => sendCommand("undo")}><Icon name="undo" />1つ前に戻す</button>
          <button type="button" onClick={() => sendCommand("redo")}><Icon name="redo" />やり直す</button>
          <button type="button" onClick={() => sendCommand("reset")}><Icon name="reset" />最初に戻す</button>
          <Link href="/help"><Icon name="search" />調べる</Link>
        </nav>
      </section>
    </div>
  );
}
