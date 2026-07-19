"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { SimulatorAppView, actionClass, openAppAction, simulatorApps } from "./SimulatorApps";
import { getSimulatorScenario, goBackSimulator, openSimulatorApp } from "./scenarios";
import type { SimulatorCommand } from "./types";
import { useSimulator } from "./useSimulator";

interface PcSimulatorProps {
  onAction: (actionId: string) => void;
  command?: SimulatorCommand;
  highlightAction?: string;
  stageId?: string;
}

export function PcSimulator({ onAction, command, highlightAction, stageId }: PcSimulatorProps) {
  const scenario = getSimulatorScenario(stageId);
  const { state, commit, updateDraft } = useSimulator(onAction, command, scenario);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const homeHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousActiveApp = useRef(state.activeApp);

  useEffect(() => {
    if (previousActiveApp.current === state.activeApp) return;
    previousActiveApp.current = state.activeApp;
    const frame = window.requestAnimationFrame(() => {
      if (state.activeApp === "home") homeHeadingRef.current?.focus();
      else backButtonRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.activeApp]);

  const goBack = () => commit("go-back", goBackSimulator);

  return (
    <section className={`simulator simulator-pc text-${state.textSize}`} aria-label="練習用PC画面">
      <div className="practice-ribbon"><Icon name="shield" size={18} /><span><strong>練習用</strong> 何を押しても、本物のデータや設定は変わりません</span></div>
      <div className="pc-frame">
        <div className="pc-topbar">
          <div className="sim-brand"><span className="brand-mark"><Icon name="practice" size={16} /></span>NAVI Desk</div>
          <div>
            <button className={actionClass("open-account", highlightAction)} type="button" onClick={() => commit("open-account", (current) => ({ ...openSimulatorApp(current, "settings"), accountPanelOpen: true }))}><Icon name="user" size={17} /><span className="sr-only">練習アカウントを開く</span></button>
            <Icon name="wifi" size={17} /><span aria-label="時刻">14:30</span>
          </div>
        </div>
        <div className="pc-workspace">
          <nav className="pc-app-shelf" aria-label="練習アプリ">
            {simulatorApps.map((app) => {
              const actionId = openAppAction(app.id);
              return (
                <button
                  className={actionClass(actionId, highlightAction)}
                  key={app.id}
                  type="button"
                  onClick={() => commit(actionId, (current) => openSimulatorApp(current, app.id))}
                >
                  <span><Icon name={app.icon} /></span><small>{app.label}</small>
                </button>
              );
            })}
          </nav>
          <div className="pc-canvas">
            {state.activeApp === "home" ? (
              <div className="desktop-welcome">
                <p className="eyebrow">SAFE PRACTICE SPACE</p>
                <h3 ref={homeHeadingRef} tabIndex={-1}>気になるアプリを<br />開いてみましょう</h3>
                <p>左の名前とマークを手がかりに選べます。</p>
                {state.lastNotice ? <div className="safe-box" role="status"><Icon name="check" /><p>{state.lastNotice}</p></div> : null}
                {state.popupOpen ? <div className="practice-popup"><Icon name="info" /><p><strong>はじめの案内</strong>この小さな案内は閉じても、いつでも練習できます。</p><button className={actionClass("dismiss-popup", highlightAction)} type="button" onClick={() => commit("dismiss-popup", (current) => ({ ...current, popupOpen: false }))}>案内を閉じる</button></div> : null}
                {scenario.id === "w6-pc-hidden-button" && state.helpSearchStatus === "found" ? (
                  <div className="safe-box" role="status"><Icon name="check" /><p><strong>保存画面へ戻りました</strong><br />画面の下に「保存」ボタンがあることを確認できました。</p></div>
                ) : (
                  <div className="error-sample compact-error"><Icon name="alert" /><div><strong>{scenario.error.code ? `${scenario.error.code} ` : ""}{scenario.error.title}</strong><p>{scenario.error.message}</p></div><button className={actionClass("read-error", highlightAction)} type="button" onClick={() => commit("read-error", (current) => ({ ...current, lastErrorRead: true }))}>内容を読んだ</button></div>
                )}
              </div>
            ) : (
              <section className="pc-window" aria-label={`${simulatorApps.find((app) => app.id === state.activeApp)?.label ?? "アプリ"}のウィンドウ`}>
                <div className="window-bar">
                  <div className="window-nav">
                    <button ref={backButtonRef} className={actionClass("go-back", highlightAction)} type="button" onClick={goBack}><Icon name="arrowLeft" /><span className="sr-only">練習画面で戻る</span></button>
                    <span>{simulatorApps.find((app) => app.id === state.activeApp)?.label}</span>
                  </div>
                  <button type="button" onClick={() => commit("close-window", (current) => ({ ...current, activeApp: "home", previousApp: null }))}><Icon name="close" /><span className="sr-only">ウィンドウを閉じる</span></button>
                </div>
                <div className="window-content">
                  <SimulatorAppView state={state} scenario={scenario} commit={commit} updateDraft={updateDraft} highlightAction={highlightAction} />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
