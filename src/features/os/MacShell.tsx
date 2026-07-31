"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { AppSurface } from "./apps/AppSurface";
import { AppIcon, SystemGlyph } from "./OsIcons";
import { appLabel, osMeta, type AppKey } from "./os-config";
import type { ShellProps } from "./os-state";

type WindowMode = "closed" | "minimized" | "normal" | "zoomed";

interface MacWindowState { mode: WindowMode; x: number; y: number; z: number; running: boolean }

const windowSize: Partial<Record<AppKey, { width: string; height: string }>> = {
  browser: { width: "min(80%, 880px)", height: "74%" },
  files: { width: "min(70%, 780px)", height: "64%" },
  notes: { width: "min(56%, 620px)", height: "58%" },
  settings: { width: "min(72%, 800px)", height: "72%" },
  mail: { width: "min(78%, 860px)", height: "68%" },
  photos: { width: "min(68%, 760px)", height: "64%" },
  calculator: { width: "300px", height: "58%" },
  store: { width: "min(60%, 680px)", height: "60%" },
  trash: { width: "min(54%, 600px)", height: "50%" },
};

const menuItems: Record<string, string[]> = {
  ファイル: ["新規ウインドウ", "開く…", "閉じる", "保存…", "プリント…"],
  編集: ["取り消す", "カット", "コピー", "ペースト", "すべてを選択"],
  表示: ["拡大", "縮小", "実際のサイズ", "ツールバーを隠す", "全画面表示にする"],
  移動: ["最近使った項目", "書類", "デスクトップ", "ダウンロード", "フォルダへ移動…"],
  ウインドウ: ["しまう", "拡大／縮小", "すべてを手前に移動"],
  ヘルプ: ["Mac のヘルプを検索"],
};

