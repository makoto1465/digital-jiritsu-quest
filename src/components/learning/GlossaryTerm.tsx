"use client";

import { Fragment, useId, useState } from "react";
import { useProgress } from "@/features/progress/ProgressProvider";

const glossary = {
  doubleClick: { label: "ダブルクリック", definition: "マウスの左ボタンを、すばやく2回押す操作です。" },
  rightClick: { label: "右クリック", definition: "マウスの右ボタンを1回押し、その場所で使えるメニューを開く操作です。" },
  leftClick: { label: "左クリック", definition: "マウスの左ボタンを1回押して、すぐ離す操作です。" },
  click: { label: "クリック", definition: "マウスの左ボタンを1回押して、すぐ離す操作です。" },
  pointer: { label: "ポインター", definition: "マウスを動かすと画面上で動く、矢印などの印です。" },
  tap: { label: "タップ", definition: "スマートフォンの画面を指で1回軽く触る操作です。" },
  longPress: { label: "長押し", definition: "画面を指で触れたまま、少し待つ操作です。" },
  scroll: { label: "スクロール", definition: "画面を上下や左右へ動かし、見えていない続きへ移る操作です。" },
  drag: { label: "ドラッグ", definition: "押したまま動かし、目的の場所で離す操作です。" },
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

export type GlossaryTermKey = keyof typeof glossary;

const entries = (Object.entries(glossary) as [GlossaryTermKey, (typeof glossary)[GlossaryTermKey]][])
  .sort((left, right) => right[1].label.length - left[1].label.length);
const termByLabel = new Map<string, GlossaryTermKey>(entries.map(([key, item]) => [item.label, key]));
const termPattern = new RegExp(`(${entries.map(([, item]) => item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

export function GlossaryText({ text }: { text: string }) {
  return (
    <>
      {text.split(termPattern).map((part, index) => {
        const term = termByLabel.get(part);
        return term ? <GlossaryTerm key={`${part}-${index}`} term={term} /> : <Fragment key={`${part}-${index}`}>{part}</Fragment>;
      })}
    </>
  );
}

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
    <span className="glossary-term" onMouseLeave={() => setOpen(false)} onPointerLeave={() => setOpen(false)}>
      <button
        type="button"
        className="glossary-term__button"
        aria-label={`${item.label}の意味を見る`}
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        {item.label}
      </button>
      {open ? <span className="glossary-term__definition" id={id} role="note"><strong>{item.label}</strong>：{item.definition}</span> : null}
    </span>
  );
}
