"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useProgress } from "@/features/progress/ProgressProvider";
import { DeviceSimulator } from "./DeviceSimulator";
import type { SimulatorCommand } from "./types";

const actionNames: Record<string, string> = {
  "open-browser": "ブラウザを開きました",
  "open-settings": "設定を開きました",
  "open-files": "ファイルを開きました",
  "open-mail": "メールを開きました",
  "open-notes": "メモを開きました",
  "open-help": "ヘルプを開きました",
  "search-web": "検索を試しました",
  "text-larger": "文字の大きさを変えました",
  "move-file": "ファイルを移動しました",
  "share-photo": "共有の流れを試しました",
  undo: "1つ前の状態に戻しました",
  redo: "操作をやり直しました",
  reset: "初期状態に戻しました",
};

export function FreePlayClient({ device }: { device: "pc" | "mobile" }) {
  const [command, setCommand] = useState<SimulatorCommand | undefined>();
  const [lastAction, setLastAction] = useState("気になるアプリを自由に開いてみましょう。");
  const [actionCount, setActionCount] = useState(0);
  const { recordFreePlayAction, recordRecovery } = useProgress();

  const handleAction = useCallback((actionId: string) => {
    setActionCount((current) => current + 1);
    setLastAction(actionNames[actionId] ?? "新しい操作を試しました。画面の変化を観察してみましょう。");
    recordFreePlayAction(`${device}:${actionId}`);
    if (actionId === "undo") recordRecovery();
  }, [device, recordFreePlayAction, recordRecovery]);

  const sendCommand = (type: SimulatorCommand["type"]) => setCommand({ id: Date.now(), type });

  return (
    <div className="free-play-layout section-shell">
      <div className="page-heading compact-heading">
        <div><p className="eyebrow">FREE PLAY</p><h1>{device === "pc" ? "PC" : "スマートフォン"} フリープレイ</h1><p>課題はありません。「押したらどうなる？」を、安全に試す場所です。</p></div>
        <div className="button-row">
          <Link className="button button-secondary" href={`/free-play/${device === "pc" ? "mobile" : "pc"}`}><Icon name={device === "pc" ? "smartphone" : "monitor"} />{device === "pc" ? "スマホ" : "PC"}に切り替え</Link>
          <Link className="button button-ghost" href="/start">練習メニューへ</Link>
        </div>
      </div>
      <div className="free-play-stats"><span><Icon name="practice" /><strong>{actionCount}</strong> 回ためした</span><p aria-live="polite">{lastAction}</p></div>
      <DeviceSimulator device={device} onAction={handleAction} command={command} />
      <nav className="recovery-tray free-tray" aria-label="フリープレイの復旧操作">
        <span><Icon name="shield" /><strong>いつでも戻せます</strong></span>
        <button type="button" onClick={() => sendCommand("undo")}><Icon name="undo" />1つ前に戻す</button>
        <button type="button" onClick={() => sendCommand("redo")}><Icon name="redo" />やり直す</button>
        <button type="button" onClick={() => sendCommand("reset")}><Icon name="reset" />初期状態に戻す</button>
      </nav>
    </div>
  );
}
