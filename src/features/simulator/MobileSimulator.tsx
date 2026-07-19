"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { SimulatorAppView, actionClass, openAppAction, simulatorApps } from "./SimulatorApps";
import { getSimulatorScenario, goBackSimulator, openSimulatorApp } from "./scenarios";
import type { SimulatorCommand } from "./types";
import { useSimulator } from "./useSimulator";

interface MobileSimulatorProps {
  onAction: (actionId: string) => void;
  command?: SimulatorCommand;
  highlightAction?: string;
  stageId?: string;
}

export function MobileSimulator({ onAction, command, highlightAction, stageId }: MobileSimulatorProps) {
  const scenario = getSimulatorScenario(stageId);
  const { state, commit, updateDraft } = useSimulator(onAction, command, scenario);
  const visibleApps = simulatorApps.filter((app) => app.id !== "calendar").slice(0, 8);
  const appBackButtonRef = useRef<HTMLButtonElement>(null);
  const homeHeadingRef = useRef<HTMLDivElement>(null);
  const previousActiveApp = useRef(state.activeApp);

  useEffect(() => {
    if (previousActiveApp.current === state.activeApp) return;
    previousActiveApp.current = state.activeApp;
    const frame = window.requestAnimationFrame(() => {
      if (state.activeApp === "home") homeHeadingRef.current?.focus();
      else appBackButtonRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.activeApp]);

  return (
    <section className={`simulator simulator-mobile text-${state.textSize}`} aria-label="練習用スマートフォン画面">
      <div className="practice-ribbon"><Icon name="shield" size={18} /><span><strong>練習用</strong> 実際の送信や設定変更は起きません</span></div>
      <div className="phone-frame">
        <div className="phone-status"><span>14:30</span><span><Icon name="wifi" size={16} /><Icon name="volume" size={16} /></span></div>
        <div className="phone-screen">
          {state.activeApp === "home" ? (
            <>
              <div className="phone-welcome" ref={homeHeadingRef} tabIndex={-1}>
                <span><small>こんにちは</small><strong>何を試しますか？</strong></span>
                <span className="phone-home-actions">
                  <button className={actionClass("open-account", highlightAction)} type="button" onClick={() => commit("open-account", (current) => ({ ...openSimulatorApp(current, "settings"), accountPanelOpen: true }))}><Icon name="user" /><span className="sr-only">練習アカウント</span></button>
                  <button className={actionClass("open-more", highlightAction)} type="button" onClick={() => commit(state.moreMenuOpen ? "close-more" : "open-more", (current) => ({ ...current, moreMenuOpen: !current.moreMenuOpen }))}><Icon name="more" /><span className="sr-only">その他のメニュー</span></button>
                </span>
              </div>
              {state.moreMenuOpen ? <div className="popover-menu home-popover"><button className={actionClass("open-settings", highlightAction)} type="button" onClick={() => commit("open-settings", (current) => openSimulatorApp(current, "settings"))}><Icon name="gear" />表示設定</button><button type="button">ホームの説明</button></div> : null}
              {state.lastNotice ? <div className="safe-box" role="status"><Icon name="check" /><p>{state.lastNotice}</p></div> : null}
              <div className="mobile-copy-card"><p>{scenario.homeCopyText}</p><button className={actionClass("copy-text", highlightAction)} type="button" onClick={() => commit("copy-text", (current) => ({ ...current, clipboardText: scenario.homeCopyText, lastNotice: `「${scenario.homeCopyText}」をコピーしました。` }))}><Icon name="copy" />コピー</button></div>
              <div className="error-sample compact-error"><Icon name="alert" /><div><strong>{scenario.error.code ?? "お知らせ"}</strong><p>{scenario.error.title}</p></div><button className={actionClass("read-error", highlightAction)} type="button" onClick={() => commit("read-error", (current) => ({ ...current, lastErrorRead: true }))}>読む</button></div>
              <div className="phone-app-grid">
                {visibleApps.map((app) => {
                  const actionId = openAppAction(app.id);
                  return (
                    <button
                      className={actionClass(actionId, highlightAction)}
                      key={app.id}
                      type="button"
                      onClick={() => commit(actionId, (current) => openSimulatorApp(current, app.id))}
                    ><span><Icon name={app.icon} /></span><small>{app.label}</small></button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="phone-app-view">
              <div className="phone-app-heading">
                <button ref={appBackButtonRef} className={actionClass("go-back", highlightAction)} type="button" onClick={() => commit("go-back", goBackSimulator)}><Icon name="arrowLeft" /><span>戻る</span></button>
                <strong>{simulatorApps.find((app) => app.id === state.activeApp)?.label}</strong>
              </div>
              <SimulatorAppView state={state} scenario={scenario} commit={commit} updateDraft={updateDraft} highlightAction={highlightAction} />
            </div>
          )}
        </div>
        <nav className="phone-controls" aria-label="練習用スマートフォン操作">
          <button className={actionClass("go-back", highlightAction)} type="button" onClick={() => commit("go-back", goBackSimulator)}><Icon name="arrowLeft" /><span>戻る</span></button>
          <button className={actionClass("go-home", highlightAction)} type="button" onClick={() => commit("go-home", (current) => ({ ...current, activeApp: "home", previousApp: null, moreMenuOpen: false, shareChooserOpen: false }))}><Icon name="home" /><span>ホーム</span></button>
        </nav>
      </div>
    </section>
  );
}
