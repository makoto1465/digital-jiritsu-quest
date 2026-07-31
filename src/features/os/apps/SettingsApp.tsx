"use client";

import { useState } from "react";

import { SystemGlyph } from "../OsIcons";
import type { AppProps } from "../os-state";

type Section = "home" | "display" | "network" | "sound";

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button className={`os-toggle${on ? " is-on" : ""}`} type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

function TextSizeControl({ world, update, emit, os }: AppProps) {
  return (
    <div className="os-setting-slider">
      <label htmlFor="os-text-size">文字の大きさ</label>
      <div>
        <span aria-hidden="true" className="os-setting-slider__small">Ａ</span>
        <input
          id="os-text-size"
          type="range"
          min={85}
          max={150}
          step={5}
          value={world.textScale}
          onChange={(event) => {
            const value = Number(event.target.value);
            update({ textScale: value });
            emit("text-larger", `文字の大きさを ${value}% にしました。`);
          }}
        />
        <span aria-hidden="true" className="os-setting-slider__large">Ａ</span>
      </div>
      <output>{world.textScale}%</output>
      <p className="os-setting-sample" style={{ fontSize: `${world.textScale}%` }}>中央公民館からのお知らせを読みやすく調整してください。</p>
      {os === "windows" ? <p className="os-setting-note">Windows では「システム ＞ ディスプレイ ＞ 拡大縮小」でも大きさを変えられます。</p> : null}
    </div>
  );
}

