"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { AppSurface } from "./apps/AppSurface";
import { AppIcon, SystemGlyph } from "./OsIcons";
import { appLabel, osMeta, type AppKey } from "./os-config";
import type { ShellProps } from "./os-state";

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
  app: AppKey;
  moved: boolean;
  originX: number;
  originY: number;
  startX: number;
  startY: number;
}

const windowSize: Partial<Record<AppKey, { width: string; height: string }>> = {
  browser: { width: "min(78%, 900px)", height: "72%" },
  files: { width: "min(72%, 820px)", height: "66%" },
  notes: { width: "min(58%, 660px)", height: "58%" },
  settings: { width: "min(70%, 800px)", height: "70%" },
  mail: { width: "min(76%, 860px)", height: "68%" },
  photos: { width: "min(66%, 760px)", height: "64%" },
  calculator: { width: "320px", height: "62%" },
  store: { width: "min(60%, 700px)", height: "62%" },
  trash: { width: "min(54%, 620px)", height: "52%" },
};

const defaultPosition: Partial<Record<AppKey, { x: number; y: number }>> = {
  browser: { x: 54, y: 26 },
  notes: { x: 300, y: 120 },
  files: { x: 120, y: 70 },
  settings: { x: 180, y: 50 },
  mail: { x: 90, y: 40 },
  photos: { x: 210, y: 90 },
  calculator: { x: 420, y: 60 },
  store: { x: 160, y: 60 },
  trash: { x: 240, y: 110 },
};

