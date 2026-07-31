"use client";

import { useCallback, useState } from "react";

import type { AppKey, OsId } from "./os-config";

export type OsEmit = (eventId: string, message: string) => void;

export interface StoredFile {
  id: string;
  name: string;
  folder: "downloads" | "documents" | "pictures";
  date: string;
  size: string;
  kind: "pdf" | "text" | "image";
}

/** 4つのOSで共有する「練習用の世界」。アプリを切り替えても内容が残る。 */
export interface OsWorld {
  browserPage: "start" | "results" | "facility";
  browserQuery: string;
  browserTabs: readonly string[];
  noteText: string;
  noteTitle: string;
  files: readonly StoredFile[];
  selectedFileId: string | null;
  filesFolder: StoredFile["folder"];
  textScale: number;
  wifiOn: boolean;
  bluetoothOn: boolean;
  airplaneMode: boolean;
  darkMode: boolean;
  volume: number;
  brightness: number;
  photoTaken: boolean;
  calling: boolean;
  dialInput: string;
  mailOpenId: string | null;
  mailDraftOpen: boolean;
  calcDisplay: string;
}

export const initialWorld: OsWorld = {
  browserPage: "start",
  browserQuery: "",
  browserTabs: ["新しいタブ"],
  noteText: "夏祭りの持ち物\n・青いタオル\n・飲みもの",
  noteTitle: "夏祭りメモ",
  files: [
    { id: "guide", name: "参加案内.pdf", folder: "downloads", date: "2026/07/29 10:12", size: "2.4 MB", kind: "pdf" },
    { id: "guide-old", name: "参加案内 (1).pdf", folder: "downloads", date: "2025/06/30 09:40", size: "1.8 MB", kind: "pdf" },
    { id: "memo", name: "夏祭りメモ.txt", folder: "documents", date: "2026/07/30 21:05", size: "1 KB", kind: "text" },
    { id: "poster", name: "ポスター写真.jpg", folder: "pictures", date: "2026/07/28 14:22", size: "3.1 MB", kind: "image" },
  ],
  selectedFileId: null,
  filesFolder: "downloads",
  textScale: 100,
  wifiOn: true,
  bluetoothOn: false,
  airplaneMode: false,
  darkMode: false,
  volume: 60,
  brightness: 70,
  photoTaken: false,
  calling: false,
  dialInput: "",
  mailOpenId: null,
  mailDraftOpen: false,
  calcDisplay: "0",
};

export type WorldPatch = Partial<OsWorld> | ((current: OsWorld) => Partial<OsWorld>);

export function useOsWorld(overrides?: Partial<OsWorld>) {
  const [initial] = useState<OsWorld>(() => ({ ...initialWorld, ...overrides }));
  const [world, setWorld] = useState<OsWorld>(initial);
  const update = useCallback((patch: WorldPatch) => {
    setWorld((current) => ({ ...current, ...(typeof patch === "function" ? patch(current) : patch) }));
  }, []);
  const resetWorld = useCallback(() => setWorld(initial), [initial]);
  return { world, update, resetWorld };
}

export type ShellMode = "mission" | "free";

/** 各OSシェル（Windows/mac/iOS/Android）が受け取る共通の入力 */
export interface ShellProps {
  os: OsId;
  mode: ShellMode;
  world: OsWorld;
  update: (patch: WorldPatch) => void;
  emit: OsEmit;
  /** この練習で使えるアプリ */
  apps: readonly AppKey[];
}

export interface AppProps {
  os: OsId;
  world: OsWorld;
  update: (patch: WorldPatch) => void;
  emit: OsEmit;
  /** ホームへ戻る・アプリを閉じるなど、シェル側の操作 */
  goHome?: () => void;
  openApp?: (app: AppKey) => void;
}

export const folderLabels: Record<StoredFile["folder"], string> = {
  downloads: "ダウンロード",
  documents: "ドキュメント",
  pictures: "ピクチャ",
};

export const macFolderLabels: Record<StoredFile["folder"], string> = {
  downloads: "ダウンロード",
  documents: "書類",
  pictures: "ピクチャ",
};
