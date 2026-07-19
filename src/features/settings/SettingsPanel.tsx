"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { useProgress, type FontSize } from "@/features/progress/ProgressProvider";

const fontOptions: { id: FontSize; label: string; sample: string }[] = [
  { id: "standard", label: "標準", sample: "読みやすい文字" },
  { id: "large", label: "大きい", sample: "読みやすい文字" },
  { id: "xlarge", label: "特大", sample: "読みやすい文字" },
];

export function SettingsPanel() {
  const { progress, updateSettings, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("設定はこのブラウザに自動で保存されます。");
  const fontOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const resetTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelResetRef = useRef<HTMLButtonElement>(null);

  const selectFont = (fontSize: FontSize) => {
    updateSettings({ fontSize });
    setMessage("文字の大きさを変更しました。ほかの画面にも反映されています。");
  };

  const focusAndSelectFont = (index: number) => {
    const nextIndex = (index + fontOptions.length) % fontOptions.length;
    selectFont(fontOptions[nextIndex].id);
    fontOptionRefs.current[nextIndex]?.focus();
  };

  const handleFontKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusAndSelectFont(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAndSelectFont(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelectFont(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelectFont(fontOptions.length - 1);
    }
  };

  const closeResetConfirmation = useCallback((nextMessage?: string) => {
    setConfirmReset(false);
    if (nextMessage) setMessage(nextMessage);
    window.setTimeout(() => resetTriggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => cancelResetRef.current?.focus(), 0);
    const cancelOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeResetConfirmation();
    };
    window.addEventListener("keydown", cancelOnEscape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", cancelOnEscape);
    };
  }, [closeResetConfirmation, confirmReset]);

  return (
    <div className="settings-stack">
      <section className="settings-card">
        <div className="settings-card-heading">
          <span><Icon name="eye" /></span>
          <div><h2>文字の大きさ</h2><p>読みやすい大きさを選んでください。</p></div>
        </div>
        <div className="font-options" role="radiogroup" aria-label="文字の大きさ">
          {fontOptions.map((option, index) => {
            const selected = progress.settings.fontSize === option.id;
            return (
              <button
                aria-checked={selected}
                className={`font-option font-${option.id}`}
                key={option.id}
                onClick={() => selectFont(option.id)}
                onKeyDown={(event) => handleFontKeyDown(event, index)}
                ref={(element) => { fontOptionRefs.current[index] = element; }}
                role="radio"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <span>{option.sample}</span>
                <strong>{selected ? <Icon name="check" /> : null}{option.label}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <span><Icon name="settings" /></span>
          <div><h2>見え方と動き</h2><p>画面を落ち着いて使えるように調整します。</p></div>
        </div>
        <div className="toggle-list">
          <label><span><strong>動きを少なくする</strong><small>カードの移動や演出を控えめにします</small></span><input type="checkbox" checked={progress.settings.reduceMotion} onChange={(event) => updateSettings({ reduceMotion: event.target.checked })} /></label>
          <label><span><strong>くっきり表示</strong><small>文字や枠の違いをさらに分かりやすくします</small></span><input type="checkbox" checked={progress.settings.highContrast} onChange={(event) => updateSettings({ highContrast: event.target.checked })} /></label>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <span><Icon name="shield" /></span>
          <div><h2>保存とプライバシー</h2><p>ログインせず、このブラウザの中だけに記録します。</p></div>
        </div>
        <ul className="privacy-list">
          <li><Icon name="check" />氏名やメールアドレスは保存しません</li>
          <li><Icon name="check" />進捗と表示設定だけを保存します</li>
          <li><Icon name="check" />別の端末やブラウザには自動で共有されません</li>
        </ul>
        <div className="danger-zone">
          <div><strong>学習の記録を初期状態に戻す</strong><p>完了ステージ、XP、バッジ、表示設定が消えます。フリープレイの「初期状態に戻す」とは別の操作です。</p></div>
          {confirmReset ? (
            <div className="reset-confirm" role="alert" aria-label="記録の初期化確認">
              <p>本当に学習の記録を消しますか？この操作は元に戻せません。</p>
              <div className="button-row">
                <button className="button button-danger" type="button" onClick={() => { resetProgress(); closeResetConfirmation("学習の記録を初期状態に戻しました。"); }}>記録を消す</button>
                <button ref={cancelResetRef} className="button button-secondary" type="button" onClick={() => closeResetConfirmation()}>やめる</button>
              </div>
            </div>
          ) : (
            <button ref={resetTriggerRef} className="button button-danger-outline" type="button" onClick={() => setConfirmReset(true)}>記録の初期化を確認する</button>
          )}
        </div>
      </section>

      <p className="settings-message" aria-live="polite"><Icon name="info" />{message}</p>
    </div>
  );
}
