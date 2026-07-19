"use client";

import Link from "next/link";
import { useState } from "react";

import { PracticalLab } from "@/features/lab/PracticalLab";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";

const environmentNames: Record<JourneyEnvironment, string> = { windows: "Windows", mac: "Mac", iphone: "iPhone", android: "Android" };

export function PracticeExperience({ environment }: { environment: JourneyEnvironment }) {
  const { recordFreePlayAction, recordRecovery } = useProgress();
  const [showGuide, setShowGuide] = useState(true);
  return <div className="practice-page shell shell--wide">
    <header className="practice-page__header"><div><p className="section-label">FREE PRACTICE ・ {environmentNames[environment]}</p><h1>好きな操作を、安全に試す</h1><p>課題も点数もありません。操作した結果を見て、気になったら戻してみてください。</p></div><div><Link className="secondary-action" href={`/journey/${environment}`}>学びの道へ戻る</Link><Link className="text-link" href="/start">環境を変える</Link></div></header>
    {showGuide ? <aside className="practice-guide"><div><strong>まず何をすればいい？</strong><p>上の「基本操作」「文字」「検索」などから、気になる場所を一つ選ぶだけです。</p></div><button type="button" onClick={() => setShowGuide(false)}>わかりました</button></aside> : null}
    <PracticalLab environment={environment} freePlay onRecovery={recordRecovery} onAction={recordFreePlayAction} />
    <p className="simulation-note"><strong>実機との違い：</strong>これはブラウザ内の練習用再現です。OSが予約するホームジェスチャー、システム権限、実ファイルの移動などは端末で表示や動きが異なります。</p>
  </div>;
}
