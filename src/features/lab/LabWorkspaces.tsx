"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

import type { JourneyEnvironment } from "@/features/progress/ProgressProvider";

export interface WorkspaceProps {
  environment: JourneyEnvironment;
  missionId: string;
  emit: (eventId: string, message: string) => void;
}

const environmentCopy: Record<JourneyEnvironment, { context: string; shortcut: string; home: string; files: string }> = {
  windows: { context: "右クリック", shortcut: "Ctrl", home: "スタート", files: "エクスプローラー" },
  mac: { context: "Controlクリック／2本指クリック", shortcut: "Command", home: "Dock", files: "Finder" },
  iphone: { context: "長押し", shortcut: "編集メニュー", home: "ホーム", files: "ファイル" },
  android: { context: "長押し", shortcut: "編集メニュー", home: "ホーム", files: "Files" },
};

function ContextTarget({ environment, emit }: Pick<WorkspaceProps, "environment" | "emit">) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = () => {
    setMenuOpen(true);
    emit("context-opened", `${environmentCopy[environment].context}で補助メニューが開きました。`);
  };
  const startLongPress = () => {
    if (environment === "windows" || environment === "mac") return;
    timerRef.current = setTimeout(openMenu, 650);
  };
  const cancelLongPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  return (
    <div className="lab-context-area">
      <button
        className="lab-file"
        onClick={(event) => { if (event.detail === 0) openMenu(); }}
        onContextMenu={(event) => { event.preventDefault(); openMenu(); }}
        onPointerCancel={cancelLongPress}
        onPointerDown={startLongPress}
        onPointerLeave={cancelLongPress}
        onPointerUp={cancelLongPress}
        type="button"
      >
        <span aria-hidden="true">📁</span>
        参考資料
      </button>
      <small>フォルダー・{environmentCopy[environment].context}でメニューを開く</small>
      {menuOpen ? (
        <div className="lab-menu" role="group" aria-label="参考資料フォルダーのメニュー">
          <button type="button" onClick={() => { emit("info-inspected", "種類と場所を確認しました。"); setMenuOpen(false); }}>情報を見る</button>
          <button type="button" onClick={() => setMenuOpen(false)}>閉じる</button>
        </div>
      ) : null}
    </div>
  );
}

