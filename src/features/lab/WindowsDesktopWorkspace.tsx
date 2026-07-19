"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import type { WorkspaceProps } from "@/features/lab/LabWorkspaces";

type AppId = "edge" | "notepad";
type WindowMode = "closed" | "minimized" | "normal" | "maximized";
type VisibleWindowMode = Exclude<WindowMode, "closed" | "minimized">;
type WindowAnimation = "opening-desktop" | "opening-taskbar" | "restoring-taskbar" | "minimizing-taskbar" | "maximizing" | "restoring-down";

interface AppWindowState {
  mode: WindowMode;
  x: number;
  y: number;
  z: number;
}

interface DragState {
  app: AppId;
  moved: boolean;
  originX: number;
  originY: number;
  startX: number;
  startY: number;
}

const appNames: Record<AppId, string> = {
  edge: "インターネットブラウザ",
  notepad: "メモ帳",
};

export function WindowsDesktopWorkspace({ emit }: WorkspaceProps) {
  const [windows, setWindows] = useState<Record<AppId, AppWindowState>>({
    edge: { mode: "closed", x: 52, y: 28, z: 2 },
    notepad: { mode: "closed", x: 260, y: 105, z: 1 },
  });
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [browserPage, setBrowserPage] = useState<"results" | "facility">("results");
  const [note, setNote] = useState("中央公民館へ確認する");
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<AppId | null>(null);
  const [lastVisibleModes, setLastVisibleModes] = useState<Record<AppId, VisibleWindowMode>>({ edge: "normal", notepad: "normal" });
  const [windowAnimations, setWindowAnimations] = useState<Partial<Record<AppId, WindowAnimation>>>({});
  const notesOpenedRef = useRef(false);
  const switchCountRef = useRef(0);
  const zIndexRef = useRef(3);
  const dragRef = useRef<DragState | null>(null);
  const animationTimersRef = useRef<Partial<Record<AppId, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => () => {
    Object.values(animationTimersRef.current).forEach((timer) => clearTimeout(timer));
  }, []);

  const updateWindow = (app: AppId, update: Partial<AppWindowState>) => {
    setWindows((current) => ({ ...current, [app]: { ...current[app], ...update } }));
  };

  const bringToFront = (app: AppId, countAsSwitch = false) => {
    zIndexRef.current += 1;
    updateWindow(app, { z: zIndexRef.current });
    if (countAsSwitch && activeApp && activeApp !== app) {
      switchCountRef.current += 1;
      emit("app-switched", `${appNames[app]}へ切り替えました。`);
      if (switchCountRef.current >= 2) emit("app-switched-twice", "タスクバーで2回切り替えました。");
    }
    setActiveApp(app);
  };

  const animateWindow = (app: AppId, animation: WindowAnimation, onFinish?: () => void) => {
    const currentTimer = animationTimersRef.current[app];
    if (currentTimer) clearTimeout(currentTimer);
    setWindowAnimations((current) => ({ ...current, [app]: animation }));
    animationTimersRef.current[app] = setTimeout(() => {
      setWindowAnimations((current) => {
        const next = { ...current };
        delete next[app];
        return next;
      });
      delete animationTimersRef.current[app];
      onFinish?.();
    }, animation === "minimizing-taskbar" ? 230 : 210);
  };

  const activateNextVisibleWindow = (excludedApp: AppId) => {
    const otherApp: AppId = excludedApp === "edge" ? "notepad" : "edge";
    if (windows[otherApp].mode === "normal" || windows[otherApp].mode === "maximized") {
      bringToFront(otherApp);
      return;
    }
    setActiveApp(null);
  };

  const openApp = (app: AppId, source: "desktop" | "taskbar" = "taskbar") => {
    if (windowAnimations[app]) return;
    if (windows[app].mode === "minimized") {
      const restoreMode = lastVisibleModes[app];
      zIndexRef.current += 1;
      updateWindow(app, { mode: restoreMode, z: zIndexRef.current });
      setActiveApp(app);
      animateWindow(app, source === "taskbar" ? "restoring-taskbar" : "opening-desktop");
      emit(app === "notepad" ? "window-restored" : "window-taskbar-restored", `${appNames[app]}を最小化前の大きさで戻しました。`);
      return;
    }
    if (windows[app].mode === "normal" || windows[app].mode === "maximized") {
      bringToFront(app);
      return;
    }
    const wasClosed = windows[app].mode === "closed";
    const otherApp: AppId = app === "edge" ? "notepad" : "edge";
    const willHaveTwoAppsOpen = windows[otherApp].mode !== "closed";
    zIndexRef.current += 1;
    setWindows((current) => ({ ...current, [app]: { ...current[app], mode: "normal", z: zIndexRef.current } }));
    setLastVisibleModes((current) => ({ ...current, [app]: "normal" }));
    if (willHaveTwoAppsOpen) emit("two-apps-open", "インターネットブラウザとメモ帳が両方開いています。");
    setActiveApp(app);
    animateWindow(app, source === "desktop" ? "opening-desktop" : "opening-taskbar");

    if (app === "edge") {
      emit("browser-opened", `${source === "desktop" ? "デスクトップ" : "タスクバー"}からインターネットブラウザを開きました。`);
      if (source === "desktop") emit("browser-opened-from-desktop", "デスクトップのアイコンをダブルクリックして、インターネットブラウザを開きました。");
    }
    if (app === "notepad" && wasClosed) {
      emit(notesOpenedRef.current ? "app-reopened" : "notes-opened", notesOpenedRef.current ? "メモ帳をもう一度開きました。" : `${source === "desktop" ? "デスクトップ" : "タスクバー"}からメモ帳を開きました。`);
      notesOpenedRef.current = true;
    }
  };

  const openDesktopShortcut = (app: AppId) => {
    setSelectedDesktopIcon(app);
    openApp(app, "desktop");
  };

  const taskbarActivate = (app: AppId) => {
    if (windowAnimations[app]) return;
    const state = windows[app];
    if (state.mode === "closed") {
      openApp(app);
      return;
    }
    if (state.mode === "minimized") {
      openApp(app);
      return;
    }
    if (activeApp === app) {
      minimize(app, "taskbar");
      return;
    }
    bringToFront(app, true);
  };

  const minimize = (app: AppId, source: "button" | "taskbar" = "button") => {
    if (windowAnimations[app] || (windows[app].mode !== "normal" && windows[app].mode !== "maximized")) return;
    setLastVisibleModes((current) => ({ ...current, [app]: windows[app].mode as VisibleWindowMode }));
    animateWindow(app, "minimizing-taskbar", () => {
      updateWindow(app, { mode: "minimized" });
      activateNextVisibleWindow(app);
    });
    emit("window-minimized", `${appNames[app]}を最小化しました。`);
    emit(source === "taskbar" ? "window-minimized-from-taskbar" : "window-minimized-from-button", source === "taskbar" ? `タスクバーの${appNames[app]}を押して最小化しました。` : `右上の「―（最小化）」ボタンで${appNames[app]}を最小化しました。`);
  };

  const toggleMaximize = (app: AppId) => {
    if (windowAnimations[app]) return;
    const isMaximized = windows[app].mode === "maximized";
    const nextMode: VisibleWindowMode = isMaximized ? "normal" : "maximized";
    updateWindow(app, { mode: nextMode });
    setLastVisibleModes((current) => ({ ...current, [app]: nextMode }));
    bringToFront(app);
    animateWindow(app, isMaximized ? "restoring-down" : "maximizing");
    emit(isMaximized ? "window-restored-down" : "window-maximized", isMaximized ? "ウィンドウを元の大きさに戻しました。" : "ウィンドウを最大化しました。");
  };

  const closeWindow = (app: AppId) => {
    const currentTimer = animationTimersRef.current[app];
    if (currentTimer) clearTimeout(currentTimer);
    delete animationTimersRef.current[app];
    setWindowAnimations((current) => {
      const next = { ...current };
      delete next[app];
      return next;
    });
    updateWindow(app, { mode: "closed" });
    activateNextVisibleWindow(app);
    emit("window-closed", `${appNames[app]}を閉じました。`);
  };

  const beginDrag = (app: AppId, event: ReactPointerEvent<HTMLElement>) => {
    if (windows[app].mode !== "normal" || (event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      app,
      moved: false,
      originX: windows[app].x,
      originY: windows[app].y,
      startX: event.clientX,
      startY: event.clientY,
    };
    bringToFront(app);
  };

  const dragWindow = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 6) drag.moved = true;
    updateWindow(drag.app, {
      x: Math.max(8, Math.min(360, drag.originX + deltaX)),
      y: Math.max(8, Math.min(210, drag.originY + deltaY)),
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) emit("window-moved", "タイトルバーをドラッグしてウィンドウを移動しました。");
    dragRef.current = null;
  };

  const renderControls = (app: AppId) => (
    <div className="win11-window-controls">
      <button type="button" aria-label={`${appNames[app]}の「―（最小化）」ボタン`} title="―（最小化）" onClick={() => minimize(app, "button")}>―</button>
      <button type="button" aria-label={windows[app].mode === "maximized" ? `${appNames[app]}の「❐（元のサイズに戻す）」ボタン` : `${appNames[app]}の「□（最大化）」ボタン`} title={windows[app].mode === "maximized" ? "❐（元のサイズに戻す）" : "□（最大化）"} onClick={() => toggleMaximize(app)}>{windows[app].mode === "maximized" ? "❐" : "□"}</button>
      <button className="is-close" type="button" aria-label={`${appNames[app]}の「×（閉じる）」ボタン`} title="×（閉じる）" onClick={() => closeWindow(app)}>×</button>
    </div>
  );

  const taskbarButtonLabel = (app: AppId) => {
    if (windows[app].mode === "closed") return `${appNames[app]}を開く（1回左クリック）`;
    if (windows[app].mode === "minimized") return `${appNames[app]}を最小化前の大きさで表示（1回左クリック）`;
    if (activeApp === app) return `${appNames[app]}を最小化（1回左クリック）`;
    return `${appNames[app]}へ切り替える（1回左クリック）`;
  };

  return (
    <div className="win11-desktop" aria-label="Windows 11 デスクトップ">
      <div className="win11-wallpaper" aria-hidden="true" />
      <div className="win11-desktop-icons" aria-label="デスクトップのアイコン">
        <button type="button" aria-label="インターネットブラウザ（ダブルクリックで開く）" aria-pressed={selectedDesktopIcon === "edge"} onClick={() => setSelectedDesktopIcon("edge")} onDoubleClick={() => openDesktopShortcut("edge")} onKeyDown={(event) => { if (event.key === "Enter") openDesktopShortcut("edge"); }}><span className="browser-globe-icon" aria-hidden="true">🌐</span>インターネット<br />ブラウザ</button>
        <button type="button" aria-label="メモ帳（ダブルクリックで開く）" aria-pressed={selectedDesktopIcon === "notepad"} onClick={() => setSelectedDesktopIcon("notepad")} onDoubleClick={() => openDesktopShortcut("notepad")} onKeyDown={(event) => { if (event.key === "Enter") openDesktopShortcut("notepad"); }}><span className="notepad-app-icon" aria-hidden="true">▤</span>メモ帳</button>
        <button type="button" aria-label="ごみ箱"><span>🗑️</span>ごみ箱</button>
        <button type="button" aria-label="資料フォルダー"><span>📁</span>資料</button>
      </div>

      {windows.edge.mode !== "closed" && windows.edge.mode !== "minimized" ? (
        <section
          className={`win11-window win11-window--edge is-${windows.edge.mode}${activeApp === "edge" ? " is-active" : ""}${windowAnimations.edge ? ` is-${windowAnimations.edge}` : ""}`}
          style={windows.edge.mode === "normal" ? { left: windows.edge.x, top: windows.edge.y, zIndex: windows.edge.z } : { zIndex: windows.edge.z }}
          aria-label="インターネットブラウザ"
          onPointerDown={() => bringToFront("edge")}
        >
          <header className="win11-titlebar" onPointerDown={(event) => beginDrag("edge", event)} onPointerMove={dragWindow} onPointerUp={endDrag}>
            <span className="browser-globe-icon" aria-hidden="true">🌐</span><strong>インターネットブラウザ</strong>{renderControls("edge")}
          </header>
          <div className="edge-tabs"><span className="is-current">{browserPage === "results" ? "検索結果" : "中央公民館｜施設案内"}</span><button type="button" aria-label="新しいタブ">＋</button></div>
          <div className="edge-toolbar" aria-label="ブラウザの操作バー">
            <button type="button" aria-label="←（戻る）ボタン" title="←（戻る）" disabled={browserPage === "results"} onClick={() => { setBrowserPage("results"); emit("went-back", "インターネットブラウザの「←（戻る）」ボタンで検索結果へ戻りました。"); }}>←</button>
            <button type="button" aria-label="再読み込み">↻</button>
            <div><span aria-hidden="true">🔒</span>{browserPage === "results" ? "https://www.google.co.jp/search?q=中央公民館" : "https://www.city.midori.example/community-center"}</div>
            <button type="button" aria-label="インターネットブラウザの設定など">…</button>
          </div>
          <div className="edge-page">
            {browserPage === "results" ? <div className="edge-results"><p>検索結果</p><button type="button" onClick={() => { setBrowserPage("facility"); emit("page-opened", "検索結果から中央公民館の施設案内を開きました。"); }}><small>www.city.midori.example › community-center</small><strong>中央公民館｜施設案内</strong><span>開館時間・所在地・利用案内</span></button></div> : <article><p>みどり市公式ホームページ</p><h3>中央公民館 施設案内</h3><p>開館時間：午前9時～午後8時</p><p>休館日：毎週月曜日</p></article>}
          </div>
        </section>
      ) : null}

      {windows.notepad.mode !== "closed" && windows.notepad.mode !== "minimized" ? (
        <section
          className={`win11-window win11-window--notepad is-${windows.notepad.mode}${activeApp === "notepad" ? " is-active" : ""}${windowAnimations.notepad ? ` is-${windowAnimations.notepad}` : ""}`}
          style={windows.notepad.mode === "normal" ? { left: windows.notepad.x, top: windows.notepad.y, zIndex: windows.notepad.z } : { zIndex: windows.notepad.z }}
          aria-label="メモ帳"
          onPointerDown={() => bringToFront("notepad")}
        >
          <header className="win11-titlebar" onPointerDown={(event) => beginDrag("notepad", event)} onPointerMove={dragWindow} onPointerUp={endDrag}>
            <span className="notepad-app-icon" aria-hidden="true">▤</span><strong>メモ.txt - メモ帳</strong>{renderControls("notepad")}
          </header>
          <nav className="notepad-menu" aria-label="メモ帳のメニュー"><span>ファイル</span><span>編集</span><span>表示</span></nav>
          <textarea aria-label="練習メモ" value={note} onChange={(event) => setNote(event.target.value)} />
          <footer>行 1、列 {note.length + 1}　100%　Windows (CRLF)　UTF-8</footer>
        </section>
      ) : null}

      <div className="win11-taskbar">
        <button type="button" aria-label="スタート"><span aria-hidden="true">⊞</span></button>
        <button type="button" aria-label="検索"><span aria-hidden="true">⌕</span></button>
        <button className={windows.edge.mode !== "closed" ? "is-open" : ""} aria-label={taskbarButtonLabel("edge")} aria-pressed={activeApp === "edge"} type="button" onClick={() => taskbarActivate("edge")}><span className="browser-globe-icon" aria-hidden="true">🌐</span></button>
        <button className={windows.notepad.mode !== "closed" ? "is-open" : ""} aria-label={taskbarButtonLabel("notepad")} aria-pressed={activeApp === "notepad"} type="button" onClick={() => taskbarActivate("notepad")}><span className="notepad-app-icon" aria-hidden="true">▤</span></button>
        <div className="win11-tray"><span>⌃　Wi-Fi　▰</span><time>11:24<br />2026/07/19</time></div>
      </div>
    </div>
  );
}
