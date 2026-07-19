"use client";

import {
  useId,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Icon } from "@/components/ui/Icon";
import {
  currentBrowserView,
  isTargetFile,
  matchesExpectedTerms,
  normalizedText,
  openSimulatorApp,
} from "./scenarios";
import type { SimulatorApp, SimulatorScenario, SimulatorState } from "./types";

export interface SimulatorAppProps {
  state: SimulatorState;
  scenario: SimulatorScenario;
  highlightAction?: string;
  commit: (actionId: string, updater: (current: SimulatorState) => SimulatorState) => void;
  updateDraft: (patch: Partial<SimulatorState>) => void;
}

export const simulatorApps: {
  id: SimulatorApp;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
}[] = [
  { id: "browser", label: "ブラウザ", icon: "globe" },
  { id: "settings", label: "設定", icon: "gear" },
  { id: "files", label: "ファイル", icon: "folder" },
  { id: "mail", label: "メール", icon: "mail" },
  { id: "notes", label: "メモ", icon: "file" },
  { id: "photos", label: "写真", icon: "eye" },
  { id: "help", label: "ヘルプ", icon: "help" },
  { id: "calendar", label: "予定", icon: "calendar" },
];

export function actionClass(actionId: string, highlightAction?: string) {
  return highlightAction === actionId ? "sim-action target-highlight" : "sim-action";
}

export function openAppAction(app: SimulatorApp) {
  const actionByApp: Partial<Record<SimulatorApp, string>> = {
    browser: "open-browser",
    settings: "open-settings",
    files: "open-files",
    mail: "open-mail",
    help: "open-help",
    notes: "open-notes",
  };
  return actionByApp[app] ?? `open-${app}`;
}