function CopyPastePractice({ environment, emit }: Pick<WorkspaceProps, "environment" | "emit">) {
  const source = "夏祭りのご案内\n集合場所：中央公民館\n開始時刻：午前10時";
  const copiedText = "集合場所：中央公民館";
  const [selectedCorrectly, setSelectedCorrectly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const [menu, setMenu] = useState<"source" | "note" | null>(null);

  function inspectSelection(target: HTMLTextAreaElement) {
    setSelectedCorrectly(target.value.slice(target.selectionStart, target.selectionEnd) === copiedText);
  }

  return (
    <div className={`copy-practice copy-practice--${environment}`}>
      <section className="notepad-window" aria-label="見本文が開かれたメモ帳">
        <header><span className="notepad-icon" aria-hidden="true">▤</span><strong>夏祭りのご案内.txt - メモ帳</strong><span className="window-controls" aria-hidden="true">—　□　×</span></header>
        <nav aria-label="メモ帳のメニュー"><span>ファイル</span><span>編集</span><span>表示</span></nav>
        <textarea
          aria-label="コピー元の見本文"
          onContextMenu={(event) => { event.preventDefault(); const selected = event.currentTarget.value.slice(event.currentTarget.selectionStart, event.currentTarget.selectionEnd) === copiedText; setSelectedCorrectly(selected); if (selected) setMenu("source"); }}
          onKeyDown={(event) => { if (event.shiftKey && event.key === "F10" && selectedCorrectly) setMenu("source"); }}
          onSelect={(event) => inspectSelection(event.currentTarget)}
          readOnly
          value={source}
        />
        {menu === "source" ? <div className="native-context-menu"><button type="button" onClick={() => { setCopied(true); setMenu(null); emit("text-copied", "『集合場所：中央公民館』をコピーしました。"); }}>コピー</button></div> : null}
      </section>

      <section className="notepad-window" aria-label="貼り付け先のメモ帳">
        <header><span className="notepad-icon" aria-hidden="true">▤</span><strong>自分のメモ.txt - メモ帳</strong><span className="window-controls" aria-hidden="true">—　□　×</span></header>
        <nav aria-label="メモ帳のメニュー"><span>ファイル</span><span>編集</span><span>表示</span></nav>
        <textarea
          aria-label="貼り付け先のメモ欄"
          onContextMenu={(event) => { event.preventDefault(); setMenu("note"); }}
          onKeyDown={(event) => { if (event.shiftKey && event.key === "F10") setMenu("note"); }}
          onChange={(event) => setNote(event.target.value)}
          placeholder="ここを右クリックします"
          value={note}
        />
        {menu === "note" ? <div className="native-context-menu native-context-menu--target"><button disabled={!copied} type="button" onClick={() => { setNote(copiedText); setMenu(null); emit("text-pasted", "コピーした文章をメモへ貼り付けました。"); }}>貼り付け</button></div> : null}
      </section>
      <p className="copy-practice__status" aria-live="polite">{!selectedCorrectly ? "① 見本文の『集合場所：中央公民館』だけをドラッグして選択します" : !copied ? `② 選択した文字の上で${environmentCopy[environment].context}します` : note !== copiedText ? `③ 右のメモ欄を${environmentCopy[environment].context}します` : "コピーと貼り付けができました"}</p>
    </div>
  );
}

export function MovementWorkspace({ environment, emit, missionId }: WorkspaceProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const showAll = missionId === "free-play";
  return (
    <div className="lab-workspace-grid lab-workspace-grid--movement">
      {missionId === "pointer" || showAll ? <section className="lab-panel" aria-labelledby="calendar-title">
        <div className="lab-panel__bar"><span /><h3 id="calendar-title">7月の予定</h3></div>
        <div className="mini-calendar" role="group" aria-label="7月の予定表">
          {[17, 18, 19, 20, 21, 22].map((day) => (
            <button
              aria-pressed={selectedDate === day}
              className={selectedDate === day ? "is-selected" : ""}
              key={day}
              onClick={() => { setSelectedDate(day); if (day === 19) emit("target-selected", "7月19日が選ばれました。"); }}
              type="button"
            >
              <span>7月</span>{day}日{day === 19 ? <small>夏祭り</small> : null}
            </button>
          ))}
        </div>
      </section> : null}

      {missionId === "scroll" || showAll ? <section className="lab-panel" aria-labelledby="notice-title">
        <div className="lab-panel__bar"><span /><h3 id="notice-title">夏祭りのお知らせ</h3></div>
        <div className="scroll-notice" tabIndex={0} onScroll={(event) => {
          if (event.currentTarget.scrollTop > 80) emit("notice-scrolled", "お知らせの続きを下へ動かしました。");
        }}>
          <p><strong>開催日</strong><br />7月19日（土）</p>
          <p><strong>集合</strong><br />午前10時・中央公民館</p>
          <p>雨天の場合は館内で行います。途中に休憩があります。</p>
          <p>受付で名前を伝えてください。参加費はかかりません。</p>
          <button type="button" onClick={() => emit("detail-found", "持ち物『青いタオル』を見つけました。")}>
            <strong>持ち物</strong><br />青いタオル
          </button>
        </div>
      </section> : null}

      {missionId === "context" || showAll ? <section className="lab-panel" aria-labelledby="files-title">
        <div className="lab-panel__bar"><span /><h3 id="files-title">{environmentCopy[environment].files}</h3></div>
        <div className="lab-files-row">
          <ContextTarget environment={environment} emit={emit} />
        </div>
      </section> : null}

      {missionId === "recovery" || showAll ? <CopyPastePractice environment={environment} emit={emit} /> : null}
    </div>
  );
}

export function ScreensWorkspace({ environment, emit }: WorkspaceProps) {
  type ScreenApp = "browser" | "notes" | "camera" | "phone";
  type Screen = ScreenApp | "home";
  const appLabel: Record<ScreenApp, string> = {
    browser: "ブラウザ",
    notes: "メモ",
    camera: "カメラ",
    phone: "電話",
  };
  const [openApps, setOpenApps] = useState<ScreenApp[]>([]);
  const [activeApp, setActiveApp] = useState<Screen>("home");
  const [browserPage, setBrowserPage] = useState<"search" | "facility">("search");
  const [menuOpen, setMenuOpen] = useState(false);
  const [closedNotes, setClosedNotes] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [calling, setCalling] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const screenMountedRef = useRef(false);

  useEffect(() => {
    if (!screenMountedRef.current) {
      screenMountedRef.current = true;
      return;
    }
    screenRef.current?.focus();
  }, [activeApp, browserPage]);

  const openApp = (app: ScreenApp) => {
    const alreadyOpen = openApps.includes(app);
    const next = alreadyOpen ? openApps : [...openApps, app];
    setOpenApps(next);
    setActiveApp(app);
    if (app === "notes") {
      emit(closedNotes ? "app-reopened" : "notes-opened", closedNotes ? "メモをもう一度開きました。" : "メモを開きました。");
    }
    if (app === "camera") emit("camera-opened", "カメラを開きました。写る範囲を確認できます。");
    if (app === "phone") emit("phone-opened", "電話を開きました。発信前に相手を確認できます。");
    if (next.includes("browser") && next.includes("notes")) emit("two-apps-open", "ブラウザとメモが、どちらも開いたままです。");
  };

  const switchApp = (app: ScreenApp) => {
    if (app !== activeApp) emit("app-switched", `${appLabel[app]}へ切り替えました。`);
    setActiveApp(app);
  };

  const handleShortcut = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" && (event.altKey || event.metaKey)) {
      event.preventDefault();
      if (openApps.length >= 2) switchApp(activeApp === openApps[0] ? openApps[1] : openApps[0]);
    }
  };

  return (
    <div className={`device-stage device-stage--${environment}`} tabIndex={0} onKeyDown={handleShortcut}>
      <div className="device-stage__topbar">
        <span>{environment === "windows" ? "デスクトップ" : environment === "mac" ? "Finder　 ファイル　 編集" : "11:24　●●●"}</span>
        <button type="button" aria-expanded={menuOpen} onClick={() => { setMenuOpen((value) => !value); emit("menu-opened", "画面のメニューを開きました。"); }}>⋯ <span className="sr-only">メニュー</span></button>
        {menuOpen ? <div className="lab-menu lab-menu--top" role="group" aria-label="画面のメニュー"><button type="button" onClick={() => { emit("display-opened", "表示の設定を開きました。"); setMenuOpen(false); }}>表示</button><button type="button">ヘルプ</button></div> : null}
      </div>

      <div className="device-stage__screen" ref={screenRef} tabIndex={-1}>
        {activeApp === "home" ? (
          <div className="app-launcher">
            <p>{environment === "windows" ? "開くアプリを左クリックしてください" : environment === "mac" ? "開くアプリをクリックしてください" : "開くアプリをタップしてください"}</p>
            <div><button type="button" onClick={() => openApp("browser")}><span>🌐</span>ブラウザ</button><button type="button" onClick={() => openApp("notes")}><span>📝</span>メモ</button>{environment === "iphone" || environment === "android" ? <><button type="button" onClick={() => openApp("camera")}><span>📷</span>カメラ</button><button type="button" onClick={() => openApp("phone")}><span>☎</span>電話</button></> : null}</div>
          </div>
        ) : null}
        {activeApp === "browser" ? (
          <section className="fake-window" tabIndex={-1} aria-label="ブラウザ">
            <header><button disabled={browserPage === "search"} type="button" onClick={() => { setBrowserPage("search"); emit("went-back", "ひとつ前の検索画面へ戻りました。"); }}>← 戻る</button><strong>ブラウザ</strong><button type="button" onClick={() => { setOpenApps((apps) => apps.filter((app) => app !== "browser")); setActiveApp("home"); }}>閉じる</button></header>
            {browserPage === "search" ? <div className="fake-page"><p>検索結果</p><button className="fake-result" type="button" onClick={() => { setBrowserPage("facility"); emit("page-opened", "施設案内のページを開きました。"); }}>中央公民館｜施設案内 <small>開館時間と場所</small></button></div> : <div className="fake-page"><p className="fake-site-label">みどり市 公式</p><h3>中央公民館 施設案内</h3><p>開館：午前9時〜午後8時</p></div>}
          </section>
        ) : null}
        {activeApp === "notes" ? (
          <section className="fake-window" tabIndex={-1} aria-label="メモ">
            <header><strong>メモ</strong><button type="button" onClick={() => { setClosedNotes(true); setOpenApps((apps) => apps.filter((app) => app !== "notes")); setActiveApp("home"); emit("window-closed", "メモの画面を閉じました。内容は残っています。"); }}>閉じる</button></header>
            <textarea aria-label="練習メモ" defaultValue="中央公民館へ確認する" />
          </section>
        ) : null}
        {activeApp === "camera" ? (
          <section className="fake-window camera-practice" tabIndex={-1} aria-label="カメラ">
            <header><strong>カメラ</strong><button type="button" onClick={() => setActiveApp("home")}>ホームへ</button></header>
            <div className={photoTaken ? "camera-preview has-photo" : "camera-preview"}><span>{photoTaken ? "夏祭りのポスター" : "撮る前に、画面の四隅まで確認"}</span></div>
            <button className="camera-shutter" type="button" onClick={() => { setPhotoTaken((value) => !value); emit(photoTaken ? "camera-retaken" : "camera-taken", photoTaken ? "写真を撮り直せる状態へ戻しました。" : "写る範囲を確認して練習写真を撮りました。"); }}>{photoTaken ? "↶ 撮り直す" : "● 撮影"}</button>
          </section>
        ) : null}
        {activeApp === "phone" ? (
          <section className="fake-window phone-practice" tabIndex={-1} aria-label="電話">
            <header><strong>電話</strong><button type="button" onClick={() => setActiveApp("home")}>ホームへ</button></header>
            <div><span className="contact-avatar">公</span><h3>中央公民館</h3><p>000-1234-5678（練習用）</p>{calling ? <p className="call-status">通話中：外部にはつながっていません</p> : <p>相手と番号を確認してから発信します</p>}</div>
            <button className={calling ? "hangup-button" : "call-button"} type="button" onClick={() => { setCalling((value) => !value); emit(calling ? "call-ended" : "call-started", calling ? "練習通話を終了しました。" : "相手を確認して練習通話を始めました。"); }}>{calling ? "通話を終了" : "発信する"}</button>
          </section>
        ) : null}
      </div>

      <nav className="device-stage__switcher" aria-label={`${environmentCopy[environment].home}と開いているアプリ`}>
        <button type="button" aria-pressed={activeApp === "home"} onClick={() => setActiveApp("home")}>{environmentCopy[environment].home}</button>
        {openApps.map((app) => <button type="button" aria-pressed={activeApp === app} onClick={() => switchApp(app)} key={app}>{app === "browser" ? "🌐 ブラウザ" : app === "notes" ? "📝 メモ" : app === "camera" ? "📷 カメラ" : "☎ 電話"}</button>)}
      </nav>
      <p className="device-stage__shortcut">{environment === "windows" ? "画面下のアプリ名を左クリックすると、開いた画面を切り替えられます。" : environment === "mac" ? "画面下のアプリ名をクリックすると、開いた画面を切り替えられます。" : "画面下からスワイプすると、開いたアプリを切り替えられます。"}</p>
    </div>
  );
}