export function WindowsShell({ os, mode, world, update, emit, apps }: ShellProps) {
  const desktopApps: AppKey[] = mode === "mission" ? ["browser", "notes", "trash", "files"] : ["browser", "notes", "files", "photos", "trash"];
  const [windows, setWindows] = useState<Record<string, AppWindowState>>(() =>
    Object.fromEntries(apps.map((app, index) => [app, { mode: "closed" as WindowMode, x: defaultPosition[app]?.x ?? 60 + index * 26, y: defaultPosition[app]?.y ?? 30 + index * 18, z: index + 1 }])),
  );
  const [activeApp, setActiveApp] = useState<AppKey | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<AppKey | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [lastVisibleModes, setLastVisibleModes] = useState<Record<string, VisibleWindowMode>>({});
  const [animations, setAnimations] = useState<Partial<Record<string, WindowAnimation>>>({});
  const openedOnceRef = useRef<Partial<Record<AppKey, boolean>>>({});
  const lastMinimizeSourceRef = useRef<Partial<Record<AppKey, "button" | "taskbar">>>({});
  const switchCountRef = useRef(0);
  const zIndexRef = useRef(apps.length + 1);
  const dragRef = useRef<DragState | null>(null);
  const timersRef = useRef<Partial<Record<string, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => () => { Object.values(timersRef.current).forEach((timer) => timer && clearTimeout(timer)); }, []);

  const fallbackState = (app: AppKey): AppWindowState => ({ mode: "closed", x: defaultPosition[app]?.x ?? 80, y: defaultPosition[app]?.y ?? 40, z: 1 });
  const windowState = (app: AppKey) => windows[app] ?? fallbackState(app);
  /** 直前の更新を上書きしないよう、必ず最新の state から差し替える */
  const updateWindow = (app: AppKey, patch: Partial<AppWindowState>) =>
    setWindows((current) => ({ ...current, [app]: { ...(current[app] ?? fallbackState(app)), ...patch } }));

  const animate = (app: AppKey, animation: WindowAnimation, onFinish?: () => void) => {
    const timer = timersRef.current[app];
    if (timer) clearTimeout(timer);
    setAnimations((current) => ({ ...current, [app]: animation }));
    timersRef.current[app] = setTimeout(() => {
      setAnimations((current) => { const next = { ...current }; delete next[app]; return next; });
      delete timersRef.current[app];
      onFinish?.();
    }, animation === "minimizing-taskbar" ? 230 : 210);
  };

  const bringToFront = (app: AppKey, countAsSwitch = false) => {
    zIndexRef.current += 1;
    updateWindow(app, { z: zIndexRef.current });
    if (countAsSwitch && activeApp && activeApp !== app) {
      switchCountRef.current += 1;
      emit("app-switched", `${appLabel(os, app)}へ切り替えました。`);
      if (switchCountRef.current >= 2) emit("app-switched-twice", "タスクバーで2回切り替えました。");
    }
    setActiveApp(app);
  };

  const activateNextWindow = (excluded: AppKey) => {
    const next = apps.find((app) => app !== excluded && (windowState(app).mode === "normal" || windowState(app).mode === "maximized"));
    if (next) { bringToFront(next); return; }
    setActiveApp(null);
  };

  const openApp = (app: AppKey, source: "desktop" | "taskbar" | "start" = "taskbar") => {
    if (animations[app]) return;
    setStartOpen(false);
    const state = windowState(app);
    if (state.mode === "minimized") {
      const restoreMode = lastVisibleModes[app] ?? "normal";
      zIndexRef.current += 1;
      updateWindow(app, { mode: restoreMode, z: zIndexRef.current });
      setActiveApp(app);
      animate(app, source === "taskbar" ? "restoring-taskbar" : "opening-desktop");
      emit(app === "notes" ? "window-restored" : "window-taskbar-restored", `${appLabel(os, app)}を最小化前の大きさで戻しました。`);
      const minimizeSource = lastMinimizeSourceRef.current[app];
      if (minimizeSource) emit(minimizeSource === "taskbar" ? "window-restored-after-taskbar" : "window-restored-after-button", `${appLabel(os, app)}を最小化前の大きさで戻しました。`);
      return;
    }
    if (state.mode === "normal" || state.mode === "maximized") { bringToFront(app); return; }

    const otherOpen = apps.some((item) => item !== app && windowState(item).mode !== "closed");
    zIndexRef.current += 1;
    setWindows((current) => ({ ...current, [app]: { ...windowState(app), mode: "normal", z: zIndexRef.current } }));
    setLastVisibleModes((current) => ({ ...current, [app]: "normal" }));
    if (otherOpen) emit("two-apps-open", "2つのアプリが同時に開いています。");
    setActiveApp(app);
    animate(app, source === "desktop" ? "opening-desktop" : "opening-taskbar");

    const sourceName = source === "desktop" ? "デスクトップ" : source === "start" ? "スタート メニュー" : "タスクバー";
    if (app === "browser") {
      emit("browser-opened", `${sourceName}から ${appLabel(os, "browser")} を開きました。`);
      if (source === "desktop") emit("browser-opened-from-desktop", `デスクトップのアイコンをダブルクリックして ${appLabel(os, "browser")} を開きました。`);
    }
    if (app === "notes") {
      const reopened = openedOnceRef.current.notes;
      emit(reopened ? "app-reopened" : "notes-opened", reopened ? "メモ帳をもう一度開きました。" : `${sourceName}からメモ帳を開きました。`);
      if (source === "desktop") emit("notes-opened-from-desktop", "デスクトップのメモ帳をダブルクリックして開きました。");
    }
    if (app === "files") emit("files-opened", "エクスプローラーを開きました。");
    if (app === "settings") emit("settings-opened", "設定を開きました。");
    openedOnceRef.current[app] = true;
  };

  const minimize = (app: AppKey, source: "button" | "taskbar" = "button") => {
    const state = windowState(app);
    if (animations[app] || (state.mode !== "normal" && state.mode !== "maximized")) return;
    setLastVisibleModes((current) => ({ ...current, [app]: state.mode as VisibleWindowMode }));
    lastMinimizeSourceRef.current[app] = source;
    animate(app, "minimizing-taskbar", () => { updateWindow(app, { mode: "minimized" }); activateNextWindow(app); });
    emit("window-minimized", `${appLabel(os, app)}を最小化しました。`);
    emit(source === "taskbar" ? "window-minimized-from-taskbar" : "window-minimized-from-button", source === "taskbar" ? `タスクバーの${appLabel(os, app)}を押して最小化しました。` : `右上の「―（最小化）」ボタンで${appLabel(os, app)}を最小化しました。`);
  };

  const toggleMaximize = (app: AppKey) => {
    if (animations[app]) return;
    const isMaximized = windowState(app).mode === "maximized";
    const nextMode: VisibleWindowMode = isMaximized ? "normal" : "maximized";
    updateWindow(app, { mode: nextMode });
    setLastVisibleModes((current) => ({ ...current, [app]: nextMode }));
    bringToFront(app);
    animate(app, isMaximized ? "restoring-down" : "maximizing");
    emit(isMaximized ? "window-restored-down" : "window-maximized", isMaximized ? "ウィンドウを元の大きさに戻しました。" : "ウィンドウを最大化しました。");
  };

  const closeWindow = (app: AppKey) => {
    const timer = timersRef.current[app];
    if (timer) clearTimeout(timer);
    delete timersRef.current[app];
    setAnimations((current) => { const next = { ...current }; delete next[app]; return next; });
    updateWindow(app, { mode: "closed" });
    activateNextWindow(app);
    emit("window-closed", `${appLabel(os, app)}を閉じました。`);
  };

  const taskbarActivate = (app: AppKey) => {
    if (animations[app]) return;
    const state = windowState(app);
    if (state.mode === "closed" || state.mode === "minimized") { openApp(app); return; }
    if (activeApp === app) { minimize(app, "taskbar"); return; }
    bringToFront(app, true);
  };

  const beginDrag = (app: AppKey, event: ReactPointerEvent<HTMLElement>) => {
    if (windowState(app).mode !== "normal" || (event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { app, moved: false, originX: windowState(app).x, originY: windowState(app).y, startX: event.clientX, startY: event.clientY };
    bringToFront(app);
  };
  const drag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    if (!state) return;
    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 6) state.moved = true;
    updateWindow(state.app, { x: Math.max(8, Math.min(400, state.originX + deltaX)), y: Math.max(4, Math.min(230, state.originY + deltaY)) });
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    if (!state) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (state.moved) emit("window-moved", "タイトル バーをドラッグしてウィンドウを移動しました。");
    dragRef.current = null;
  };

  const taskbarLabel = (app: AppKey) => {
    const state = windowState(app);
    if (state.mode === "closed") return `${appLabel(os, app)}を開く（1回左クリック）`;
    if (state.mode === "minimized") return `${appLabel(os, app)}を最小化前の大きさで表示（1回左クリック）`;
    if (activeApp === app) return `${appLabel(os, app)}を最小化（1回左クリック）`;
    return `${appLabel(os, app)}へ切り替える（1回左クリック）`;
  };

  const desktopIconLabel = (app: AppKey) => (app === "files" ? "エクスプローラー" : appLabel(os, app));

  return (
    <div className="os-win" onPointerDown={() => { setStartOpen(false); setTrayOpen(false); }}>
      <div className="os-win__wallpaper" aria-hidden="true" />

      <div className="os-win__icons" aria-label="デスクトップのアイコン">
        {desktopApps.map((app) => (
          <button
            key={app}
            type="button"
            aria-label={`${desktopIconLabel(app)}（ダブルクリックで開く）`}
            aria-pressed={selectedIcon === app}
            onClick={() => setSelectedIcon(app)}
            onDoubleClick={() => { setSelectedIcon(app); openApp(app, "desktop"); }}
            onKeyDown={(event) => { if (event.key === "Enter") openApp(app, "desktop"); }}
          >
            <AppIcon os={os} app={app} size={38} />
            <small>{desktopIconLabel(app)}</small>
          </button>
        ))}
      </div>

      {apps.map((app) => {
        const state = windowState(app);
        if (state.mode === "closed" || state.mode === "minimized") return null;
        const size = windowSize[app] ?? { width: "min(70%, 800px)", height: "66%" };
        return (
          <section
            key={app}
            className={`os-win-window is-${state.mode}${activeApp === app ? " is-active" : ""}${animations[app] ? ` is-${animations[app]}` : ""}`}
            style={state.mode === "normal" ? { left: state.x, top: state.y, zIndex: state.z, width: size.width, height: size.height } : { zIndex: state.z }}
            aria-label={`${appLabel(os, app)}のウィンドウ`}
            onPointerDown={() => bringToFront(app)}
          >
            <header className="os-win-window__titlebar" onPointerDown={(event) => beginDrag(app, event)} onPointerMove={drag} onPointerUp={endDrag}>
              <AppIcon os={os} app={app} size={16} />
              <strong>{app === "notes" ? `${world.noteTitle}.txt - メモ帳` : appLabel(os, app)}</strong>
              <div className="os-win-window__controls">
                <button type="button" aria-label={`${appLabel(os, app)}の「―（最小化）」ボタン`} title="―（最小化）" onClick={() => minimize(app, "button")}>―</button>
                <button type="button" aria-label={state.mode === "maximized" ? `${appLabel(os, app)}の「❐（元のサイズに戻す）」ボタン` : `${appLabel(os, app)}の「□（最大化）」ボタン`} title={state.mode === "maximized" ? "❐（元のサイズに戻す）" : "□（最大化）"} onClick={() => toggleMaximize(app)}>{state.mode === "maximized" ? "❐" : "□"}</button>
                <button className="is-close" type="button" aria-label={`${appLabel(os, app)}の「×（閉じる）」ボタン`} title="×（閉じる）" onClick={() => closeWindow(app)}>✕</button>
              </div>
            </header>
            <div className="os-win-window__body"><AppSurface app={app} os={os} world={world} update={update} emit={emit} /></div>
          </section>
        );
      })}

      {startOpen ? (
        <div className="os-win-start" role="dialog" aria-label="スタート メニュー" onPointerDown={(event) => event.stopPropagation()}>
          <div className="os-win-start__search"><span aria-hidden="true">{SystemGlyph.search}</span>アプリ、設定、ドキュメントの検索</div>
          <p className="os-win-start__label">ピン留め済み</p>
          <div className="os-win-start__grid">
            {apps.filter((app) => app !== "trash").map((app) => (
              <button key={app} type="button" onClick={() => openApp(app, "start")}>
                <AppIcon os={os} app={app} size={32} />
                <small>{appLabel(os, app)}</small>
              </button>
            ))}
          </div>
          <p className="os-win-start__label">おすすめ</p>
          <div className="os-win-start__recommended">
            <button type="button" onClick={() => openApp("notes", "start")}><AppIcon os={os} app="notes" size={22} /><span><strong>{world.noteTitle}.txt</strong><small>最近追加</small></span></button>
            <button type="button" onClick={() => openApp("files", "start")}><AppIcon os={os} app="files" size={22} /><span><strong>参加案内.pdf</strong><small>ダウンロード</small></span></button>
          </div>
          <div className="os-win-start__footer"><span><span className="os-win-start__avatar" aria-hidden="true">練</span>練習 ユーザー</span><button type="button" aria-label="電源">⏻</button></div>
        </div>
      ) : null}

      {trayOpen ? (
        <div className="os-win-tray-panel" role="dialog" aria-label="クイック設定" onPointerDown={(event) => event.stopPropagation()}>
          <div className="os-win-tray-panel__tiles">
            <button type="button" aria-pressed={world.wifiOn} onClick={() => update({ wifiOn: !world.wifiOn })}><span aria-hidden="true">{SystemGlyph.wifi}</span>Wi-Fi</button>
            <button type="button" aria-pressed={world.bluetoothOn} onClick={() => update({ bluetoothOn: !world.bluetoothOn })}><span aria-hidden="true">🔵</span>Bluetooth</button>
            <button type="button" aria-pressed={world.airplaneMode} onClick={() => update({ airplaneMode: !world.airplaneMode })}><span aria-hidden="true">✈</span>機内モード</button>
            <button type="button" aria-pressed={world.darkMode} onClick={() => update({ darkMode: !world.darkMode })}><span aria-hidden="true">🌙</span>夜間モード</button>
          </div>
          <label className="os-win-tray-panel__slider">🔆<input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></label>
          <label className="os-win-tray-panel__slider">🔊<input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></label>
        </div>
      ) : null}

      <div className="os-win__taskbar">
        <button className="os-win__start-button" type="button" aria-label="スタート" aria-expanded={startOpen} onPointerDown={(event) => event.stopPropagation()} onClick={() => { setStartOpen(!startOpen); setTrayOpen(false); }}>{SystemGlyph.windowsLogo}</button>
        <button className="os-win__search-pill" type="button" aria-label="検索"><span aria-hidden="true">{SystemGlyph.search}</span><span>検索</span></button>
        <button type="button" aria-label="タスク ビュー">{SystemGlyph.taskView}</button>
        {apps.filter((app) => app !== "trash").map((app) => (
          <button
            key={app}
            className={windowState(app).mode !== "closed" ? "is-open" : ""}
            type="button"
            aria-label={taskbarLabel(app)}
            aria-pressed={activeApp === app && windowState(app).mode !== "minimized"}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => taskbarActivate(app)}
          >
            <AppIcon os={os} app={app} size={24} />
          </button>
        ))}
        <div className="os-win__tray">
          <button type="button" aria-label="非表示のアイコンを表示">{SystemGlyph.chevronUp}</button>
          <button className="os-win__tray-status" type="button" aria-label="ネットワーク、音量、バッテリーのクイック設定" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setTrayOpen(!trayOpen); setStartOpen(false); }}>
            <span aria-hidden="true">{world.wifiOn ? SystemGlyph.wifi : "✈"}</span>
            <span aria-hidden="true">{SystemGlyph.volume}</span>
            <span aria-hidden="true">{SystemGlyph.battery}</span>
          </button>
          <time>{osMeta.windows.clock}<br />{osMeta.windows.date}</time>
          <button type="button" aria-label="通知">🔔</button>
        </div>
      </div>
    </div>
  );
}
