import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { osIds, osMeta } from "@/features/os/os-config";
import styles from "@/features/os/FreePlayMenu.module.css";

export const metadata: Metadata = { title: "フリープレイ（自由に触る）" };

const hints: Record<string, string> = {
  windows: "スタート ボタン、タスクバー、ウィンドウの ― □ ×",
  mac: "メニューバー、Dock、赤・黄・緑のボタン",
  iphone: "ホーム画面、下のバー、コントロールセンター",
  android: "◁ ○ □ の3つのボタン、アプリ一覧、通知",
};

export default function FreePlayMenuPage() {
  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>FREE PLAY ・ 自由モード</p>
        <h1>好きなだけ、自由に触ってみる</h1>
        <p className={styles.lead}>課題も点数もありません。本物の画面とそっくりな Windows・Mac・iPhone・Android を、好きなだけ押して確かめられます。<strong>送信・購入・削除は実際には起きません。</strong>いつでも最初の状態に戻せます。</p>
        <div className={styles.grid}>
          {osIds.map((id) => (
            <Link className={styles.card} key={id} href={`/free-play/${id}`}>
              <span className={styles.mark} aria-hidden="true"><Icon name={osMeta[id].family === "mobile" ? "smartphone" : "monitor"} size={26} /></span>
              <span><strong>{osMeta[id].deviceName}</strong><small>{hints[id]}</small></span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <p className={styles.note}>順番に学びたいときは <Link href="/start">練習を始める</Link> から、1つずつのミッションに進めます。</p>
      </section>
    </div>
  );
}