export function TextWorkspace({ emit }: WorkspaceProps) {
  const source = "集合場所：中央公民館　持ち物：青いタオル　開始：午前10時";
  const [typing, setTyping] = useState("");
  const [note, setNote] = useState("");
  const [previousNote, setPreviousNote] = useState("");
  const [redoNote, setRedoNote] = useState<string | null>(null);
  const editedRef = useRef(false);

  const inspectSelection = (target: HTMLTextAreaElement) => {
    const selected = target.value.slice(target.selectionStart, target.selectionEnd);
    if (selected === "青いタオル") emit("text-selected", "『青いタオル』だけを選びました。");
  };

  const handleCopy = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const selected = event.currentTarget.value.slice(event.currentTarget.selectionStart, event.currentTarget.selectionEnd);
    if (selected.includes("集合場所：中央公民館")) emit("text-copied", "集合場所をクリップボードへコピーしました。");
  };

  return (
    <div className="text-workbench">
      <section className="lab-panel">
        <div className="lab-panel__bar"><span /><h3>案内から必要な文字を使う</h3></div>
        <label className="field-label" htmlFor="source-text">案内文</label>
        <textarea id="source-text" className="selection-source" readOnly value={source} onCopy={handleCopy} onSelect={(event) => inspectSelection(event.currentTarget)} />
        <p className="field-help">マウスならドラッグ、スマートフォンなら長押し後の選択範囲を使います。</p>
        <label className="field-label" htmlFor="target-typing">予定の検索</label>
        <input id="target-typing" value={typing} onChange={(event) => { setTyping(event.target.value); if (event.target.value.trim() === "夏祭り 10時") emit("target-typed", "必要な文字を正しく入力しました。"); }} placeholder="ここへ入力" />
      </section>
      <section className="lab-panel note-editor">
        <div className="lab-panel__bar"><span /><h3>自分のメモ</h3><small>画面上のボタンで操作します</small></div>
        <textarea
          aria-label="貼り付け先のメモ"
          onChange={(event) => {
            setPreviousNote(note);
            setNote(event.target.value);
            setRedoNote(null);
            if (!editedRef.current && event.target.value.length > 0) {
              editedRef.current = true;
              emit("text-edited", "メモへ文字を追加しました。");
            }
          }}
          onPaste={(event) => {
            if (event.clipboardData.getData("text").includes("集合場所：中央公民館")) emit("text-pasted", "コピーした集合場所を貼り付けました。");
          }}
          placeholder="コピーした内容や、自分のメモをここへ"
          value={note}
        />
        <div className="editor-action-bar" aria-label="メモの編集操作">
          <button disabled={!note} type="button" onClick={() => { setRedoNote(note); setNote(previousNote); emit("text-undone", "画面上の『取り消し』で直前の編集を戻しました。"); }}>↶ 取り消し</button>
          <button disabled={redoNote === null} type="button" onClick={() => { if (redoNote === null) return; setNote(redoNote); setRedoNote(null); }}>↷ やり直し</button>
        </div>
      </section>
    </div>
  );
}

