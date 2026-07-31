"use client";

import { useState } from "react";

import { SystemGlyph } from "../OsIcons";
import type { AppProps } from "../os-state";

/* ---------------------------------------------------------------- カメラ */

export function CameraApp({ os, world, update, emit }: AppProps) {
  const [mode, setMode] = useState("写真");
  return (
    <div className={`os-camera is-${os}`}>
      <div className="os-camera__top"><span aria-hidden="true">⚡ 自動</span><span aria-hidden="true">▲</span><span aria-hidden="true">Live</span></div>
      <div className={`os-camera__view${world.photoTaken ? " has-photo" : ""}`} role="img" aria-label={world.photoTaken ? "撮影した練習写真（夏祭りのポスター）" : "カメラのプレビュー。夏祭りのポスターが写っています"}>
        <span className="os-camera__poster">夏祭り<small>7月19日（土）午前10時</small></span>
        {world.photoTaken ? <p className="os-camera__flash">保存しました（練習用）</p> : null}
      </div>
      <div className="os-camera__modes" role="tablist" aria-label="撮影モード">
        {["ビデオ", "写真", "ポートレート"].map((item) => (
          <button key={item} role="tab" aria-selected={mode === item} type="button" onClick={() => setMode(item)}>{item}</button>
        ))}
      </div>
      <div className="os-camera__controls">
        <button className="os-camera__thumb" type="button" aria-label="直前の写真を見る" />
        <button
          className="os-camera__shutter"
          type="button"
          aria-label={world.photoTaken ? "もう一度撮る" : "撮影する（練習用）"}
          onClick={() => { update({ photoTaken: !world.photoTaken }); emit(world.photoTaken ? "camera-retaken" : "camera-taken", world.photoTaken ? "撮り直せる状態に戻しました。" : "写る範囲を確かめて、練習写真を撮りました。"); }}
        />
        <button className="os-camera__flip" type="button" aria-label="内カメラに切り替え">⟳</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 電話 */

const keypad = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["✱", ""], ["0", "＋"], ["♯", ""]];

export function PhoneApp({ os, world, update, emit }: AppProps) {
  const [tab, setTab] = useState<"keypad" | "recents" | "contacts">("keypad");
  const call = () => {
    update({ calling: !world.calling });
    emit(world.calling ? "call-ended" : "call-started", world.calling ? "練習通話を終了しました。" : "相手と番号を確かめてから、練習通話を始めました。外部にはつながりません。");
  };
  return (
    <div className={`os-phone is-${os}`}>
      {world.calling ? (
        <div className="os-phone__call">
          <p className="os-phone__callee">中央公民館</p>
          <p className="os-phone__status">通話中 00:03　<small>練習用・外部にはつながっていません</small></p>
          <div className="os-phone__callgrid" aria-hidden="true"><span>🔇 消音</span><span>⌨ キーパッド</span><span>🔊 スピーカー</span><span>➕ 追加</span><span>🎥 FaceTime</span><span>👤 連絡先</span></div>
          <button className="os-phone__hangup" type="button" onClick={call}>通話を終了</button>
        </div>
      ) : tab === "keypad" ? (
        <>
          <p className="os-phone__input">{world.dialInput || "番号を入力"}</p>
          <div className="os-phone__keys">
            {keypad.map(([digit, letters]) => (
              <button key={digit} type="button" onClick={() => update((current) => ({ dialInput: current.dialInput + digit }))}>
                <strong>{digit}</strong>{letters ? <small>{letters}</small> : null}
              </button>
            ))}
          </div>
          <div className="os-phone__callrow">
            <span />
            <button className="os-phone__callbutton" type="button" onClick={call} aria-label="発信する（練習用）">📞</button>
            <button className="os-phone__delete" type="button" aria-label="1文字消す" onClick={() => update((current) => ({ dialInput: current.dialInput.slice(0, -1) }))}>⌫</button>
          </div>
        </>
      ) : (
        <ul className="os-phone__list">
          {[["中央公民館", "000-1234-5678", "昨日"], ["田中 さとし", "090-0000-0000", "7/28"], ["みどり市役所", "000-1111-2222", "7/25"]].map(([name, number, when]) => (
            <li key={name}><button type="button" onClick={() => { update({ dialInput: number }); setTab("keypad"); }}><span className="os-phone__avatar" aria-hidden="true">{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{number}</small></span><time>{when}</time></button></li>
          ))}
        </ul>
      )}
      {world.calling ? null : (
        <nav className="os-phone__tabs" aria-label="電話のタブ">
          <button type="button" aria-current={tab === "recents" ? "page" : undefined} onClick={() => setTab("recents")}>🕘 履歴</button>
          <button type="button" aria-current={tab === "contacts" ? "page" : undefined} onClick={() => setTab("contacts")}>👤 連絡先</button>
          <button type="button" aria-current={tab === "keypad" ? "page" : undefined} onClick={() => setTab("keypad")}>⌨ キーパッド</button>
        </nav>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- メッセージ */

export function MessagesApp({ os, emit }: AppProps) {
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  if (openThread) {
    return (
      <div className={`os-messages is-${os}`}>
        <div className="os-messages__thread-head"><button className="os-ios-back" type="button" onClick={() => setOpenThread(null)}>{SystemGlyph.back}<span>メッセージ</span></button><strong>{openThread}</strong></div>
        <div className="os-messages__thread">
          <p className="os-messages__bubble is-them">明日の集合は10時でいいですか？</p>
          <p className="os-messages__bubble is-me">はい、10時に公民館前で。</p>
          {sent.map((text, index) => <p className="os-messages__bubble is-me" key={index}>{text}</p>)}
        </div>
        <form className="os-messages__composer" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setSent((current) => [...current, draft]); setDraft(""); emit("message-sent", "練習用のメッセージを送りました。外部には届きません。"); }}>
          <input aria-label="メッセージを入力" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="メッセージ" />
          <button type="submit" aria-label="送信（練習用）">↑</button>
        </form>
      </div>
    );
  }
  return (
    <div className={`os-messages is-${os}`}>
      <div className="os-ios-largetitle"><h1>メッセージ</h1><button type="button" aria-label="新規メッセージ">✎</button></div>
      <ul className="os-messages__list">
        {[["田中 さとし", "はい、10時に公民館前で。", "14:02"], ["中央公民館", "夏祭りのご案内を送りました。", "昨日"], ["家族", "写真ありがとう", "7/28"]].map(([name, preview, time]) => (
          <li key={name}><button type="button" onClick={() => setOpenThread(name)}><span className="os-phone__avatar" aria-hidden="true">{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{preview}</small></span><time>{time}</time></button></li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------- 時計・マップ・音楽・ストア */

export function ClockApp({ os }: AppProps) {
  return (
    <div className={`os-clock is-${os}`}>
      <div className="os-clock__face" aria-hidden="true"><span className="os-clock__hand is-hour" /><span className="os-clock__hand is-minute" /><span className="os-clock__center" /></div>
      <p className="os-clock__digital">14:30<small>7月31日 金曜日</small></p>
      <div className="os-clock__alarms"><p>アラーム</p><div><span>6:30<small>平日</small></span><span className="is-off">9:00<small>週末</small></span></div></div>
    </div>
  );
}

export function MapsApp({ os, emit }: AppProps) {
  return (
    <div className={`os-maps is-${os}`}>
      <div className="os-maps__canvas" role="img" aria-label="練習用の地図。中央公民館の位置が示されています">
        <span className="os-maps__road is-h" /><span className="os-maps__road is-v" /><span className="os-maps__pin">📍</span>
        <span className="os-maps__label">中央公民館</span>
      </div>
      <div className="os-maps__search"><span aria-hidden="true">{SystemGlyph.search}</span>場所を検索</div>
      <div className="os-maps__card"><strong>中央公民館</strong><small>みどり市中央3丁目1-1・徒歩8分</small><button type="button" onClick={() => emit("route-opened", "経路の案内を開きました。")}>経路</button></div>
    </div>
  );
}

export function MusicApp({ os }: AppProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`os-music is-${os}`}>
      <div className="os-music__art" aria-hidden="true">♪</div>
      <p className="os-music__title">練習用のサンプル曲</p>
      <p className="os-music__artist">みどり市 公民館バンド</p>
      <div className="os-music__bar" aria-hidden="true"><span style={{ width: playing ? "42%" : "8%" }} /></div>
      <div className="os-music__controls"><button type="button" aria-label="前の曲">⏮</button><button type="button" aria-label={playing ? "一時停止" : "再生"} onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "▶"}</button><button type="button" aria-label="次の曲">⏭</button></div>
    </div>
  );
}

export function StoreApp({ os }: AppProps) {
  return (
    <div className={`os-store is-${os}`}>
      <div className="os-ios-largetitle"><h1>アプリ</h1></div>
      <ul className="os-store__list">
        {[["天気", "毎日の天気を見る"], ["ラジオ", "地域の放送を聴く"], ["家計簿", "支出を記録する"]].map(([name, note]) => (
          <li key={name}><span className="os-store__icon" aria-hidden="true">{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{note}</small></span><button type="button">入手</button></li>
        ))}
      </ul>
      <p className="os-store__note">練習用の一覧です。実際のダウンロードや購入は起きません。</p>
    </div>
  );
}
