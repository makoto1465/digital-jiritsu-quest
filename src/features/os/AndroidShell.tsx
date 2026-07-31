"use client";

import { useRef, useState } from "react";

import { AppSurface } from "./apps/AppSurface";
import { AppIcon, SystemGlyph } from "./OsIcons";
import { appLabel, osDockApps, osHomeApps, osMeta, type AppKey } from "./os-config";
import type { ShellProps } from "./os-state";

export function AndroidShell({ os, mode, world, update, emit, apps }: ShellProps) {
  const [screen, setScreen] = useState<AppKey | "home">("home");
  const [recents, setRecents] = useState<AppKey[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [shadeOpen, setShadeOpen] = useState(false);
  const [iconMenu, setIconMenu] = useState<AppKey | null>(null);
  const openedRef = useRef<Set<AppKey>>(new Set());
  const closedRef = useRef<Set<AppKey>>(new Set());
  const switchCountRef = useRef(0);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const homeApps = (mode === "mission" ? apps : osHomeApps.android).filter((app) => apps.includes(app) && app !== "trash");
  const dockApps = osDockApps.android.filter((app) => apps.includes(app));
  const drawerApps = apps.filter((app) => app !== "trash");

  const openApp = (app: AppKey, source: "home" | "drawer" | "recents" = "home") => {
    setDrawerOpen(false);
    setRecentsOpen(false);
    setShadeOpen(false);
    setIconMenu(null);
    const alreadyOpen = recents.includes(app);
    setRecents((current) => [app, ...current.filter((item) => item !== app)]);
    setScreen(app);
    if (!alreadyOpen) {
      const reopened = closedRef.current.has(app);
      if (app === "browser") emit("browser-opened", "Chrome を開きました。");
      if (app === "notes") emit(reopened ? "app-reopened" : "notes-opened", reopened ? "終了した Keep メモを、もう一度開きました。" : "Keep メモを開きました。");
      if (reopened && app !== "notes") emit("app-reopened", `終了した${appLabel(os, app)}を、もう一度開きました。`);
      if (app === "camera") emit("camera-opened", "カメラを開きました。写る範囲を確認できます。");
      if (app === "phone") emit("phone-opened", "電話を開きました。発信前に相手を確認できます。");
      if (app === "files") emit("files-opened", "Files を開きました。");
      if (app === "settings") emit("settings-opened", "設定を開きました。");
      if (recents.length >= 1) emit("two-apps-open", "2つのアプリが、どちらも開いたままになりました。");
      openedRef.current.add(app);
      closedRef.current.delete(app);
      return;
    }
    switchCountRef.current += 1;
    emit("app-switched", `${appLabel(os, app)}へ切り替えました。（${source === "recents" ? "最近使ったアプリ" : source === "drawer" ? "アプリ一覧" : "ホーム画面"}から）`);
    if (switchCountRef.current >= 2) emit("app-switched-twice", "2回アプリを切り替えました。");
  };

  const goHome = () => { setScreen("home"); setRecentsOpen(false); setDrawerOpen(false); setShadeOpen(false); };

  const goBack = () => {
    if (shadeOpen) { setShadeOpen(false); return; }
    if (drawerOpen) { setDrawerOpen(false); return; }
    if (recentsOpen) { setRecentsOpen(false); return; }
    if (iconMenu) { setIconMenu(null); return; }
    if (screen === "browser" && world.browserPage !== "start") {
      update({ browserPage: world.browserPage === "facility" ? "results" : "start" });
      emit("went-back", "「◁（戻る）」で、ひとつ前の画面へ戻りました。");
      return;
    }
    if (screen !== "home") { emit("went-back", "「◁（戻る）」でホーム画面へ戻りました。"); setScreen("home"); }
  };

  const closeFromRecents = (app: AppKey) => {
    setRecents((current) => current.filter((item) => item !== app));
    closedRef.current.add(app);
    if (screen === app) setScreen("home");
    emit("window-closed", `最近使ったアプリで${appLabel(os, app)}を終了しました。`);
  };

  const startLongPress = (app: AppKey) => {
    longPressRef.current = setTimeout(() => {
      setIconMenu(app);
      emit("context-opened", `${appLabel(os, app)}を長押しして、メニューを開きました。`);
    }, 550);
  };
  const cancelLongPress = () => { if (longPressRef.current) clearTimeout(longPressRef.current); longPressRef.current = null; };

  const iconButton = (app: AppKey, size: number) => (
    <button
      key={app}
      type="button"
      aria-label={`${appLabel(os, app)}を開く`}
      onClick={() => openApp(app, drawerOpen ? "drawer" : "home")}
      onPointerDown={() => startLongPress(app)}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onContextMenu={(event) => { event.preventDefault(); setIconMenu(app); emit("context-opened", `${appLabel(os, app)}を長押しして、メニューを開きました。`); }}
    >
      <AppIcon os={os} app={app} size={size} />
      <small>{appLabel(os, app)}</small>
    </button>
  );

  return (
    <div className={`os-android${world.darkMode ? " is-dark" : ""}`}>
      <div className="os-android__device">
        <div className={`os-android__statusbar${screen === "home" ? "" : " is-inapp"}`}>
          <span>{osMeta.android.clock}</span>
          <button type="button" aria-label="通知とクイック設定を開く（実機では画面の上端から下へスワイプ）" onClick={() => setShadeOpen(true)}>
            <span aria-hidden="true">{SystemGlyph.cellular}</span>
            <span aria-hidden="true">{world.wifiOn ? SystemGlyph.wifi : "✈"}</span>
            <span aria-hidden="true">{SystemGlyph.battery}</span>
            <small>78%</small>
          </button>
        </div>

        <div className="os-android__screen">
          {screen === "home" ? (
            <div className="os-android__home">
              <div className="os-android__widget">
                <span aria-hidden="true">{SystemGlyph.googleG}</span>
                <span>検索</span>
                <span aria-hidden="true">{SystemGlyph.mic}</span>
                <span aria-hidden="true">📷</span>
              </div>
              <div className="os-android__grid">{homeApps.map((app) => iconButton(app, 42))}</div>
              <button className="os-android__drawer-handle" type="button" aria-label="アプリ一覧を開く（実機では画面の下から上へスワイプ）" onClick={() => setDrawerOpen(true)}><span /></button>
              <div className="os-android__hotseat">{dockApps.map((app) => iconButton(app, 46))}</div>
            </div>
          ) : (
            <div className="os-android__app" style={{ fontSize: `${Math.max(90, Math.min(120, world.textScale))}%` }}>
              <AppSurface app={screen} os={os} world={world} update={update} emit={emit} goHome={goHome} openApp={(next) => openApp(next)} />
            </div>
          )}

          {drawerOpen ? (
            <div className="os-android__drawer" role="dialog" aria-label="アプリ一覧">
              <div className="os-android__drawer-search"><span aria-hidden="true">{SystemGlyph.search}</span>アプリを検索</div>
              <div className="os-android__grid is-drawer">{drawerApps.map((app) => iconButton(app, 46))}</div>
              <button className="os-android__drawer-close" type="button" onClick={() => setDrawerOpen(false)}>閉じる</button>
            </div>
          ) : null}

          {shadeOpen ? (
            <div className="os-android__shade" role="dialog" aria-label="通知とクイック設定">
              <div className="os-android__tiles">
                <button type="button" aria-pressed={world.wifiOn} onClick={() => update({ wifiOn: !world.wifiOn })}><span aria-hidden="true">{SystemGlyph.wifi}</span>Wi-Fi</button>
                <button type="button" aria-pressed={world.bluetoothOn} onClick={() => update({ bluetoothOn: !world.bluetoothOn })}>🔵 Bluetooth</button>
                <button type="button" aria-pressed={world.airplaneMode} onClick={() => update({ airplaneMode: !world.airplaneMode })}>✈ 機内モード</button>
                <button type="button" aria-pressed={world.darkMode} onClick={() => update({ darkMode: !world.darkMode })}>🌙 ダークモード</button>
              </div>
              <label className="os-android__shade-slider">🔆<input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></label>
              <div className="os-android__notification"><strong>中央公民館</strong><span>夏祭りのご案内が届いています</span></div>
              <button className="os-android__shade-close" type="button" onClick={() => setShadeOpen(false)}>閉じる</button>
            </div>
          ) : null}

          {recentsOpen ? (
            <div className="os-android__recents" role="dialog" aria-label="最近使ったアプリ">
              {recents.length ? recents.map((app) => (
                <div className="os-android__recent-card" key={app}>
                  <button type="button" onClick={() => openApp(app, "recents")}><AppIcon os={os} app={app} size={30} /><span>{appLabel(os, app)}</span></button>
                  <button className="os-android__recent-close" type="button" aria-label={`${appLabel(os, app)}を終了する`} onClick={() => closeFromRecents(app)}>↑ 終了</button>
                </div>
              )) : <p className="os-android__empty">最近使ったアプリはありません。</p>}
              <button className="os-android__recents-close" type="button" onClick={() => setRecentsOpen(false)}>閉じる</button>
            </div>
          ) : null}

          {iconMenu ? (
            <div className="os-android__iconmenu" role="dialog" aria-label={`${appLabel(os, iconMenu)}のメニュー`}>
              <button type="button" onClick={() => { const app = iconMenu; setIconMenu(null); if (app) openApp(app); }}>開く</button>
              <button type="button" onClick={() => { setIconMenu(null); openApp("settings"); }}>アプリ情報</button>
              <button type="button" onClick={() => setIconMenu(null)}>ウィジェット</button>
              <button type="button" onClick={() => setIconMenu(null)}>閉じる</button>
            </div>
          ) : null}
        </div>

        <nav className="os-android__navbar" aria-label="ナビゲーション バー">
          <button type="button" aria-label="戻る" onClick={goBack}>{SystemGlyph.androidBack}</button>
          <button type="button" aria-label="ホーム" onClick={goHome}>{SystemGlyph.androidHome}</button>
          <button type="button" aria-label="最近使ったアプリ" onClick={() => setRecentsOpen(true)}>{SystemGlyph.androidRecents}</button>
        </nav>
      </div>
    </div>
  );
}