export function WebWorkspace({ emit }: WorkspaceProps) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [tabs, setTabs] = useState<Array<"official" | "blog">>([]);
  const [active, setActive] = useState<"results" | "official" | "blog">("results");
  const contentRef = useRef<HTMLDivElement>(null);
  const contentMountedRef = useRef(false);

  useEffect(() => {
    if (!contentMountedRef.current) {
      contentMountedRef.current = true;
      return;
    }
    contentRef.current?.focus();
  }, [active]);
  const runSearch = () => {
    const normalized = query.replace(/\s+/g, " ").trim();
    setSearched(true);
    setActive("results");
    if (normalized.includes("みどり市") && normalized.includes("図書館")) {
      emit("useful-query", "場所と施設名を含む検索語を使いました。");
      emit(normalized.includes("開館時間") ? "refined-query" : "broad-query", normalized.includes("開館時間") ? "『開館時間』を加えて絞りました。" : "まず広い検索結果を確認しました。");
    }
    if (normalized.includes("中央図書館") && normalized.includes("時間")) emit("independent-query", "目的と施設名を含む検索語を自分で作りました。");
  };
  const openTab = (tab: "official" | "blog") => {
    setTabs((current) => {
      const next = current.includes(tab) ? current : [...current, tab];
      if (next.length >= 2) emit("two-tabs-open", "二つの情報をタブに残しました。");
      return next;
    });
    setActive(tab);
    if (tab === "official") { emit("official-opened", "みどり市公式サイトを開きました。"); emit("independent-source", "公式の発信元を選びました。"); }
  };
  const address = active === "official" ? "https://www.city.midori.example/library" : active === "blog" ? "https://midori-life.example/diary" : "https://www.google.co.jp/";
  return (
    <div className="web-workbench">
      <div className="browser-chrome">
        <div className="browser-tabs" role="tablist" aria-label="開いているタブ">
          <button role="tab" aria-selected={active === "results"} type="button" onClick={() => setActive("results")}>検索</button>
          {tabs.map((tab) => <button role="tab" aria-selected={active === tab} type="button" onClick={() => setActive(tab)} key={tab}>{tab === "official" ? "みどり市公式" : "まちブログ"}</button>)}
          <button className="new-tab-button" type="button" aria-label="新しいタブ">＋</button>
        </div>
        <div className="browser-toolbar" aria-label="ブラウザの操作バー"><button type="button" aria-label="戻る">←</button><button type="button" aria-label="再読み込み">↻</button><div className="browser-address"><span aria-hidden="true">🔒</span>{address}</div><button type="button" aria-label="ブラウザのメニュー">…</button></div>
        <form className="search-bar" onSubmit={(event) => { event.preventDefault(); runSearch(); }}>
          <label className="sr-only" htmlFor="lab-search">検索語</label>
          <input id="lab-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：みどり市 図書館" />
          <button type="submit">検索</button>
        </form>
      </div>
      <div className="browser-page" ref={contentRef} tabIndex={-1}>
        {active === "results" ? (
          searched ? <div className="search-results">
            <p className="result-count">検索結果　2件</p>
            <article><p>www.city.midori.example › library</p><button type="button" onClick={() => openTab("official")}><strong>中央図書館｜みどり市公式ホームページ</strong></button><span>2026年7月18日更新　開館時間・休館日</span></article>
            <article><p>midori-life.example › diary</p><button type="button" onClick={() => openTab("blog")}><strong>まち歩きブログ：図書館へ行きました</strong></button><span>2022年4月2日　当時の営業時間メモ</span></article>
          </div> : <div className="search-empty"><span aria-hidden="true">⌕</span><h3>知りたいことを短い言葉に</h3><p>場所、名前、目的を組み合わせると見つけやすくなります。</p></div>
        ) : null}
        {active === "official" ? <article className="source-page source-page--official"><p className="source-badge">みどり市公式</p><h3>中央図書館</h3><p>明日 7月20日（日）は <strong>午前9時〜午後6時</strong> です。</p><div className="source-actions"><button type="button" onClick={() => { emit("source-checked", "発信元が『みどり市』であることを確認しました。"); emit("official-chosen", "公式情報を回答の根拠に選びました。"); }}>発信元を確認</button><button type="button" onClick={() => { emit("date-checked", "更新日が2026年7月18日だと確認しました。"); emit("official-date-checked", "公式ページの更新日を確認しました。"); }}>更新日を見る</button><button type="button" onClick={() => emit("independent-answer", "明日の時間と根拠を記録しました。")}>答えに使う</button></div></article> : null}
        {active === "blog" ? <article className="source-page"><p className="source-badge source-badge--personal">個人ブログ</p><h3>図書館へ行きました</h3><p>開館は午後8時まででした。</p><p>投稿日：2022年4月2日</p><div className="source-actions"><button type="button" onClick={() => emit("blog-date-checked", "ブログの情報が古いことを確認しました。")}>日付を確認</button><button type="button" onClick={() => emit("old-source-chosen", "古い個人ブログを最終根拠にしてしまいました。")}>この情報を答えに使う</button></div></article> : null}
      </div>
    </div>
  );
}