export function MacShell({ os, mode, world, update, emit, apps }: ShellProps) {
  const [windows, setWindows] = useState<Record<string, MacWindowState>>(() =>
    Object.fromEntries(apps.map((app, index) => [app, { mode: "closed" as WindowMode, x: 48 + index * 24, y: 44 + index * 18, z: index + 1, running: false }])),
  );
  const [activeApp, setActiveApp] = useState<AppKey | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const openedOnceRef = useRef<Partial<Record<AppKey, boolean>>>({});
  const switchCountRef = useRef(0);
  const zIndexRef = useRef(apps.length + 1);
  const dragRef = useRef<{ app: AppKey; moved: boolean; originX: number; originY: number; startX: number; startY: number } | null>(null);
  const animationRef = useRef<Partial<Record<string, ReturnType<typeof setTimeout>>>>({});
  const [animations, setAnimations] = useState<Partial<Record<string, string>>>({});

  useEffect(() => () => { Object.values(animationRef.current).forEach((timer) => timer && clearTimeout(timer)); }, []);

  const fallbackState = (): MacWindowState => ({ mode: "closed", x: 60, y: 44, z: 1, running: false });
  const windowState = (app: AppKey) => windows[app] ?? fallbackState();
  /** 直前の更新を上書きしないよう、必ず最新の state から差し替える */
  const updateWindow = (app: AppKey, patch: Partial<MacWindowState>) =>
    setWindows((current) => ({ ...current, [app]: { ...(current[app] ?? fallbackState()), ...patch } }));

  const animate = (app: AppKey, name: string, onFinish?: () => void) => {
    const timer = animationRef.current[app];
    if (timer) clearTimeout(timer);
    setAnimations((current) => ({ ...current, [app]: name }));
    animationRef.current[app] = setTimeout(() => {
      setAnimations((current) => { const next = { ...current }; delete next[app]; return next; });
      delete animationRef.current[app];
      onFinish?.();
    }, 240);
  };

  const bringToFront = (app: AppKey, countAsSwitch = false) => {
    zIndexRef.current += 1;
    updateWindow(app, { z: zIndexRef.current });
    if (countAsSwitch && activeApp && activeApp !== app) {
      switchCountRef.current += 1;
      emit("app-switched", `${appLabel(os, app)}へ切り替えました。`);
      if (switchCountRef.current >= 2) emit("app-switched-twice", "Dock で2回切り替えました。");
    }
    setActiveApp(app);
  };

  const openApp = (app: AppKey, source: "dock" | "menu" | "desktop" = "dock") => {
    const state = windowState(app);
    setOpenMenu(null);
    if (state.mode === "minimized") {
      zIndexRef.current += 1;
      updateWindow(app, { mode: "normal", z: zIndexRef.current });
      setActiveApp(app);
      animate(app, "unminimizing");
      emit("window-restored", `${appLabel(os, app)}を Dock から元の大きさに戻しました。`);
      emit("window-restored-after-button", `${appLabel(os, app)}を元の大きさに戻しました。`);
      return;
    }
    if (state.mode === "normal" || state.mode === "zoomed") { bringToFront(app, true); return; }

    const otherOpen = apps.some((item) => item !== app && windowState(item).mode !== "closed");
    zIndexRef.current += 1;
    setWindows((current) => ({ ...current, [app]: { ...windowState(app), mode: "normal", z: zIndexRef.current, running: true } }));
    if (otherOpen) emit("two-apps-open", "2つのアプリのウインドウが同時に開いています。");
    setActiveApp(app);
    animate(app, "opening");

    const sourceName = source === "dock" ? "Dock" : source === "desktop" ? "デスクトップ" : "メニュー";
    if (app === "browser") emit("browser-opened", `${sourceName}から Safari を開きました。`);
    if (app === "notes") {
      const reopened = openedOnceRef.current.notes;
      emit(reopened ? "app-reopened" : "notes-opened", reopened ? "テキストエディットのウインドウをもう一度開きました。" : `${sourceName}からテキストエディットを開きました。`);
    }
    if (app === "files") emit("files-opened", "Finder を開きました。");
    openedOnceRef.current[app] = true;
  };

  const minimize = (app: AppKey) => {
    if (windowState(app).mode === "closed") return;
    animate(app, "minimizing", () => updateWindow(app, { mode: "minimized" }));
    emit("window-minimized", `${appLabel(os, app)}のウインドウを Dock へしまいました。`);
    emit("window-minimized-from-button", `黄色いボタンで${appLabel(os, app)}をしまいました。`);
    setActiveApp(null);
  };

  const zoom = (app: AppKey) => {
    const zoomed = windowState(app).mode === "zoomed";
    updateWindow(app, { mode: zoomed ? "normal" : "zoomed" });
    bringToFront(app);
    emit(zoomed ? "window-restored-down" : "window-maximized", zoomed ? "ウインドウを元の大きさに戻しました。" : "緑のボタンでウインドウを画面いっぱいにしました。");
  };

  /** 赤ボタン：ウインドウは閉じるが、アプリ自体は終了しない（macOS の重要な違い） */
  const closeWindow = (app: AppKey) => {
    updateWindow(app, { mode: "closed" });
    setActiveApp(null);
    emit("window-closed", `${appLabel(os, app)}のウインドウを閉じました。Dock の下の点は、まだ動いている印です。`);
  };

  const quitApp = (app: AppKey) => {
    updateWindow(app, { mode: "closed", running: false });
    setActiveApp(null);
    setOpenMenu(null);
    emit("app-quit", `${appLabel(os, app)}を終了しました。Dock の下の点が消えます。`);
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
    updateWindow(state.app, { x: Math.max(6, Math.min(390, state.originX + deltaX)), y: Math.max(30, Math.min(220, state.originY + deltaY)) });
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    if (!state) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (state.moved) emit("window-moved", "タイトルバーをドラッグしてウインドウを移動しました。");
    dragRef.current = null;
  };

  const activeName = activeApp ? appLabel(os, activeApp) : "Finder";
  const menuNames = ["ファイル", "編集", "表示", "移動", "ウインドウ", "ヘルプ"];

  const chooseMenuItem = (menu: string, item: string) => {
    setOpenMenu(null);
    if (menu === "表示" && (item === "拡大" || item === "縮小")) {
      update((current) => ({ textScale: item === "拡大" ? Math.min(150, current.textScale + 10) : Math.max(75, current.textScale - 10) }));
      emit("display-opened", `「表示」メニューから文字の大きさを${item === "拡大" ? "大きく" : "小さく"}しました。`);
      return;
    }
    if (menu === "表示") { emit("display-opened", `「表示」メニューの「${item}」を選びました。`); return; }
    if (menu === "ファイル" && item === "閉じる" && activeApp) { closeWindow(activeApp); return; }
    if (menu === "ウインドウ" && item === "しまう" && activeApp) { minimize(activeApp); return; }
    if (menu === "移動" && item === "ダウンロード") { openApp("files", "menu"); update({ filesFolder: "downloads" }); }
  };

  return (
    <div className="os-mac" onPointerDown={() => { setOpenMenu(null); setControlCenterOpen(false); }}>
      <div className="os-mac__wallpaper" aria-hidden="true" />

      <div className="os-mac__menubar">
        <button className="os-mac__apple" type="button" aria-label="アップルメニュー" onPointerDown={(event) => event.stopPropagation()} onClick={() => setOpenMenu(openMenu === "apple" ? null : "apple")}>{SystemGlyph.appleLogo}</button>
        <button className="os-mac__appname" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setOpenMenu(openMenu === "app" ? null : "app"); emit("menu-opened", `メニューバーの「${activeName}」を開きました。`); }}>{activeName}</button>
        {menuNames.map((name) => (
          <button
            key={name}
            className={openMenu === name ? "is-open" : ""}
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => { const next = openMenu === name ? null : name; setOpenMenu(next); if (next) emit("menu-opened", `メニューバーの「${name}」を開きました。`); }}
          >{name}</button>
        ))}
        <div className="os-mac__status">
          <span aria-hidden="true">{SystemGlyph.battery}</span>
          <span aria-hidden="true">{world.wifiOn ? SystemGlyph.wifi : "✈"}</span>
          <button type="button" aria-label="検索">{SystemGlyph.search}</button>
          <button type="button" aria-label="コントロールセンター" onPointerDown={(event) => event.stopPropagation()} onClick={() => setControlCenterOpen(!controlCenterOpen)}>{SystemGlyph.controlCenter}</button>
          <time>{osMeta.mac.date} {osMeta.mac.clock}</time>
        </div>
        {openMenu ? (
          <div className={`os-mac__menu is-${openMenu === "apple" ? "apple" : openMenu === "app" ? "app" : menuNames.indexOf(openMenu)}`} role="menu" onPointerDown={(event) => event.stopPropagation()}>
            {(openMenu === "apple" ? ["この Mac について", "システム設定…", "最近使った項目", "スリープ", "再起動…"] : openMenu === "app" ? [`${activeName} について`, "設定…", "サービス", `${activeName}を終了`] : menuItems[openMenu] ?? []).map((item) => (
              <button
                key={item}
                role="menuitem"
                type="button"
                onClick={() => {
                  if (item === "システム設定…" || item === "設定…") { openApp("settings", "menu"); return; }
                  if (item.endsWith("を終了") && activeApp) { quitApp(activeApp); return; }
                  chooseMenuItem(openMenu, item);
                }}
              >{item}</button>
            ))}
          </div>
        ) : null}
      </div>

      {mode === "free" ? (
        <div className="os-mac__desktop-icons" aria-label="デスクトップの項目">
          <button type="button" aria-label="参加案内.pdf（ダブルクリックで開く）" onDoubleClick={() => openApp("files", "desktop")}><span className="os-filekind is-pdf" aria-hidden="true">PDF</span><small>参加案内.pdf</small></button>
        </div>
      ) : null}

      {apps.map((app) => {
        const state = windowState(app);
        if (state.mode === "closed" || state.mode === "minimized") return null;
        const size = windowSize[app] ?? { width: "min(70%, 780px)", height: "64%" };
        return (
          <section
            key={app}
            className={`os-mac-window is-${state.mode}${activeApp === app ? " is-active" : ""}${animations[app] ? ` is-${animations[app]}` : ""}`}
            style={state.mode === "normal" ? { left: state.x, top: state.y, zIndex: state.z, width: size.width, height: size.height } : { zIndex: state.z }}
            aria-label={`${appLabel(os, app)}のウインドウ`}
            onPointerDown={() => bringToFront(app)}
          >
            <header className="os-mac-window__titlebar" onPointerDown={(event) => beginDrag(app, event)} onPointerMove={drag} onPointerUp={endDrag}>
              <div className="os-mac-window__lights">
                <button className="is-close" type="button" aria-label={`${appLabel(os, app)}のウインドウを閉じる（赤いボタン）`} title="閉じる" onClick={() => closeWindow(app)} />
                <button className="is-min" type="button" aria-label={`${appLabel(os, app)}のウインドウを Dock へしまう（黄色いボタン）`} title="しまう" onClick={() => minimize(app)} />
                <button className="is-zoom" type="button" aria-label={`${appLabel(os, app)}のウインドウを大きくする（緑のボタン）`} title="拡大／縮小" onClick={() => zoom(app)} />
              </div>
              <strong>{app === "notes" ? `${world.noteTitle}.rtf` : appLabel(os, app)}</strong>
            </header>
            <div className="os-mac-window__body"><AppSurface app={app} os={os} world={world} update={update} emit={emit} /></div>
          </section>
        );
      })}

      {controlCenterOpen ? (
        <div className="os-mac__control-center" role="dialog" aria-label="コントロールセンター" onPointerDown={(event) => event.stopPropagation()}>
          <div className="os-mac__cc-row">
            <button type="button" aria-pressed={world.wifiOn} onClick={() => update({ wifiOn: !world.wifiOn })}><span aria-hidden="true">{SystemGlyph.wifi}</span>Wi-Fi</button>
            <button type="button" aria-pressed={world.bluetoothOn} onClick={() => update({ bluetoothOn: !world.bluetoothOn })}><span aria-hidden="true">🔵</span>Bluetooth</button>
          </div>
          <label className="os-mac__cc-slider">画面<input type="range" min={0} max={100} value={world.brightness} aria-label="画面の明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></label>
          <label className="os-mac__cc-slider">サウンド<input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></label>
        </div>
      ) : null}

      <div className="os-mac__dock">
        <div className="os-mac__dock-inner">
          {apps.filter((app) => app !== "trash").map((app) => (
            <button
              key={app}
              className={`${windowState(app).running ? "is-running" : ""}${activeApp === app ? " is-active" : ""}`}
              type="button"
              aria-label={`${appLabel(os, app)}を開く`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => openApp(app, "dock")}
            >
              <AppIcon os={os} app={app} size={40} />
              <span className="os-mac__dock-tip">{appLabel(os, app)}</span>
            </button>
          ))}
          <span className="os-mac__dock-divider" aria-hidden="true" />
          {apps.filter((app) => windowState(app).mode === "minimized").map((app) => (
            <button key={`min-${app}`} className="os-mac__dock-min" type="button" aria-label={`しまった${appLabel(os, app)}のウインドウを戻す`} onPointerDown={(event) => event.stopPropagation()} onClick={() => openApp(app, "dock")}>
              <AppIcon os={os} app={app} size={30} />
            </button>
          ))}
          <button className="os-mac__dock-trash" type="button" aria-label="ゴミ箱" onPointerDown={(event) => event.stopPropagation()} onClick={() => openApp("trash", "dock")}>
            <AppIcon os={os} app="trash" size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