export function SettingsApp(props: AppProps) {
  const { os, world, update, emit } = props;
  const [section, setSection] = useState<Section>("home");

  const openSection = (next: Section) => {
    setSection(next);
    if (next === "display") emit("display-opened", "画面の表示（文字の大きさ）の設定を開きました。");
    if (next === "network") emit("network-inspected", "ネットワークの設定を開きました。");
  };
  const toggleWifi = (next: boolean) => {
    update({ wifiOn: next });
    emit(next ? "wifi-on" : "wifi-off", next ? "Wi-Fi をオンにしました。" : "Wi-Fi をオフにしました。");
  };

  /* --------------------------------------------------------- Windows 11 */
  if (os === "windows") {
    const navItems: Array<[Section | "other", string, string]> = [
      ["home", "🖥", "システム"],
      ["other", "🔵", "Bluetooth とデバイス"],
      ["network", "🛜", "ネットワークとインターネット"],
      ["other", "🎨", "個人用設定"],
      ["other", "▦", "アプリ"],
      ["other", "👤", "アカウント"],
      ["other", "🕘", "時刻と言語"],
      ["other", "♿", "アクセシビリティ"],
      ["other", "🔒", "プライバシーとセキュリティ"],
      ["other", "🔄", "Windows Update"],
    ];
    return (
      <div className="os-winsettings">
        <nav className="os-winsettings__nav" aria-label="設定のカテゴリ">
          <div className="os-winsettings__account"><span aria-hidden="true">練</span><span><strong>練習 ユーザー</strong><small>ローカル アカウント</small></span></div>
          <div className="os-winsettings__search"><span aria-hidden="true">{SystemGlyph.search}</span>設定の検索</div>
          {navItems.map(([target, icon, label]) => (
            <button key={label} type="button" aria-current={(target === "home" && section !== "network") || target === section ? "true" : undefined} onClick={() => openSection(target === "other" ? "home" : target)}>
              <span aria-hidden="true">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="os-winsettings__pane">
          {section === "network" ? (
            <>
              <p className="os-winsettings__crumb">ネットワークとインターネット</p>
              <h1>ネットワークとインターネット</h1>
              <div className="os-winsettings__card"><span aria-hidden="true">🛜</span><div><strong>Wi-Fi</strong><small>{world.wifiOn ? "接続済み：まちの Wi-Fi（練習用）" : "オフ"}</small></div><Toggle on={world.wifiOn} label="Wi-Fi" onChange={toggleWifi} /></div>
              <div className="os-winsettings__card"><span aria-hidden="true">✈</span><div><strong>機内モード</strong><small>ワイヤレス通信を止めます</small></div><Toggle on={world.airplaneMode} label="機内モード" onChange={(next) => update({ airplaneMode: next })} /></div>
              <div className="os-winsettings__card"><span aria-hidden="true">🔗</span><div><strong>ネットワークの詳細設定</strong><small>アダプター、データ使用量</small></div><span aria-hidden="true">›</span></div>
            </>
          ) : section === "display" ? (
            <>
              <p className="os-winsettings__crumb">システム ＞ ディスプレイ</p>
              <h1>ディスプレイ</h1>
              <div className="os-winsettings__card"><span aria-hidden="true">☀</span><div><strong>明るさ</strong><input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></div></div>
              <div className="os-winsettings__card is-block"><TextSizeControl {...props} /></div>
              <div className="os-winsettings__card"><span aria-hidden="true">🌙</span><div><strong>夜間モード</strong><small>暖色にして目の負担を減らします</small></div><Toggle on={world.darkMode} label="夜間モード" onChange={(next) => update({ darkMode: next })} /></div>
            </>
          ) : (
            <>
              <p className="os-winsettings__crumb">システム</p>
              <h1>システム</h1>
              <button className="os-winsettings__card is-button" type="button" onClick={() => openSection("display")}><span aria-hidden="true">🖥</span><div><strong>ディスプレイ</strong><small>モニター、明るさ、文字の大きさ</small></div><span aria-hidden="true">›</span></button>
              <button className="os-winsettings__card is-button" type="button" onClick={() => openSection("sound")}><span aria-hidden="true">🔊</span><div><strong>サウンド</strong><small>音量、出力、入力</small></div><span aria-hidden="true">›</span></button>
              <button className="os-winsettings__card is-button" type="button" onClick={() => openSection("network")}><span aria-hidden="true">🛜</span><div><strong>ネットワーク</strong><small>Wi-Fi、機内モード</small></div><span aria-hidden="true">›</span></button>
              <div className="os-winsettings__card"><span aria-hidden="true">🔋</span><div><strong>電源とバッテリー</strong><small>スリープ、バッテリー節約機能</small></div><span aria-hidden="true">›</span></div>
              <div className="os-winsettings__card"><span aria-hidden="true">💾</span><div><strong>記憶域</strong><small>224 GB 中 96 GB の空き</small></div><span aria-hidden="true">›</span></div>
            </>
          )}
          {section === "sound" ? <div className="os-winsettings__card"><span aria-hidden="true">🔊</span><div><strong>音量</strong><input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></div></div> : null}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- macOS */
  if (os === "mac") {
    const rows: Array<[Section | "other", string, string, string]> = [
      ["network", "#3d82f0", "🛜", "Wi-Fi"],
      ["other", "#3d82f0", "🔵", "Bluetooth"],
      ["other", "#3d82f0", "🌐", "ネットワーク"],
      ["other", "#e0453c", "🔔", "通知"],
      ["sound", "#e0453c", "🔊", "サウンド"],
      ["other", "#5b5be0", "🌙", "集中モード"],
      ["other", "#4aa84a", "⏳", "スクリーンタイム"],
      ["other", "#8b8b93", "⚙", "一般"],
      ["display", "#1f6fd0", "🖥", "外観・ディスプレイ"],
      ["other", "#1f6fd0", "♿", "アクセシビリティ"],
    ];
    return (
      <div className="os-macsettings">
        <nav className="os-macsettings__sidebar" aria-label="システム設定のカテゴリ">
          <div className="os-macsettings__search"><span aria-hidden="true">{SystemGlyph.search}</span>検索</div>
          <div className="os-macsettings__account"><span aria-hidden="true">練</span><span><strong>練習 ユーザー</strong><small>Apple ID（練習用）</small></span></div>
          {rows.map(([target, color, icon, label]) => (
            <button key={label} type="button" aria-current={target === section ? "true" : undefined} onClick={() => openSection(target === "other" ? "home" : target)}>
              <span aria-hidden="true" style={{ background: color }}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="os-macsettings__pane">
          {section === "display" ? (
            <>
              <h1>外観・ディスプレイ</h1>
              <div className="os-macsettings__group">
                <div className="os-macsettings__row"><span>外観</span><div className="os-segment"><button type="button" className={world.darkMode ? "" : "is-on"} onClick={() => update({ darkMode: false })}>ライト</button><button type="button" className={world.darkMode ? "is-on" : ""} onClick={() => update({ darkMode: true })}>ダーク</button></div></div>
                <div className="os-macsettings__row"><span>明るさ</span><input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></div>
              </div>
              <div className="os-macsettings__group is-block"><TextSizeControl {...props} /></div>
            </>
          ) : section === "network" ? (
            <>
              <h1>Wi-Fi</h1>
              <div className="os-macsettings__group">
                <div className="os-macsettings__row"><span>Wi-Fi</span><Toggle on={world.wifiOn} label="Wi-Fi" onChange={toggleWifi} /></div>
              </div>
              <p className="os-macsettings__label">接続済みネットワーク</p>
              <div className="os-macsettings__group">
                <div className="os-macsettings__row"><span>🛜 まちの Wi-Fi（練習用）</span><small>接続済み</small></div>
                <div className="os-macsettings__row"><span>🛜 guest-free</span><small>安全性が低い</small></div>
              </div>
            </>
          ) : section === "sound" ? (
            <>
              <h1>サウンド</h1>
              <div className="os-macsettings__group"><div className="os-macsettings__row"><span>主音量</span><input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></div></div>
            </>
          ) : (
            <>
              <h1>一般</h1>
              <div className="os-macsettings__group">
                <button className="os-macsettings__row is-button" type="button" onClick={() => openSection("display")}><span>🖥 外観・ディスプレイ</span><span aria-hidden="true">›</span></button>
                <button className="os-macsettings__row is-button" type="button" onClick={() => openSection("network")}><span>🛜 Wi-Fi</span><span aria-hidden="true">›</span></button>
                <button className="os-macsettings__row is-button" type="button" onClick={() => openSection("sound")}><span>🔊 サウンド</span><span aria-hidden="true">›</span></button>
              </div>
              <p className="os-macsettings__label">この Mac について</p>
              <div className="os-macsettings__group"><div className="os-macsettings__row"><span>macOS</span><small>練習用の再現画面です</small></div></div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- iOS */
  if (os === "iphone") {
    if (section !== "home") {
      return (
        <div className="os-ios-settings">
          <div className="os-ios-navbar">
            <button className="os-ios-back" type="button" onClick={() => setSection("home")}>{SystemGlyph.back}<span>設定</span></button>
            <strong>{section === "display" ? "画面表示と明るさ" : section === "network" ? "Wi-Fi" : "サウンドと触覚"}</strong>
            <span />
          </div>
          {section === "display" ? (
            <>
              <p className="os-ios-grouplabel">外観モード</p>
              <div className="os-ios-group">
                <div className="os-ios-row"><span>ライト</span><input type="radio" name="appearance" checked={!world.darkMode} onChange={() => update({ darkMode: false })} aria-label="ライト" /></div>
                <div className="os-ios-row"><span>ダーク</span><input type="radio" name="appearance" checked={world.darkMode} onChange={() => update({ darkMode: true })} aria-label="ダーク" /></div>
              </div>
              <p className="os-ios-grouplabel">明るさ</p>
              <div className="os-ios-group"><div className="os-ios-row"><input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></div></div>
              <p className="os-ios-grouplabel">テキストサイズ</p>
              <div className="os-ios-group is-block"><TextSizeControl {...props} /></div>
            </>
          ) : section === "network" ? (
            <>
              <div className="os-ios-group"><div className="os-ios-row"><span>Wi-Fi</span><Toggle on={world.wifiOn} label="Wi-Fi" onChange={toggleWifi} /></div></div>
              <p className="os-ios-grouplabel">ネットワークを選択</p>
              <div className="os-ios-group">
                <div className="os-ios-row"><span>まちの Wi-Fi（練習用）</span><small>✓ 接続済み</small></div>
                <div className="os-ios-row"><span>guest-free</span><small>🔓</small></div>
              </div>
            </>
          ) : (
            <div className="os-ios-group"><div className="os-ios-row"><span>着信音と通知音</span><input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></div></div>
          )}
        </div>
      );
    }
    return (
      <div className="os-ios-settings">
        <div className="os-ios-largetitle"><h1>設定</h1></div>
        <div className="os-ios-search"><span aria-hidden="true">{SystemGlyph.search}</span>検索</div>
        <div className="os-ios-group">
          <div className="os-ios-row is-account"><span className="os-ios-avatar" aria-hidden="true">練</span><span className="os-ios-row__text"><strong>練習 ユーザー</strong><small>Apple ID、iCloud、メディアと購入</small></span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
        </div>
        <div className="os-ios-group">
          <div className="os-ios-row"><span className="os-ios-icon is-orange" aria-hidden="true">✈</span><span>機内モード</span><Toggle on={world.airplaneMode} label="機内モード" onChange={(next) => update({ airplaneMode: next })} /></div>
          <button className="os-ios-row" type="button" onClick={() => openSection("network")}><span className="os-ios-icon is-blue" aria-hidden="true">🛜</span><span>Wi-Fi</span><small>{world.wifiOn ? "まちの Wi-Fi" : "オフ"}</small><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></button>
          <div className="os-ios-row"><span className="os-ios-icon is-blue" aria-hidden="true">🔵</span><span>Bluetooth</span><small>{world.bluetoothOn ? "オン" : "オフ"}</small><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
        </div>
        <div className="os-ios-group">
          <div className="os-ios-row"><span className="os-ios-icon is-red" aria-hidden="true">🔔</span><span>通知</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
          <button className="os-ios-row" type="button" onClick={() => openSection("sound")}><span className="os-ios-icon is-pink" aria-hidden="true">🔊</span><span>サウンドと触覚</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></button>
          <div className="os-ios-row"><span className="os-ios-icon is-indigo" aria-hidden="true">🌙</span><span>集中モード</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
        </div>
        <div className="os-ios-group">
          <div className="os-ios-row"><span className="os-ios-icon is-gray" aria-hidden="true">⚙</span><span>一般</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
          <button className="os-ios-row" type="button" onClick={() => openSection("display")}><span className="os-ios-icon is-blue" aria-hidden="true">🔆</span><span>画面表示と明るさ</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></button>
          <div className="os-ios-row"><span className="os-ios-icon is-blue" aria-hidden="true">♿</span><span>アクセシビリティ</span><span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span></div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- Android */
  if (section !== "home") {
    return (
      <div className="os-android-settings">
        <div className="os-android-detailbar">
          <button type="button" aria-label="戻る" onClick={() => setSection("home")}>{SystemGlyph.back}</button>
          <strong>{section === "display" ? "ディスプレイ" : section === "network" ? "ネットワークとインターネット" : "音とバイブレーション"}</strong>
        </div>
        {section === "display" ? (
          <>
            <div className="os-android-card"><span>明るさのレベル</span><input type="range" min={0} max={100} value={world.brightness} aria-label="明るさ" onChange={(event) => update({ brightness: Number(event.target.value) })} /></div>
            <div className="os-android-card is-row"><span><strong>ダークモード</strong><small>画面を暗い配色にします</small></span><Toggle on={world.darkMode} label="ダークモード" onChange={(next) => update({ darkMode: next })} /></div>
            <div className="os-android-card is-block"><strong>表示サイズとテキスト</strong><TextSizeControl {...props} /></div>
          </>
        ) : section === "network" ? (
          <>
            <div className="os-android-card is-row"><span><strong>Wi-Fi</strong><small>{world.wifiOn ? "まちの Wi-Fi（練習用）に接続済み" : "オフ"}</small></span><Toggle on={world.wifiOn} label="Wi-Fi" onChange={toggleWifi} /></div>
            <div className="os-android-card is-row"><span><strong>機内モード</strong><small>すべての通信を止めます</small></span><Toggle on={world.airplaneMode} label="機内モード" onChange={(next) => update({ airplaneMode: next })} /></div>
          </>
        ) : (
          <div className="os-android-card"><span>メディアの音量</span><input type="range" min={0} max={100} value={world.volume} aria-label="音量" onChange={(event) => update({ volume: Number(event.target.value) })} /></div>
        )}
      </div>
    );
  }
  return (
    <div className="os-android-settings">
      <h1>設定</h1>
      <div className="os-android-searchpill is-wide"><span aria-hidden="true">{SystemGlyph.search}</span>設定を検索</div>
      <ul className="os-android-settinglist">
        <li><button type="button" onClick={() => openSection("network")}><span aria-hidden="true">🛜</span><span><strong>ネットワークとインターネット</strong><small>Wi-Fi、モバイル、データ使用量</small></span></button></li>
        <li><button type="button"><span aria-hidden="true">🔵</span><span><strong>接続済みのデバイス</strong><small>Bluetooth、ペア設定</small></span></button></li>
        <li><button type="button"><span aria-hidden="true">▦</span><span><strong>アプリ</strong><small>権限、既定のアプリ</small></span></button></li>
        <li><button type="button"><span aria-hidden="true">🔔</span><span><strong>通知</strong><small>通知履歴、会話</small></span></button></li>
        <li><button type="button" onClick={() => openSection("sound")}><span aria-hidden="true">🔊</span><span><strong>音とバイブレーション</strong><small>音量、着信音</small></span></button></li>
        <li><button type="button" onClick={() => openSection("display")}><span aria-hidden="true">🔆</span><span><strong>ディスプレイ</strong><small>明るさ、ダークモード、文字の大きさ</small></span></button></li>
        <li><button type="button"><span aria-hidden="true">🔒</span><span><strong>セキュリティとプライバシー</strong><small>画面ロック、権限</small></span></button></li>
        <li><button type="button"><span aria-hidden="true">♿</span><span><strong>ユーザー補助</strong><small>表示サイズ、読み上げ</small></span></button></li>
      </ul>
    </div>
  );
}