export function FilesWorkspace({ environment, emit }: WorkspaceProps) {
  const [folder, setFolder] = useState<"downloads" | "materials">("downloads");
  const [fileName, setFileName] = useState("document1.pdf");
  const [renaming, setRenaming] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [metadataCompared, setMetadataCompared] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const pickerTriggerRef = useRef<HTMLButtonElement>(null);
  const pickerOpenedRef = useRef(false);

  useEffect(() => {
    if (pickerOpen) {
      pickerOpenedRef.current = true;
      return;
    }
    if (pickerOpenedRef.current) {
      pickerOpenedRef.current = false;
      pickerTriggerRef.current?.focus();
    }
  }, [pickerOpen]);

  const moveFile = () => { setFolder("materials"); emit("file-moved", "ファイルを『参加資料』へ移しました。"); };
  return (
    <div className="files-workbench">
      <section className="file-browser">
        <header><strong>{environmentCopy[environment].files}</strong><button type="button" onClick={() => emit("location-checked", `現在地が${folder === "downloads" ? "ダウンロード" : "参加資料"}だと確認しました。`)}>場所を確認</button></header>
        <nav aria-label="保存場所"><button aria-current={folder === "downloads" ? "page" : undefined} type="button" onClick={() => { setFolder("downloads"); emit("downloads-opened", "ダウンロードを開きました。"); }}>↓ ダウンロード</button><button aria-current={folder === "materials" ? "page" : undefined} type="button" onClick={() => setFolder("materials")}>📁 参加資料</button></nav>
        <div className="file-list" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "current-file" && folder === "materials") moveFile(); }}>
          <p className="breadcrumb">この端末 › {folder === "downloads" ? "ダウンロード" : "参加資料"}</p>
          {(!downloaded || folder === "materials") ? null : <div className="download-comparison">
            <button className="file-row" type="button" onClick={() => { if (metadataCompared) emit("download-verified", "日付とサイズを比べ、最新の参加案内を開きました。"); else emit("file-opened-before-comparison", "開く前に、同名ファイルの日付とサイズも比べてみましょう。"); }}>📄 参加案内.pdf <small>2026/07/19・2.4 MB</small></button>
            <button className="file-row" type="button" onClick={() => emit("old-file-inspected", "古い同名ファイルでした。日付とサイズが手掛かりです。")}>📄 参加案内 (1).pdf <small>2025/06/30・1.8 MB</small></button>
            <button className="compare-files" type="button" onClick={() => { setMetadataCompared(true); emit("download-metadata-compared", "二つの日付とサイズを比べました。2026年版が最新です。"); }}>日付とサイズを比べる</button>
          </div>}
          {(folder === "downloads" || fileName !== "document1.pdf") ? <div className="file-row file-row--editable" draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", "current-file")}>
            <span>📄</span>
            {renaming ? <input autoFocus aria-label="新しいファイル名" value={fileName} onChange={(event) => setFileName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { setRenaming(false); if (fileName === "2026夏祭り案内.pdf") emit("file-renamed", "意味のあるファイル名へ変更しました。"); } }} /> : <button type="button" onContextMenu={(event) => { event.preventDefault(); setRenaming(true); }}>{fileName}</button>}
            <button type="button" onClick={() => setRenaming(true)}>名前変更</button>
            <button type="button" onClick={moveFile}>参加資料へ移動</button>
          </div> : null}
          {folder === "materials" ? <button className="file-row" type="button" onClick={() => { setFileName("2026夏祭り案内.pdf"); emit("independent-organized", "申込書を後から分かる名前と場所へ整理しました。"); }}>📄 申込書_記入済.pdf <small>新しい版</small></button> : null}
        </div>
        <button className="download-practice" type="button" disabled={downloaded} onClick={() => { setDownloaded(true); emit("download-started", "案内PDFを一度ダウンロードしました。"); emit("independent-saved", "受け取った資料を端末へ保存しました。"); }}>{downloaded ? "保存が完了しました" : "参加案内.pdf をダウンロード"}</button>
      </section>
      <section className="mail-composer">
        <header><strong>返信メール</strong><span>送信は練習内だけ</span></header>
        <label>宛先<input defaultValue="staff@midori.example" readOnly /></label>
        <label>件名<input defaultValue="夏祭り資料" /></label>
        <div className="attachment-zone">
          {attachment ? <p>📎 {attachment} <button type="button" onClick={() => { setAttachment(null); setReviewed(false); }}>外す</button></p> : <p>添付はまだありません</p>}
          <button ref={pickerTriggerRef} type="button" onClick={() => setPickerOpen(true)}>📎 ファイルを選ぶ</button>
          {pickerOpen ? <div className="file-picker" role="group" aria-label="練習用ファイル選択"><h3>添付するファイル</h3><button type="button" onClick={() => { setAttachment("2026夏祭り案内.pdf"); setReviewed(false); setPickerOpen(false); emit("correct-attached", "新しい案内を添付しました。"); emit("independent-attached", "整理した資料を返信へ添付しました。"); }}>2026夏祭り案内.pdf <small>新しい版</small></button><button type="button" onClick={() => { setAttachment("2024夏祭り案内.pdf"); setReviewed(false); setPickerOpen(false); }}>2024夏祭り案内.pdf <small>古い版</small></button><button type="button" onClick={() => setPickerOpen(false)}>やめる</button></div> : null}
        </div>
        <button className="review-button" type="button" onClick={() => { setReviewed(true); emit("recipient-reviewed", "宛先、件名、添付ファイル名を見直しました。"); if (attachment === "2026夏祭り案内.pdf") emit("independent-attached", "正しい宛先と版を確認しました。"); }}>送信前の3項目を確認</button>
        <button className="practice-send" disabled={!attachment || !reviewed} type="button" onClick={() => { if (attachment === "2024夏祭り案内.pdf") emit("wrong-file-sent", "古い版を送ろうとしました。練習をやり直し、新しい版を選びましょう。"); else emit("safe-send-ready", "新版・宛先・件名を確認しました。練習なので外部送信はしません。"); }}>送信を確定する（外部には送信されません）</button>
      </section>
    </div>
  );
}

