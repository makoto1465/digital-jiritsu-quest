"use client";

import { useId, useState } from "react";
import type { JourneyAreaId } from "@/lib/journey-types";
import { useProgress } from "@/features/progress/ProgressProvider";

export type GlossaryTermKey = keyof typeof glossary;

const glossary = {
  file: { label: "ファイル", definition: "文章や写真など、保存した一つのデータです。" },
  folder: { label: "フォルダー", definition: "ファイルをまとめて入れておく場所です。" },
  app: { label: "アプリ", definition: "電話、カメラ、メールなど、目的ごとに使うソフトです。" },
  browser: { label: "ブラウザ", definition: "インターネットのページを見るためのアプリです。" },
  tab: { label: "タブ", definition: "ブラウザで複数のページを切り替えるための見出しです。" },
  download: { label: "ダウンロード", definition: "インターネット上のファイルを、自分の機器へ保存することです。" },
  attachment: { label: "添付", definition: "メールなどにファイルを付けることです。" },
  permission: { label: "権限", definition: "写真や位置情報などをアプリに使わせてよいか決める設定です。" },
  settings: { label: "設定", definition: "文字の大きさや音など、機器の使い方を変える場所です。" },
} as const;

export const areaTerms: Record<JourneyAreaId, readonly GlossaryTermKey[]> = {
  "touch-and-move": ["folder", "file"],
  "navigate-screens": ["app", "browser", "tab"],
  "work-with-text": ["file", "app"],
  "find-and-check": ["browser", "tab"],
  "files-and-photos": ["file", "folder", "download", "attachment"],
  "proceed-safely": ["permission", "app"],
  "solve-problems": ["settings", "app", "browser"],
  "independent-challenge": ["file", "folder", "settings"],
};

export function GlossaryTerm({ term }: { term: GlossaryTermKey }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { recordGlossaryView } = useProgress();
  const item = glossary[term];

  function toggle() {
    if (!open) recordGlossaryView();
    setOpen(!open);
  }

  return (
    <span className="glossary-term">
      <button type="button" className="glossary-term__button" aria-expanded={open} aria-controls={id} onClick={toggle}>
        {item.label}<span aria-hidden="true">?</span>
      </button>
      {open ? <span className="glossary-term__definition" id={id} role="note"><strong>{item.label}</strong>：{item.definition}</span> : null}
    </span>
  );
}
