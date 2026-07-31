"use client";

import { useCallback } from "react";

import { AndroidShell } from "./AndroidShell";
import { IosShell } from "./IosShell";
import { MacShell } from "./MacShell";
import { WindowsShell } from "./WindowsShell";
import type { AppKey, OsId } from "./os-config";
import { useOsWorld, type OsEmit, type ShellMode } from "./os-state";

const missionApps: Record<OsId, readonly AppKey[]> = {
  windows: ["browser", "notes", "files", "settings", "trash"],
  mac: ["browser", "notes", "files", "settings", "trash"],
  iphone: ["browser", "notes", "files", "settings", "photos", "camera", "phone", "mail"],
  android: ["browser", "notes", "files", "settings", "photos", "camera", "phone", "mail"],
};

const freeApps: Record<OsId, readonly AppKey[]> = {
  windows: ["browser", "files", "notes", "mail", "photos", "settings", "calculator", "store", "music", "clock", "maps", "trash"],
  mac: ["browser", "files", "notes", "mail", "photos", "settings", "calculator", "store", "music", "maps", "trash"],
  iphone: ["browser", "phone", "messages", "camera", "photos", "notes", "files", "mail", "settings", "calculator", "clock", "maps", "music", "store"],
  android: ["browser", "phone", "messages", "camera", "photos", "notes", "files", "mail", "settings", "calculator", "clock", "maps", "music", "store"],
};

export function defaultApps(os: OsId, mode: ShellMode) {
  return mode === "mission" ? missionApps[os] : freeApps[os];
}

export interface OsShellProps {
  os: OsId;
  mode?: ShellMode;
  /** ミッションの成功判定・操作ログへ渡すイベント */
  emit?: OsEmit;
  apps?: readonly AppKey[];
}

/** 4つのOSの見た目と動きを、実機に近づけて再現する練習用シェル。 */
export function OsShell({ os, mode = "free", emit, apps }: OsShellProps) {
  // ミッションでは、検索の練習は別の課題なので、ブラウザは検索結果から始める
  const { world, update } = useOsWorld(mode === "mission" ? { browserPage: "results", browserQuery: "みどり市 中央公民館" } : undefined);
  const handleEmit = useCallback<OsEmit>((eventId, message) => emit?.(eventId, message), [emit]);
  const appList = apps ?? defaultApps(os, mode);
  const shellProps = { os, mode, world, update, emit: handleEmit, apps: appList };

  return (
    <div className={`os-shell os-shell--${os}`} data-os={os}>
      {os === "windows" ? <WindowsShell {...shellProps} /> : null}
      {os === "mac" ? <MacShell {...shellProps} /> : null}
      {os === "iphone" ? <IosShell {...shellProps} /> : null}
      {os === "android" ? <AndroidShell {...shellProps} /> : null}
    </div>
  );
}