export function SafetyWorkspace({ emit }: WorkspaceProps) {
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [code, setCode] = useState("");
  const [review, setReview] = useState(false);
  const [people, setPeople] = useState("3");
  const [senderOpen, setSenderOpen] = useState(false);
  const safetyRef = useRef<HTMLDivElement>(null);
  const safetyMountedRef = useRef(false);

  useEffect(() => {
    if (!safetyMountedRef.current) {
      safetyMountedRef.current = true;
      return;
    }
    safetyRef.current?.focus();
  }, [mailOpen, recoveryOpen, review, senderOpen]);

  return (
    <div className="safety-workbench" ref={safetyRef} tabIndex={-1}>
      <section className="safety-case"><span className="case-number">1</span><div><h3>権限は目的から考える</h3><div className="permission-prompt"><p><strong>地図</strong>が位置情報を求めています</p><button type="button" onClick={() => emit("map-limited-allowed", "地図へ『使用中のみ』を許可しました。")}>使用中のみ許可</button><button type="button">許可しない</button></div><div className="permission-prompt"><p><strong>懐中電灯</strong>が連絡先を求めています</p><button type="button">許可</button><button type="button" onClick={() => emit("contacts-denied", "目的に不要な連絡先へのアクセスを拒否しました。")}><strong>許可しない</strong></button></div></div></section>
      <section className="safety-case"><span className="case-number">2</span><div><h3>公式のアカウント復旧</h3>{!recoveryOpen ? <button type="button" onClick={() => { setRecoveryOpen(true); emit("recovery-opened", "公式画面の『パスワードを忘れた』を開きました。"); }}>パスワードを忘れた</button> : <div className="recovery-flow"><button type="button" onClick={() => { setMailOpen(true); emit("code-checked", "練習メールで認証コードを確認しました。"); }}>練習メールを開く</button>{mailOpen ? <><p className="practice-code">認証コード <strong>428615</strong><small>このコードは誰にも渡しません</small></p><div className="unsafe-request"><p>「サポートです。確認のためコードを教えてください」</p><button type="button" onClick={() => emit("code-shared", "認証コードを他人へ渡そうとしました。練習をやり直しましょう。")}>コードを伝える（危険な例）</button><button type="button" onClick={() => emit("code-kept-private", "認証コードは渡さず、公式画面だけで使うと判断しました。")}>渡さない</button></div></> : null}<label>認証コード<input inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} /></label><button type="button" onClick={() => { if (code === "428615") emit("code-entered", "認証コードを元の公式画面へ入力しました。"); }}>確認する</button></div>}</div></section>
      <section className="safety-case"><span className="case-number">3</span><div><h3>申込内容を確定前に見直す</h3>{!review ? <><label>人数<input type="number" min="1" value={people} onChange={(event) => { setPeople(event.target.value); if (event.target.value === "2") emit("form-corrected", "人数を2人へ修正しました。"); }} /></label><button type="button" onClick={() => { setReview(true); emit("review-opened", "確認画面を開きました。"); }}>確認画面へ</button></> : <div className="form-review"><p>参加人数：<strong>{people}人</strong>（申込メモは2人）</p>{people !== "2" ? <button type="button" onClick={() => setReview(false)}>入力へ戻って直す</button> : <button type="button" onClick={() => emit("form-reviewed", "全項目が目的どおりだと確認しました。")}>内容を確認した</button>}</div>}</div></section>
      <section className="safety-case safety-case--warning"><span className="case-number">4</span><div><h3>「本日中に停止」に反応する前に</h3><p className="suspicious-message">【緊急】アカウントを本日中に確認してください</p><div className="safe-actions"><button type="button" onClick={() => { setSenderOpen(true); emit("sender-inspected", "送信元が公式ドメインと違うことを確認しました。"); }}>送信元を見る</button><button type="button" onClick={() => emit("official-route-used", "メッセージのリンクではなく公式アプリから確認しました。")} >公式アプリを開く</button><button type="button" onClick={() => emit("message-reported", "怪しいメッセージとして報告しました。")} >迷惑メッセージとして報告</button></div>{senderOpen ? <p className="sender-detail">送信元：notice@mid0ri-support.example（文字の一部が数字です）</p> : null}<button className="danger-link" type="button" onClick={() => emit("suspicious-link-opened", "怪しいリンクを開いてしまいました。戻って別経路を使いましょう。")}>メッセージ内のリンク（練習）</button></div></section>
    </div>
  );
}

export function RecoveryWorkspace({ environment, emit }: WorkspaceProps) {
  const [errorOpen, setErrorOpen] = useState(false);
  const [storageFixed, setStorageFixed] = useState(false);
  const [network, setNetwork] = useState("guest");
  const [inspectedNetwork, setInspectedNetwork] = useState(false);
  const [helpQuery, setHelpQuery] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [zoom, setZoom] = useState("175");
  return (
    <div className="recovery-workbench">
      <section className="recovery-card"><header><span>保存できませんでした</span><button type="button" onClick={() => { setErrorOpen(true); emit("error-inspected", "エラーの詳細を開きました。"); }}>詳細を見る</button></header>{errorOpen ? <div><p><strong>空き容量が不足しています。</strong><br />このファイルには20MB必要です。</p><button type="button" onClick={() => { setStorageFixed(true); emit("storage-fixed", "練習用の不要ファイルをゴミ箱へ移し、容量を空けました。"); }}>不要な練習ファイルを整理</button><button disabled={!storageFixed} type="button" onClick={() => emit("retry-succeeded", "原因を直したあと、保存に成功しました。")} >保存を再試行</button></div> : null}</section>
      <section className="recovery-card"><header><span>Wi-Fi：接続済み・通信なし</span><button type="button" onClick={() => { setInspectedNetwork(true); emit("network-inspected", "接続中のネットワークと機内モードを確認しました。"); }}>状態を見る</button></header>{inspectedNetwork ? <div className="network-list" role="radiogroup" aria-label="Wi-Fiネットワーク"><label><input type="radio" checked={network === "guest"} onChange={() => setNetwork("guest")} /> guest-free（通信なし）</label><label><input type="radio" checked={network === "town"} onChange={() => { setNetwork("town"); emit("correct-network", "『まちのWi-Fi』へつなぎ直しました。"); }} /> まちのWi-Fi（安全な練習用）</label><button disabled={network !== "town"} type="button" onClick={() => emit("connection-verified", "公式ページと天気ページの両方を表示できました。")} >二つのページで確認</button></div> : null}</section>
      <section className="recovery-card"><header><span>公式ヘルプを探す</span></header><form onSubmit={(event) => { event.preventDefault(); if (helpQuery.includes("文字") && (helpQuery.toLowerCase().includes(environment) || helpQuery.includes(environment === "windows" ? "Windows" : environment === "mac" ? "Mac" : environment === "iphone" ? "iPhone" : "Android"))) { setHelpOpen(true); emit("help-query", "環境名と症状を含めて検索しました。"); } }}><input aria-label="ヘルプ検索" value={helpQuery} onChange={(event) => setHelpQuery(event.target.value)} placeholder={`${environment === "iphone" ? "iPhone" : environment} 文字が大きい`} /><button type="submit">ヘルプ検索</button></form>{helpOpen ? <div className="help-result"><button type="button" onClick={() => { emit("trusted-help", "公式ヘルプの該当項目を開きました。"); setZoom("100"); emit("display-restored", "表示倍率を100%へ戻しました。"); }}>公式ヘルプ：表示倍率を元へ戻す</button><label>現在の表示倍率 <output>{zoom}%</output></label></div> : null}</section>
      <section className="recovery-card"><header><span>コピーの右クリックが使えません</span></header><p>右クリック以外にも、画面上の編集メニューからコピーできます。</p><button type="button" onClick={() => emit("primary-blocked", "右クリックが使えないことを確認しました。")} >右クリックを試す</button><div className="alternate-actions"><button type="button" onClick={() => emit("alternate-used", "上部の編集メニューからコピーしました。")} >編集メニュー → コピー</button></div></section>
    </div>
  );
}