export function SimulatorAppView({
  state,
  scenario,
  highlightAction,
  commit,
  updateDraft,
}: SimulatorAppProps) {
  const tabBaseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const submitBrowserSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = normalizedText(state.browserQuery);
    if (!query) {
      commit("search-web-empty", (current) => ({
        ...current,
        browserSearchStatus: "empty",
        browserSearched: false,
        browserResultOpen: false,
      }));
      return;
    }
    if (!matchesExpectedTerms(query, scenario.browser.expectedTerms)) {
      commit("search-web-other", (current) => ({
        ...current,
        browserSearchStatus: "wrong",
        browserSearched: false,
        browserResultOpen: false,
      }));
      return;
    }
    commit("search-web", (current) => ({
      ...current,
      browserHistory: [...current.browserHistory, currentBrowserView(current)].slice(-20),
      browserSearched: true,
      browserResultOpen: false,
      browserSearchStatus: "found",
    }));
  };

  const submitHelpSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = normalizedText(state.helpQuery);
    if (!query) {
      commit("search-help-empty", (current) => ({
        ...current,
        helpSearchStatus: "empty",
        helpSearched: false,
      }));
      return;
    }
    if (!matchesExpectedTerms(query, scenario.help.expectedTerms)) {
      commit("search-help-other", (current) => ({
        ...current,
        helpSearchStatus: "wrong",
        helpSearched: false,
      }));
      return;
    }
    commit("search-help", (current) => ({
      ...current,
      helpSearchStatus: "found",
      helpSearched: true,
    }));
  };

  const switchTab = (nextIndex: number) => {
    if (nextIndex === state.activeTab) {
      commit("switch-tab-same", (current) => current);
      return;
    }
    commit("switch-tab", (current) => ({ ...current, activeTab: nextIndex }));
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % 2;
    if (event.key === "ArrowLeft") nextIndex = (index + 1) % 2;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = 1;
    if (nextIndex === null) return;
    event.preventDefault();
    switchTab(nextIndex);
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  if (state.activeApp === "browser") {
    const article = state.activeTab === 1 && scenario.browser.secondaryArticle
      ? scenario.browser.secondaryArticle
      : scenario.browser.primaryArticle;
    const browserView = currentBrowserView(state);

    const browserContent = (
      <>
        {browserView !== "article" ? (
          <form className="virtual-search" onSubmit={submitBrowserSearch}>
            <label htmlFor={`${tabBaseId}-search`}>調べたい言葉</label>
            <div>
              <input
                id={`${tabBaseId}-search`}
                value={state.browserQuery}
                onChange={(event) => updateDraft({
                  browserQuery: event.target.value,
                  browserSearchStatus: "idle",
                })}
                placeholder={scenario.browser.prompt}
              />
              <button className={actionClass("search-web", highlightAction)} type="submit">
                <Icon name="search" />検索
              </button>
            </div>
          </form>
        ) : null}

        {state.browserSearchStatus === "empty" ? (
          <p className="inline-guidance">調べたい言葉を入れてから検索してみましょう。</p>
        ) : null}
        {state.browserSearchStatus === "wrong" ? (
          <p className="inline-guidance">
            検索はできました。今回は「{scenario.browser.prompt}」に近い言葉でもう一度試してみましょう。
          </p>
        ) : null}

        {browserView === "article" ? (
          <article className="practice-article">
            <span className="status-pill status-safe">{article.eyebrow}</span>
            <h3>{article.title}</h3>
            {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {article.copyText ? (
              <button
                className={actionClass("copy-text", highlightAction)}
                type="button"
                onClick={() => commit("copy-text", (current) => ({
                  ...current,
                  clipboardText: article.copyText ?? "",
                  lastNotice: `「${article.copyText}」をコピーしました。`,
                }))}
              >
                <Icon name="copy" />必要な一文をコピー
              </button>
            ) : null}
          </article>
        ) : browserView === "results" ? (
          <div className="search-results">
            <p><strong>{scenario.browser.secondaryArticle ? "2件" : "1件"}</strong> 見つかりました</p>
            <button
              className={actionClass("open-result", highlightAction)}
              type="button"
              onClick={() => commit("open-result", (current) => ({
                ...current,
                browserHistory: [...current.browserHistory, currentBrowserView(current)].slice(-20),
                browserResultOpen: true,
              }))}
            >
              <span>{scenario.browser.primaryArticle.eyebrow}</span>
              <strong>{scenario.browser.resultTitle}</strong>
              <small>{scenario.browser.resultSummary}</small>
            </button>
            {scenario.browser.secondaryArticle ? (
              <div className="inline-guidance">もう一件は「{scenario.browser.tabLabels[1]}」タブに開いてあります。</div>
            ) : null}
          </div>
        ) : scenario.browser.featuredResult ? (
          <div className="empty-state">
            <Icon name="globe" size={34} />
            <p>この練習で使うページが用意されています。</p>
            <button
              className={actionClass("open-result", highlightAction)}
              type="button"
              onClick={() => commit("open-result", (current) => ({
                ...current,
                browserHistory: [...current.browserHistory, currentBrowserView(current)].slice(-20),
                browserResultOpen: true,
              }))}
            >
              {scenario.browser.resultTitle}
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="globe" size={34} />
            <p>検索すると、ここに練習用の結果が表示されます。</p>
          </div>
        )}
      </>
    );

    return (
      <div className="virtual-app browser-app">
        <div className="app-title-row">
          <div><small>練習用ブラウザ</small><h3>{article.title}</h3></div>
          <button
            className={actionClass("open-more", highlightAction)}
            type="button"
            aria-expanded={state.moreMenuOpen}
            onClick={() => commit(state.moreMenuOpen ? "close-more" : "open-more", (current) => ({
              ...current,
              moreMenuOpen: !current.moreMenuOpen,
            }))}
          >
            <Icon name="more" /><span className="sr-only">ブラウザのその他メニュー</span>
          </button>
        </div>
        {state.moreMenuOpen ? (
          <div className="popover-menu">
            <button
              className={actionClass("open-settings", highlightAction)}
              type="button"
              onClick={() => commit("open-settings", (current) => openSimulatorApp(current, "settings"))}
            >
              <Icon name="gear" />表示設定
            </button>
            <button type="button">ページの情報</button>
          </div>
        ) : null}
        <div className="virtual-tabs" role="tablist" aria-label="練習用タブ">
          {scenario.browser.tabLabels.map((label, index) => (
            <button
              aria-controls={`${tabBaseId}-panel-${index}`}
              aria-selected={state.activeTab === index}
              className={actionClass("switch-tab", highlightAction)}
              id={`${tabBaseId}-tab-${index}`}
              key={label}
              onClick={() => switchTab(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              ref={(node) => { tabRefs.current[index] = node; }}
              role="tab"
              tabIndex={state.activeTab === index ? 0 : -1}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        {[0, 1].map((index) => (
          <div
            aria-labelledby={`${tabBaseId}-tab-${index}`}
            hidden={state.activeTab !== index}
            id={`${tabBaseId}-panel-${index}`}
            key={index}
            role="tabpanel"
            tabIndex={0}
          >
            {state.activeTab === index ? browserContent : null}
          </div>
        ))}
      </div>
    );
  }

  if (state.activeApp === "settings") {
    return (
      <div className="virtual-app settings-app">
        <div className="app-title-row">
          <div><small>表示とアカウント</small><h3>設定</h3></div>
          <button
            aria-expanded={state.moreMenuOpen}
            className={actionClass("open-more", highlightAction)}
            type="button"
            onClick={() => commit(state.moreMenuOpen ? "close-more" : "open-more", (current) => ({ ...current, moreMenuOpen: !current.moreMenuOpen }))}
          >
            <Icon name="more" /><span className="sr-only">その他の設定</span>
          </button>
        </div>
        {state.moreMenuOpen ? (
          <div className="popover-menu"><button type="button">通知の設定</button><button type="button">この画面について</button></div>
        ) : null}
        {state.popupOpen ? (
          <div className="practice-popup" role="status">
            <Icon name="info" /><p><strong>表示のヒント</strong>文字はあとから何度でも戻せます。</p>
            <button
              className={actionClass("dismiss-popup", highlightAction)}
              type="button"
              onClick={() => commit("dismiss-popup", (current) => ({ ...current, popupOpen: false }))}
            >閉じる</button>
          </div>
        ) : null}
        <div className="setting-list">
          <div>
            <span><Icon name="eye" /><strong>文字の大きさ</strong><small>読みやすい大きさを選びます</small></span>
            <button
              aria-pressed={state.textSize === "large"}
              className={actionClass("text-larger", highlightAction)}
              disabled={state.textSize === "large"}
              type="button"
              onClick={() => commit("text-larger", (current) => ({
                ...current,
                textSize: "large",
                popupOpen: true,
                lastNotice: "文字を大きくしました。",
              }))}
            >
              {state.textSize === "large" ? "大きい ✓" : "大きくする"}
            </button>
          </div>
          <div>
            <span><Icon name="user" /><strong>練習アカウント</strong><small>{state.accountName}</small></span>
            <button
              className={actionClass("open-account", highlightAction)}
              type="button"
              onClick={() => commit("open-account", (current) => ({
                ...current,
                accountPanelOpen: true,
              }))}
            >開く</button>
          </div>
        </div>
        {state.accountPanelOpen ? (
          <div className="account-panel">
            <p>実在しない練習用アカウントです。</p>
            <button
              className={actionClass("switch-account", highlightAction)}
              disabled={state.accountName.endsWith("B")}
              type="button"
              onClick={() => commit("switch-account", (current) => ({
                ...current,
                accountName: "練習アカウントB",
                lastNotice: "練習アカウントBへ切り替えました。",
              }))}
            >
              {state.accountName.endsWith("B") ? "練習アカウントBを使用中 ✓" : "練習アカウントBへ切り替える"}
            </button>
            <button
              className={actionClass("password-help", highlightAction)}
              disabled={state.passwordResetStarted}
              type="button"
              onClick={() => commit("password-help", (current) => ({
                ...current,
                passwordResetStarted: true,
                lastNotice: "再設定を始めました。練習メールに認証コードが届いています。",
              }))}
            >
              {state.passwordResetStarted ? "再設定メールを送信済み ✓" : "パスワードを忘れたとき"}
            </button>
            {state.passwordResetStarted ? (
              <div className="safe-box"><Icon name="mail" /><p>練習メールを開いて認証コードを確認しましょう。</p></div>
            ) : null}
            <div className="caution-box"><Icon name="alert" /><p><strong>アカウント削除</strong>現実では元に戻せないことがあります。</p></div>
            <button
              className={actionClass("safe-cancel", highlightAction)}
              type="button"
              onClick={() => commit(state.accountName.endsWith("B") ? "safe-cancel" : "safe-cancel-early", (current) => ({
                ...current,
                accountPanelOpen: false,
                lastNotice: "削除せず、安全にキャンセルしました。",
              }))}
            >削除せずキャンセル</button>
          </div>
        ) : null}
      </div>
    );
  }

  if (state.activeApp === "files") {
    const selectedIsTarget = state.selectedFile
      ? isTargetFile(scenario, state.selectedFile)
      : false;
    return (
      <div className="virtual-app files-app">
        <div className="app-title-row"><div><small>現在の場所：{state.fileLocation}</small><h3>ファイル</h3></div><Icon name="folder" /></div>
        <div className="file-list">
          {scenario.files.map((file) => (
            <button
              className={`${actionClass("select-file", highlightAction)} ${state.selectedFile === file.name ? "is-selected" : ""}`}
              key={file.name}
              type="button"
              onClick={() => commit(
                isTargetFile(scenario, file.name) ? "select-file" : "select-file-other",
                (current) => ({
                  ...current,
                  selectedFile: file.name,
                  shareChooserOpen: false,
                  lastNotice: isTargetFile(scenario, file.name)
                    ? `${file.name}を選びました。`
                    : `${file.name}も選べますが、今回の目的とは別のファイルです。`,
                }),
              )}
            >
              <Icon name="file" /><span>{file.name}<small>{file.description}</small></span>
              {state.selectedFile === file.name ? <Icon name="check" /> : null}
            </button>
          ))}
        </div>
        {state.selectedFile ? (
          <div className="file-actions">
            <p><strong>{state.selectedFile}</strong> を選びました</p>
            <button
              className={actionClass("move-file", highlightAction)}
              disabled={!selectedIsTarget || state.fileLocation === scenario.moveTarget}
              type="button"
              onClick={() => commit("move-file", (current) => ({
                ...current,
                fileLocation: scenario.moveTarget,
                lastNotice: `${current.selectedFile}を「${scenario.moveTarget}」へ移動しました。`,
              }))}
            >
              <Icon name="folder" />「{scenario.moveTarget}」へ移動
            </button>
            <button
              className={actionClass("share-photo", highlightAction)}
              disabled={!selectedIsTarget}
              type="button"
              onClick={() => commit("share-photo", (current) => ({
                ...current,
                photoShared: true,
                shareChooserOpen: true,
              }))}
            >
              <Icon name="upload" />共有先を選ぶ
            </button>
            <button
              className={actionClass("open-mail", highlightAction)}
              disabled={!selectedIsTarget}
              type="button"
              onClick={() => commit("open-mail", (current) => openSimulatorApp(current, "mail"))}
            >
              <Icon name="mail" />メールを開く
            </button>
          </div>
        ) : <p className="inline-guidance">ファイルを1つ選ぶと、できる操作が表示されます。</p>}
        {state.shareChooserOpen ? (
          <div className="popover-menu" role="dialog" aria-label="共有先を選ぶ">
            <p><strong>共有先を選ぶ</strong></p>
            <button
              className={actionClass("open-mail", highlightAction)}
              type="button"
              onClick={() => commit("open-mail", (current) => openSimulatorApp(current, "mail"))}
            >
              <Icon name="mail" />メール
            </button>
            <button type="button" onClick={() => commit("share-other", (current) => current)}>チャット</button>
          </div>
        ) : null}
      </div>
    );
  }

  if (state.activeApp === "mail") {
    const canAttach = Boolean(state.selectedFile && isTargetFile(scenario, state.selectedFile));
    return (
      <div className="virtual-app mail-app">
        <div className="app-title-row"><div><small>実際には送信されません</small><h3>練習メール</h3></div><Icon name="mail" /></div>
        {state.authCodeViewed ? (
          <div className="safe-box"><Icon name="shield" /><p><strong>練習用認証コード</strong><br />428 615</p></div>
        ) : null}
        <label>宛先<input value="練習相手" readOnly /></label>
        <label>本文<textarea defaultValue="資料を確認してください。" /></label>
        <div className="attachment-chip"><Icon name="file" />{state.attachedFile ?? "ファイルは未添付です"}</div>
        <div className="caution-box"><Icon name="alert" /><p><strong>現実なら確認してから</strong>送信前に、宛先・本文・添付を見直します。</p></div>
        <div className="button-row">
          <button
            className={actionClass("attach-file", highlightAction)}
            disabled={!canAttach || state.attachedFile === state.selectedFile}
            type="button"
            onClick={() => commit("attach-file", (current) => ({
              ...current,
              attachedFile: current.selectedFile,
              lastNotice: `${current.selectedFile}を添付しました。`,
            }))}
          >
            <Icon name="upload" />
            {state.attachedFile === state.selectedFile ? "添付済み ✓" : canAttach ? `${state.selectedFile}を添付` : "先にファイルを選ぶ"}
          </button>
          <button
            className={actionClass("safe-cancel", highlightAction)}
            type="button"
            onClick={() => commit(state.attachedFile ? "safe-cancel" : "safe-cancel-empty", (current) => ({
              ...current,
              activeApp: "home",
              previousApp: null,
              mailDraftSaved: Boolean(current.attachedFile),
              lastNotice: current.attachedFile
                ? `${current.attachedFile}を付けた下書きを安全に保存しました。`
                : "送信せず、安全にメールを閉じました。",
            }))}
          >いったんやめる</button>
        </div>
      </div>
    );
  }

  if (state.activeApp === "help") {
    return (
      <div className="virtual-app help-app">
        <div className="error-sample">
          <Icon name="alert" />
          <div><strong>{scenario.error.code ? `${scenario.error.code} ` : ""}{scenario.error.title}</strong><p>{scenario.error.message}</p></div>
          <button
            className={actionClass("read-error", highlightAction)}
            type="button"
            onClick={() => commit("read-error", (current) => ({ ...current, lastErrorRead: true }))}
          >内容を確認した</button>
        </div>
        <form className="virtual-search" onSubmit={submitHelpSearch}>
          <label htmlFor={`${tabBaseId}-help-search`}>困っていることを短い言葉で検索</label>
          <div>
            <input
              id={`${tabBaseId}-help-search`}
              value={state.helpQuery}
              onChange={(event) => updateDraft({ helpQuery: event.target.value, helpSearchStatus: "idle" })}
              placeholder={scenario.help.prompt}
            />
            <button className={actionClass("search-help", highlightAction)} type="submit"><Icon name="search" />調べる</button>
          </div>
        </form>
        {state.helpSearchStatus === "empty" ? <p className="inline-guidance">画面に出ている言葉を一つ入れてみましょう。</p> : null}
        {state.helpSearchStatus === "wrong" ? <p className="inline-guidance">今回は「{scenario.help.prompt}」に近い言葉で調べてみましょう。</p> : null}
        {state.helpSearched ? (
          <div className="help-result">
            <strong>{scenario.help.resultTitle}</strong>
            <ol>{scenario.help.resultSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            <button
              className={actionClass("dismiss-popup", highlightAction)}
              type="button"
              onClick={() => commit("dismiss-popup", (current) => ({ ...current, helpSearched: false }))}
            >案内を閉じる</button>
          </div>
        ) : null}
        <button
          className={actionClass("write-question", highlightAction)}
          disabled={!state.helpSearched || !scenario.help.questionText}
          type="button"
          onClick={() => commit("write-question", (current) => ({
            ...current,
            helpQuestion: scenario.help.questionText ?? "",
            helpQuestionSaved: true,
          }))}
        >
          <Icon name="message" />AIに聞く文章を組み立てる
        </button>
        {state.helpQuestionSaved ? (
          <div className="safe-box"><Icon name="message" /><p><strong>質問文ができました</strong><br />{state.helpQuestion}</p></div>
        ) : null}
      </div>
    );
  }

  if (state.activeApp === "notes") {
    return (
      <div className="virtual-app notes-app">
        <div className="copy-source">{scenario.notesSourceText}</div>
        <div className="button-row">
          <button
            className={actionClass("copy-text", highlightAction)}
            type="button"
            onClick={() => commit("copy-text", (current) => ({
              ...current,
              clipboardText: scenario.notesSourceText,
              lastNotice: `「${scenario.notesSourceText}」をコピーしました。`,
            }))}
          ><Icon name="copy" />文章をコピー</button>
          <button
            className={actionClass("paste-text", highlightAction)}
            disabled={!state.clipboardText}
            type="button"
            onClick={() => commit("paste-text", (current) => ({
              ...current,
              noteText: current.clipboardText,
              lastNotice: "コピーした文章を貼り付けました。",
            }))}
          >貼り付ける</button>
        </div>
        <div className="note-paper">{state.noteText || "ここに貼り付けます"}</div>
      </div>
    );
  }

  if (state.activeApp === "photos") {
    return (
      <div className="virtual-app photos-app">
        <div className="photo-placeholder" aria-label="山と太陽の練習用イラスト"><Icon name="eye" size={44} /><span>練習写真</span></div>
        <button
          className={actionClass("share-photo", highlightAction)}
          type="button"
          onClick={() => commit("share-photo", (current) => ({ ...current, photoShared: true, shareChooserOpen: true }))}
        ><Icon name="upload" />共有を練習する</button>
        {state.photoShared ? <div className="safe-box"><Icon name="shield" /><p>共有先を選ぶ練習ができました。実際には誰にも届いていません。</p></div> : null}
      </div>
    );
  }

  return (
    <div className="empty-state">
      <Icon name={state.activeApp === "calendar" ? "calendar" : "message"} size={38} />
      <p>この練習アプリは自由に開いて大丈夫です。</p>
    </div>
  );
}
