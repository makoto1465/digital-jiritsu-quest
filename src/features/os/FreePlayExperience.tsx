"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { useProgress } from "@/features/progress/ProgressProvider";
import { OsShell } from "./OsShell";
import { osIds, osMeta, type OsId } from "./os-config";
import styles from "./FreePlayExperience.module.css";

const deviceNotes: Record<OsId, string> = {
  windows: "スタート ボタンとタスクバー",
  mac: "メニューバーと Dock",
  iphone: "ホーム画面と下のバー",
  android: "3つのボタンとアプリ一覧",
};

const tips: Record<OsId, readonly string[]> = {
  windows: [
    "画面左下の「⊞（スタート）」を1回左クリックすると、アプリの一覧が出ます。",
    "タスクバーのアイコンは1回クリックで開き、開いている時にもう一度押すと最小化されます。",
    "ウィンドウ右上の「―」「□」「×」を押し分けて、しまう・大きくする・閉じるの違いを確かめます。",
    "タイトルバー（ウィンドウの上の帯）を押したまま動かすと、ウィンドウを移動できます。",
    "デスクトップのアイコンはダブルクリックで開きます。右クリックするとメニューが出ます。",
    "右下の Wi-Fi・音量のあたりを押すと、クイック設定が開きます。",
  ],
  mac: [
    "画面いちばん上の帯（メニューバー）から「ファイル」「表示」などのメニューを開けます。",
    "ウィンドウ左上の赤・黄・緑は、閉じる・Dock へしまう・大きくする の3つです。",
    "赤で閉じてもアプリは終了しません。Dock のアイコンの下に点が残ります。",
    "アプリを終了するには、メニューバーのアプリ名から「終了」を選びます。",
    "Dock のアイコンは1回クリックで開きます。マウスを近づけると名前が出ます。",
    "右上のコントロールセンターから、Wi-Fi や明るさを変えられます。",
  ],
  iphone: [
    "アプリを長押しすると、メニュー（開く・削除など）が出ます。",
    "画面いちばん下のバーを上へスワイプすると、ホーム画面に戻ります。",
    "同じバーを左右へスワイプすると、前に使っていたアプリに切り替わります。",
    "バーを大きく上へスワイプすると、App スイッチャー（開いているアプリ）が出ます。",
    "画面右上を押すと、コントロールセンター（Wi-Fi・明るさ）が開きます。",
    "設定 →「画面表示と明るさ」→ テキストサイズ で、文字を大きくできます。",
  ],
  android: [
    "画面下の「◁ 戻る」「○ ホーム」「□ 最近使ったアプリ」の3つを押し分けます。",
    "ホーム画面の下から上へスワイプ（下の線を押す）すると、アプリ一覧が開きます。",
    "画面いちばん上を押すと、通知とクイック設定が下りてきます。",
    "アプリを長押しすると、アプリ情報などのメニューが出ます。",
    "設定 →「ディスプレイ」→「表示サイズとテキスト」で、文字を大きくできます。",
    "Chrome の右上「⋮」から、テキストのサイズやブックマークを開けます。",
  ],
};

export function FreePlayExperience({ device }: { device: OsId }) {
  const { recordFreePlayAction } = useProgress();
  const [sessionKey, setSessionKey] = useState(0);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("気になるところを押してみてください。壊れることはありません。");

  const emit = useCallback((eventId: string, text: string) => {
    setCount((current) => current + 1);
    setMessage(text);
    recordFreePlayAction(`${device}:${eventId}`);
  }, [device, recordFreePlayAction]);

  const reset = () => {
    setSessionKey((current) => current + 1);
    setCount(0);
    setMessage("最初の状態に戻しました。もう一度、好きなところから試せます。");
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>FREE PLAY ・ 自由モード</p>
          <h1>{osMeta[device].deviceName}を、自由に触ってみる</h1>
          <p className={styles.lead}>課題も点数もありません。本物とそっくりな画面で、どこを押すと何が起きるかを確かめられます。送信・購入・削除は実際には起きません。</p>
        </div>
        <Link className={styles.exit} href="/">ホームへ戻る</Link>
      </div>

      <nav className={styles.devices} aria-label="練習する機器">
        {osIds.map((id) => (
          <Link className={styles.device} key={id} href={`/free-play/${id}`} aria-current={id === device ? "page" : undefined}>
            <span className={styles.deviceMark} aria-hidden="true"><Icon name={osMeta[id].family === "mobile" ? "smartphone" : "monitor"} size={20} /></span>
            <span>{osMeta[id].deviceName}<small>{deviceNotes[id]}</small></span>
          </Link>
        ))}
      </nav>

      <div className={styles.bar}>
        <span className={styles.count}><Icon name="practice" size={16} />{count} 回ためした</span>
        <p className={styles.status} aria-live="polite">{message}</p>
        <button className={styles.reset} type="button" onClick={reset}>↺ 最初の状態に戻す</button>
      </div>

      <div className={styles.stage}>
        <OsShell key={sessionKey} os={device} mode="free" emit={emit} />
      </div>

      <details className={styles.tips}>
        <summary>この機器で試せること（{osMeta[device].name}）</summary>
        <ul>{tips[device].map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </details>

      <p className={styles.note}><strong>実機との違い：</strong>これはブラウザ内の再現画面です。指の細かいスワイプ、OSが予約する画面の端からの操作、実際のファイル保存や通信は、本物の端末と動きが異なります。名前・配置・押した時の変化は、実機に合わせています。</p>
    </div>
  );
}