function IndependentChallengeSurface({ missionId, emit }: Pick<WorkspaceProps, "missionId" | "emit">) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [source, setSource] = useState<"official" | "blog" | null>(null);
  const [answer, setAnswer] = useState("");
  const [fileSaved, setFileSaved] = useState(false);
  const [fileName, setFileName] = useState("申込書.pdf");
  const [fileLocation, setFileLocation] = useState("downloads");
  const [recipient, setRecipient] = useState("staff@midori.example");
  const [settingsQuery, setSettingsQuery] = useState("");
  const [settingsFound, setSettingsFound] = useState(false);
  const [setting, setSetting] = useState(100);
  const [sawOverflow, setSawOverflow] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [photoPreview, setPhotoPreview] = useState(false);

  if (missionId === "independent-file") return (
    <div className="independent-task independent-file-task">
      <section><h3>受信した資料</h3><div className="received-file"><span>📄 申込書.pdf</span><small>2026/07/19・最新版</small><button type="button" disabled={fileSaved} onClick={() => { setFileSaved(true); emit("independent-saved", "受け取った資料を端末へ一度保存しました。"); }}>{fileSaved ? "保存済み" : "端末へ保存"}</button></div></section>
      <section><h3>保存したファイルを整理</h3><label>ファイル名<input value={fileName} onChange={(event) => setFileName(event.target.value)} /></label><label>保存場所<select value={fileLocation} onChange={(event) => setFileLocation(event.target.value)}><option value="downloads">ダウンロード</option><option value="materials">参加資料</option><option value="desktop">デスクトップ</option></select></label><button type="button" disabled={!fileSaved} onClick={() => { if (fileLocation === "materials" && fileName.includes("2026") && fileName.includes("申込")) emit("independent-organized", "日付と内容が分かる名前で参加資料へ整理しました。"); else emit("independent-distractor", "後から見つける人が、日付と内容と場所から判断できるか見直しましょう。"); }}>この名前と場所で整理</button></section>
      <section><h3>返信へ添付</h3><label>宛先<input value={recipient} onChange={(event) => setRecipient(event.target.value)} /></label><p>添付候補：{fileName}</p><button type="button" disabled={!fileSaved} onClick={() => { if (recipient === "staff@midori.example" && fileLocation === "materials" && fileName.includes("2026")) emit("independent-attached", "正しい宛先と整理済みの新版を添付プレビューで確認しました。"); else emit("independent-distractor", "宛先、保存場所、ファイル名の三つを確かめてください。"); }}>添付プレビューを確認</button></section>
    </div>
  );

  if (missionId === "independent-settings") return (
    <div className="independent-task">
      <form className="independent-search" onSubmit={(event) => { event.preventDefault(); if (settingsQuery.includes("文字") || settingsQuery.includes("表示")) { setSettingsFound(true); emit("independent-setting-open", "設定内検索から文字サイズを見つけました。"); } else emit("independent-distractor", "変えたい見え方を短い言葉にして検索してみましょう。"); }}><label htmlFor="settings-search">設定内を検索</label><div><input id="settings-search" value={settingsQuery} onChange={(event) => setSettingsQuery(event.target.value)} /><button type="submit">検索</button></div></form>
      {settingsFound ? <section className="setting-preview"><h3>テキストサイズ</h3><div className={setting >= 160 ? "setting-sample is-overflowing" : "setting-sample"} style={{ fontSize: `${setting}%` }}>中央図書館からのお知らせを読みやすく調整してください。</div><input type="range" min="100" max="175" step="15" value={setting} onChange={(event) => { const value = Number(event.target.value); setSetting(value); if (value >= 160) { setSawOverflow(true); emit("independent-preview", "最大付近では文が画面からはみ出すことを確認しました。"); } if (sawOverflow && value <= 145) emit("independent-restored", "一段戻し、読みやすく収まる値へ調整しました。"); }} aria-label="練習画面の文字サイズ" /><output>{setting}%</output><p>{setting >= 160 ? "一部が横にはみ出しています" : "画面内に収まっています"}</p></section> : <p className="independent-empty">場所を暗記せず、設定内検索を使えます。</p>}
    </div>
  );

  if (missionId === "independent-troubleshoot") return (
    <div className="independent-task troubleshoot-task">
      <section className="error-evidence"><h3>写真を追加できません</h3><p>写真へのアクセスがありません。設定を確認してください。</p><button type="button" onClick={() => emit("independent-error-read", "表示されたエラーの内容と、守るべき元写真を確認しました。")} >表示内容を確認した</button></section>
      <fieldset><legend>まず確かめる原因</legend>{[["format", "ファイル形式"], ["location", "保存場所"], ["permission", "写真の権限"], ["capacity", "空き容量"]].map(([value, label]) => <label key={value}><input type="radio" name="cause" value={value} checked={diagnosis === value} onChange={() => { setDiagnosis(value); if (value === "permission") emit("independent-diagnosed", "エラー文から写真の権限が原因だと切り分けました。"); else emit("independent-distractor", `${label}では、表示されたエラーを説明できませんでした。`); }} />{label}</label>)}</fieldset>
      <section><h3>写真へのアクセス</h3><button type="button" disabled={diagnosis !== "permission"} onClick={() => { setPhotoPreview(true); emit("independent-solved", "今回選ぶ練習写真だけを許可し、添付プレビューへ進みました。"); }}>今回選ぶ写真だけ許可</button><button type="button" onClick={() => emit("independent-distractor", "すべての写真を許可する前に、必要最小限の選択肢を確かめましょう。")} >すべての写真を許可</button></section>
      {photoPreview ? <section className="photo-preview"><div aria-label="夏祭りポスターの練習写真">夏祭りポスター</div><p>添付プレビュー（まだ送信されていません）</p><label><input type="checkbox" onChange={(event) => { if (event.target.checked) emit("original-preserved", "添付後も元写真がアルバムに残っていることを確認しました。"); }} />元の写真がアルバムに残っていることを確認</label></section> : null}
    </div>
  );

  return (
    <div className="independent-task">
      <form className="independent-search" onSubmit={(event) => { event.preventDefault(); if (query.includes("図書館") && (query.includes("明日") || query.includes("開館"))) { setSearched(true); emit("independent-query", "施設、日付、知りたいことを検索語にできました。"); } else emit("independent-distractor", "場所と、いつの、何を知りたいかを検索語へ足してみましょう。"); }}><label htmlFor="independent-query">検索</label><div><input id="independent-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="知りたいことを入力" /><button type="submit">検索</button></div></form>
      {searched ? <div className="independent-results"><button type="button" onClick={() => { setSource("official"); emit("independent-source", "発信元と更新日を確認し、市の公式情報を選びました。"); }}><strong>中央図書館｜みどり市公式</strong><small>2026年7月18日更新</small></button><button type="button" onClick={() => { setSource("blog"); emit("independent-distractor", "個人ブログは2022年の記事でした。より新しい公式情報も比べましょう。"); }}><strong>まち歩きブログ</strong><small>2022年4月2日投稿</small></button></div> : <p className="independent-empty">検索語を自分で組み立ててください。答えは先に表示されません。</p>}
      {source ? <article className={source === "official" ? "independent-source is-official" : "independent-source"}><span>{source === "official" ? "みどり市公式" : "個人ブログ"}</span><p>{source === "official" ? "7月20日（日）は午前9時〜午後6時" : "2022年当時は午後8時まで"}</p></article> : null}
      <form className="independent-answer" onSubmit={(event) => { event.preventDefault(); if (source === "official" && answer.includes("9") && (answer.includes("18") || answer.includes("6"))) emit("independent-answer", "時間と公式情報という根拠を一緒に記録しました。"); else emit("independent-distractor", "選んだ情報の発信元と更新日をもう一度確かめましょう。"); }}><label htmlFor="independent-answer">明日の開館時間と根拠</label><textarea id="independent-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} /><button type="submit">回答を記録</button></form>
    </div>
  );
}

