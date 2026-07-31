"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { AppSurface } from "./apps/AppSurface";
import { AppIcon, SystemGlyph } from "./OsIcons";
import { appLabel, osDockApps, osHomeApps, osMeta, type AppKey } from "./os-config";
import type { ShellProps } from "./os-state";

export function IosShell({ os, mode, world, update, emit, apps }: ShellProps) {
  const [screen, setScreen] = useState<AppKey | "home">("home");
  const [recents, setRecents] = useState<AppKey[]>([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [iconMenu, setIconMenu] = useState<AppKey | null>(null);
  const openedRef = useRef<Set<AppKey>>(new Set());
  const closedRef = useRef<Set<AppKey>>(new Set());
  const switchCountRef = useRef(0);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gestureRef = useRef<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef(0);

  const homeApps = (mode === "mission" ? apps : osHomeApps.iphone).filter((app) => apps.includes(app) && app !== "trash");
  const dockApps = osDockApps.iphone.filter((app) => apps.includes(app));

  const openApp = (app: AppKey, source: "home" | "dock" | "switcher" = "home") => {
    setSwitcherOpen(false);
    setIconMenu(null);
    const alreadyOpen = recents.includes(app);
    setRecents((current) => [app, ...current.filter((item) => item !== app)]);
    setScreen(app);

    if (!alreadyOpen) {
      const reopened = closedRef.current.has(app);
      if (app === "browser") emit("browser-opened", "Safari を開きました。");
      if (app === "notes") emit(reopened ? "app-reopened" : "notes-opened", reopened ? "終了したメモを、もう一度開きました。" : "メモを開きました。");
      if (reopened && app !== "notes") emit("app-reopened", `終了した${appLabel(os, app)}を、もう一度開きました。`);
      if (app === "camera") emit("camera-opened", "カメラを開きました。写る範囲を確認できます。");
      if (app === "phone") emit("phone-opened", "電話を開きました。発信前に相手を確認できます。");
      if (app === "files") emit("files-opened", "ファイルを開きました。");
      if (app === "settings") emit("settings-opened", "設定を開きました。");
      if (recents.length >= 1) emit("two-apps-open", "2つのアプリが、どちらも開いたままになりました。");
      openedRef.current.add(app);
      closedRef.current.delete(app);
      return;
    }
    switchCountRef.current += 1;
    emit("app-switched", `${appLabel(os, app)}へ切り替えました。（${source === "switcher" ? "App スイッチャー" : "ホーム画面"}から）`);
    if (switchCountRef.current >= 2) emit("app-switched-twice", "2回アプリを切り替えました。");
  };

  const goHome = () => {
    setScreen("home");
    setSwitcherOpen(false);
  };

  const closeFromSwitcher = (app: AppKey) => {
    setRecents((current) => current.filter((item) => item !== app));
    closedRef.current.add(app);
    if (screen === app) setScreen("home");
    emit("window-closed", `App スイッチャーで${appLabel(os, app)}を終了しました。`);
  };

  const switchToPrevious = () => {
    const previous = recents.find((app) => app !== screen);
    if (!previous) return;
    openApp(previous, "switcher");
  };

  const indicatorDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    gestureRef.current = { x: event.clientX, y: event.clientY };
  };
  const indicatorUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (deltaY < -70) { setSwitcherOpen(true); return; }
    if (deltaY < -24) { goHome(); return; }
    if (Math.abs(deltaX) > 40) { switchToPrevious(); return; }
    const now = event.timeStamp;
    if (now - lastTapRef.current < 400) { setSwitcherOpen(true); lastTapRef.current = 0; return; }
    lastTapRef.current = now;
    goHome();
  };

  const startLongPress = (app: AppKey) => {
    longPressRef.current = setTimeout(() => {
      setIconMenu(app);
      emit("context-opened", `${appLabel(os, app)}を長押しして、メニューを開きました。`);
    }, 550);
  };
  const cancelLongPress = () => { if (longPressRef.current) clearTimeout(longPressRef.current); longPressRef.current = null; };

  const statusDark = screen !== "home" && screen !== "photos" && screen !== "camera";

  return (
    <div className={`os-ios${world.darkMode ? " is-dark" : ""}`}>
      <div className="os-ios__device">
        <div className={`os-ios__statusbar${statusDark ? " is-dark" : ""}`}>
          <span className="os-ios__time">{osMeta.iphone.clock}</span>
          <span className="os-ios__island" aria-hidden="true" />
          <button className="os-ios__status-right" type="button" aria-label="コントロールセンターを開く（実機では画面右上から下へスワイプ）" onClick={() => setControlCenterOpen(true)}>
            <span aria-hidden="true">{SystemGlyph.cellular}</span>
            <span aria-hidden="true">{world.wifiOn ? SystemGlyph.wifi : "✈"}</span>
            <span aria-hidden="true">{SystemGlyph.battery}</span>
          </button>
        </div>

        <div className="os-ios__screen">
          {screen === "home" ? (
            <div className="os-ios__home">
              <div className="os-ios__grid">
                {homeApps.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => openApp(app)}
                    onPointerDown={() => startLongPress(app)}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    onContextMenu={(event) => { event.preventDefault(); setIconMenu(app); emit("context-opened", `${appLabel(os, app)}を長押しして、メニューを開きました。`); }}
                  >
                    <AppIcon os={os} app={app} size={46} />
                    <small>{appLabel(os, app)}</small>
                  </button>
                ))}
              </div>
              <div className="os-ios__dots" aria-hidden="true"><i className="is-on" /><i /></div>
              <button className="os-ios__searchpill" type="button" aria-label="検索">検索</button>
              <div className="os-ios__dock">
                {dockApps.map((app) => (
                  <button key={app} type="button" aria-label={`${appLabel(os, app)}を開く`} onClick={() => openApp(app, "dock")}>
                    <AppIcon os={os} app={app} size={48} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="os-ios__app" style={{ fontSize: `${Math.max(90, Math.min(120, world.textScale))}%` }}>
              <AppSurface app={screen} os={os} world={world} update={update} emit={emit} goHome={goHome} openApp={(next) => openApp(next)} />
            </div>
          )}

          {iconMenu ? (
            <div className="os-ios__iconmenu" role="dialog" aria-label={`${appLabel(os, iconMenu)}のメニュー`}>
              <button type="button" onClick={() => { const app = iconMenu; setIconMenu(null); if (app) openApp(app); }}>開く</button>
              <button type="button" onClick={() => setIconMenu(null)}>ホーム画面を編集</button>
              <button type="button" onClick={() => setIconMenu(null)}>App を共有</button>
              <button className="is-danger" type="button" onClick={() => setIconMenu(null)}>App を削除（練習では消えません）</button>
              <button className="os-ios__iconmenu-close" type="button" onClick={() => setIconMenu(null)}>閉じる</button>
            </div>
          ) : null}

          {switcherOpen ? (
            <div className="os-ios__switcher" role="dialog" aria-label="App スイッチャー">
              <p>上へスワイプして終了、押すと切り替え</p>
              <div className="os-ios__cards">
                {recents.length ? recents.map((app) => (
                  <div className="os-ios__card" key={app}>
                    <button type="button" onClick={() => openApp(app, "switcher")}><AppIcon os={os} app={app} size={34} /><span>{appLabel(os, app)}</span></button>
                    <button className="os-ios__card-close" type="button" aria-label={`${appLabel(os, app)}を終了する`} onClick={() => closeFromSwitcher(app)}>↑ 終了</button>
                  </div>
                )) : <p className="os-ios__empty">開いているアプリはありません。</p>}
              </div>
              <button className="os-ios__switcher-close" type="button" onClick={() => setSwitcherOpen(false)}>閉じる</button>
            </div>
          ) : null}

          {controlCenterOpen ? (
            <div className="os-ios__control-center" role="dialog" aria-label="コントロールセンター">
              <div className="os-ios__cc-grid">
                <button type="button" aria-pressed={world.airplaneMode} onClick={() => update({ airplaneMode: !world.airplaneMode })}>✈<small>機内</small></button>
                <button type="button" aria-pressed={world.wifiOn} onClick={() => update({ wifiOn: !world.wifiOn })}><span aria-hidden="true">{SystemGlyph.wifi}</span><small>Wi-Fi</small></button>
                <button type="button" aria-pressed={world.bluetoothOn} onClick={() => update({ bluetoothOn: !world.bluetoothOn })}>🔵<small>Bluetooth</small></button>
                <label>🔆<input type="range" min={0} max={100} value={world.brightness} aria-label="画面の明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></label>
                <label>🔊<input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></label>
              </div>
              <button className="os-ios__cc-close" type="button" onClick={() => setControlCenterOpen(false)}>閉じる</button>
            </div>
          ) : null}
        </div>

        <button
          className="os-ios__home-indicator"
          type="button"
          aria-label="ホームへ戻る（実機では画面の下端から上へスワイプ。横へスワイプすると前のアプリに切り替わります）"
          onPointerDown={indicatorDown}
          onPointerUp={indicatorUp}
        ><span /></button>
      </div>
    </div>
  );
}