export function IndependentWorkspace({ missionId, emit }: WorkspaceProps) {
  const configurations: Record<string, { title: string; steps: Array<{ label: string; event: string; message: string }> }> = {
    "independent-research": { title: "図書館の時間を根拠つきで答える", steps: [
      { label: "施設名・日付・知りたいことを検索する", event: "independent-query", message: "目的を自分で検索語にできました。" },
      { label: "公式ページの発信元と更新日を見る", event: "independent-source", message: "新しい公式情報を根拠に選びました。" },
      { label: "明日は9時〜18時と記録する", event: "independent-answer", message: "時間と根拠を一緒に記録しました。" },
    ] },
    "independent-file": { title: "申込書を整理して返信に添付する", steps: [
      { label: "添付を端末へ一度保存する", event: "independent-saved", message: "資料を一度だけ保存しました。" },
      { label: "日付と内容が分かる名前で参加資料へ移す", event: "independent-organized", message: "後で見つけられる状態へ整理しました。" },
      { label: "宛先と新版を確認して返信へ添付する", event: "independent-attached", message: "正しい版と宛先を確認しました。" },
    ] },
    "independent-settings": { title: "読みやすい表示へ調整する", steps: [
      { label: "設定内検索で『文字サイズ』を探す", event: "independent-setting-open", message: "正確な場所を暗記せず、検索で設定を見つけました。" },
      { label: "最大表示を試して、行の切れを確認する", event: "independent-preview", message: "変更結果をプレビューしました。" },
      { label: "一段戻して読みやすい値にする", event: "independent-restored", message: "内容が切れない値へ戻しました。" },
    ] },
    "independent-troubleshoot": { title: "写真を追加できない原因を解決する", steps: [
      { label: "『写真へのアクセスがありません』を読む", event: "independent-error-read", message: "表示された問題をそのまま読みました。" },
      { label: "容量ではなく写真の権限が原因と判断する", event: "independent-diagnosed", message: "状態から原因候補を絞りました。" },
      { label: "今回選ぶ写真だけ許可し、プレビューする", event: "independent-solved", message: "必要最小限の許可で写真を追加しました。" },
      { label: "元の写真が残っていることを確かめる", event: "original-preserved", message: "元写真が変更されていないことを確認しました。" },
    ] },
  };
  const config = configurations[missionId] ?? configurations["independent-research"];
  return (
    <div className="independent-workbench">
      <header><p>正解の手順は先に表示しません。目的と画面の状態から進めます。</p><strong>{config.title}</strong></header>
      <div className="independent-screen">
        <div className="independent-appbar"><span>ブラウザ</span><span>ファイル</span><span>設定</span><span>ヘルプ</span></div>
        <IndependentChallengeSurface missionId={missionId} emit={emit} />
      </div>
    </div>
  );
}
