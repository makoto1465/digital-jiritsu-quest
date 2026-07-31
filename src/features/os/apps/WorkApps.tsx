"use client";

import { useState } from "react";

import { AppIcon, SystemGlyph } from "../OsIcons";
import { folderLabels, macFolderLabels, type AppProps, type StoredFile } from "../os-state";

const fileGlyph = (kind: StoredFile["kind"]) => (kind === "pdf" ? "PDF" : kind === "image" ? "JPG" : "TXT");

/* ------------------------------------------------------------------ メモ */

export function NotesApp({ os, world, update, emit }: AppProps) {
  const [menu, setMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState(os !== "android");

  const write = (value: string) => {
    update({ noteText: value });
    emit("text-edited", "メモへ文字を入力しました。");
  };

  if (os === "windows") {
    return (
      <div className="os-notepad">
        <nav className="os-notepad__menu" aria-label="メモ帳のメニュー">
          {["ファイル", "編集", "表示"].map((name) => (
            <button key={name} type="button" aria-expanded={menu === name} onClick={() => { setMenu(menu === name ? null : name); if (menu !== name) emit("menu-opened", `メモ帳の「${name}」メニューを開きました。`); }}>{name}</button>
          ))}
          {menu ? (
            <div className={`os-menu os-menu--notepad is-${menu === "ファイル" ? "file" : menu === "編集" ? "edit" : "view"}`} role="menu">
              {(menu === "ファイル" ? ["新規タブ", "開く…", "保存", "名前を付けて保存…", "印刷…", "終了"] : menu === "編集" ? ["元に戻す", "切り取り", "コピー", "貼り付け", "すべて選択"] : ["拡大", "縮小", "既定の倍率に戻す", "ステータス バー"]).map((item) => (
                <button key={item} role="menuitem" type="button" onClick={() => { setMenu(null); if (menu === "表示") emit("display-opened", "「表示」メニューから表示の設定を開きました。"); }}>{item}</button>
              ))}
            </div>
          ) : null}
        </nav>
        <textarea aria-label="メモ帳の本文" value={world.noteText} onChange={(event) => write(event.target.value)} spellCheck={false} />
        <footer className="os-notepad__status"><span>行 1、列 1</span><span>100%</span><span>Windows (CRLF)</span><span>UTF-8</span></footer>
      </div>
    );
  }

  if (os === "mac") {
    return (
      <div className="os-textedit">
        <div className="os-textedit__ruler" aria-hidden="true">
          <select defaultValue="ヒラギノ角ゴ"><option>ヒラギノ角ゴ</option><option>游ゴシック</option></select>
          <select defaultValue="12"><option>12</option><option>14</option><option>18</option></select>
          <span className="os-textedit__align"><b>≡</b><b>≡</b><b>≡</b></span>
        </div>
        <textarea aria-label="テキストエディットの本文" value={world.noteText} onChange={(event) => write(event.target.value)} spellCheck={false} />
      </div>
    );
  }

  if (os === "iphone") {
    return (
      <div className="os-ios-notes">
        <div className="os-ios-notes__nav">
          <button type="button" className="os-ios-back">{SystemGlyph.back}<span>メモ</span></button>
          <div>
            <button type="button" aria-label="共有">{SystemGlyph.share}</button>
            <button type="button" aria-label="その他">{SystemGlyph.more}</button>
            <button type="button" aria-label="新規メモ">✎</button>
          </div>
        </div>
        <p className="os-ios-notes__date">2026年7月31日 14:28</p>
        <input className="os-ios-notes__title" aria-label="メモのタイトル" value={world.noteTitle} onChange={(event) => update({ noteTitle: event.target.value })} />
        <textarea aria-label="メモの本文" value={world.noteText} onChange={(event) => write(event.target.value)} />
        <div className="os-ios-notes__toolbar" aria-hidden="true"><span>Aa</span><span>☑</span><span>✎</span><span>📷</span></div>
      </div>
    );
  }

  return (
    <div className="os-keep">
      {editing ? (
        <>
          <div className="os-keep__editnav">
            <button type="button" aria-label="戻る" onClick={() => setEditing(false)}>{SystemGlyph.back}</button>
            <div><button type="button" aria-label="固定">📌</button><button type="button" aria-label="リマインダー">🔔</button><button type="button" aria-label="アーカイブ">🗄</button></div>
          </div>
          <input className="os-keep__title" aria-label="メモのタイトル" value={world.noteTitle} onChange={(event) => update({ noteTitle: event.target.value })} placeholder="タイトル" />
          <textarea aria-label="メモの本文" value={world.noteText} onChange={(event) => write(event.target.value)} placeholder="メモを入力" />
          <div className="os-keep__editbar" aria-hidden="true"><span>＋</span><span>🎨</span><span>⋮</span><small>編集: 14:28</small></div>
        </>
      ) : (
        <>
          <div className="os-keep__search"><span aria-hidden="true">{SystemGlyph.search}</span><span>メモを検索</span><span className="os-keep__avatar" aria-hidden="true">み</span></div>
          <button className="os-keep__card" type="button" onClick={() => setEditing(true)}>
            <strong>{world.noteTitle}</strong>
            <span>{world.noteText}</span>
          </button>
          <button className="os-keep__card is-yellow" type="button" onClick={() => setEditing(true)}>
            <strong>買いもの</strong><span>お茶・氷</span>
          </button>
          <button className="os-keep__fab" type="button" aria-label="新しいメモ" onClick={() => setEditing(true)}>＋</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------- ファイル管理アプリ */

export function FilesApp({ os, world, update, emit }: AppProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [contextFor, setContextFor] = useState<string | null>(null);
  const labels = os === "mac" ? macFolderLabels : folderLabels;
  const visible = world.files.filter((file) => file.folder === world.filesFolder);

  const openFolder = (folder: StoredFile["folder"]) => {
    update({ filesFolder: folder, selectedFileId: null });
    emit("downloads-opened", `「${labels[folder]}」を開きました。`);
  };
  const commitRename = (file: StoredFile) => {
    setRenamingId(null);
    if (!renameDraft.trim() || renameDraft === file.name) return;
    update((current) => ({ files: current.files.map((item) => (item.id === file.id ? { ...item, name: renameDraft } : item)) }));
    emit("file-renamed", `ファイル名を「${renameDraft}」に変えました。`);
  };
  const moveFile = (file: StoredFile, folder: StoredFile["folder"]) => {
    update((current) => ({ files: current.files.map((item) => (item.id === file.id ? { ...item, folder } : item)) }));
    setContextFor(null);
    emit("file-moved", `「${file.name}」を「${labels[folder]}」へ移動しました。`);
  };

  const rows = visible.map((file) => (
    <tr
      key={file.id}
      className={world.selectedFileId === file.id ? "is-selected" : ""}
      onClick={() => update({ selectedFileId: file.id })}
      onContextMenu={(event) => { event.preventDefault(); update({ selectedFileId: file.id }); setContextFor(file.id); emit("context-opened", `「${file.name}」を${os === "windows" ? "右クリック" : "副ボタンクリック"}して、メニューを開きました。`); }}
    >
      <td>
        <span className={`os-filekind is-${file.kind}`} aria-hidden="true">{fileGlyph(file.kind)}</span>
        {renamingId === file.id ? (
          <input
            aria-label="新しいファイル名"
            autoFocus
            value={renameDraft}
            onChange={(event) => setRenameDraft(event.target.value)}
            onBlur={() => commitRename(file)}
            onKeyDown={(event) => { if (event.key === "Enter") commitRename(file); if (event.key === "Escape") setRenamingId(null); }}
          />
        ) : (
          <button type="button" onDoubleClick={() => emit("file-opened", `「${file.name}」を開きました。`)}>{file.name}</button>
        )}
      </td>
      <td>{file.date}</td>
      <td>{file.kind === "pdf" ? "PDF ファイル" : file.kind === "image" ? "JPG ファイル" : "テキスト ドキュメント"}</td>
      <td>{file.size}</td>
    </tr>
  ));

  const contextMenu = contextFor ? (
    <div className="os-menu os-menu--context" role="menu">
      <button role="menuitem" type="button" onClick={() => { const file = world.files.find((item) => item.id === contextFor); if (file) { emit("info-inspected", `「${file.name}」の種類・場所・サイズを確認しました。`); } setContextFor(null); }}>{os === "mac" ? "情報を見る" : "プロパティ"}</button>
      <button role="menuitem" type="button" onClick={() => { const file = world.files.find((item) => item.id === contextFor); if (file) { setRenameDraft(file.name); setRenamingId(file.id); } setContextFor(null); }}>名前の変更</button>
      <button role="menuitem" type="button" onClick={() => { const file = world.files.find((item) => item.id === contextFor); if (file) moveFile(file, file.folder === "documents" ? "downloads" : "documents"); }}>{os === "mac" ? "書類へ移動" : "ドキュメントへ移動"}</button>
      <button role="menuitem" type="button" onClick={() => setContextFor(null)}>コピー</button>
    </div>
  ) : null;

  if (os === "windows") {
    return (
      <div className="os-explorer" onClick={() => setContextFor(null)}>
        <div className="os-explorer__commandbar">
          <button type="button">＋ 新規</button>
          <span aria-hidden="true">|</span>
          <button type="button" aria-label="切り取り">✂</button>
          <button type="button" aria-label="コピー">⧉</button>
          <button type="button" aria-label="貼り付け">📋</button>
          <button type="button" aria-label="名前の変更" onClick={() => { const file = visible.find((item) => item.id === world.selectedFileId); if (file) { setRenameDraft(file.name); setRenamingId(file.id); } }}>✎</button>
          <button type="button" aria-label="削除">🗑</button>
          <span aria-hidden="true">|</span>
          <button type="button">↕ 並べ替え</button>
          <button type="button">▤ 表示</button>
        </div>
        <div className="os-explorer__address">
          <button type="button" aria-label="戻る">{SystemGlyph.back}</button>
          <button type="button" aria-label="進む" disabled>{SystemGlyph.forward}</button>
          <button type="button" aria-label="上へ">↑</button>
          <div className="os-explorer__crumbs"><AppIcon os="windows" app="files" size={15} /><span>PC</span><i>›</i><span>{labels[world.filesFolder]}</span></div>
          <div className="os-explorer__search"><span aria-hidden="true">{SystemGlyph.search}</span>{labels[world.filesFolder]}の検索</div>
        </div>
        <div className="os-explorer__body">
          <nav className="os-explorer__nav" aria-label="ナビゲーション ウィンドウ">
            <button type="button">🏠 ホーム</button>
            <button type="button">🖼 ギャラリー</button>
            <p>PC</p>
            <button type="button" aria-current={world.filesFolder === "downloads" ? "true" : undefined} onClick={() => openFolder("downloads")}>⤓ ダウンロード</button>
            <button type="button" aria-current={world.filesFolder === "documents" ? "true" : undefined} onClick={() => openFolder("documents")}>📄 ドキュメント</button>
            <button type="button" aria-current={world.filesFolder === "pictures" ? "true" : undefined} onClick={() => openFolder("pictures")}>🖼 ピクチャ</button>
            <button type="button">💻 ローカル ディスク (C:)</button>
          </nav>
          <div className="os-explorer__list">
            <table>
              <thead><tr><th>名前</th><th>更新日時</th><th>種類</th><th>サイズ</th></tr></thead>
              <tbody>{rows}</tbody>
            </table>
            {contextMenu}
          </div>
        </div>
        <footer className="os-explorer__status">{visible.length} 個の項目{world.selectedFileId ? "　1 個の項目を選択" : ""}</footer>
      </div>
    );
  }

  if (os === "mac") {
    return (
      <div className="os-finder" onClick={() => setContextFor(null)}>
        <div className="os-finder__toolbar">
          <div className="os-finder__nav"><button type="button" aria-label="戻る">{SystemGlyph.back}</button><button type="button" aria-label="進む" disabled>{SystemGlyph.forward}</button></div>
          <strong>{labels[world.filesFolder]}</strong>
          <div className="os-finder__tools"><span className="os-segment" aria-hidden="true"><b className="is-on">☰</b><b>▦</b><b>⫶</b></span><button type="button" aria-label="共有">{SystemGlyph.share}</button><button type="button" aria-label="検索">{SystemGlyph.search}</button></div>
        </div>
        <div className="os-finder__body">
          <nav className="os-finder__sidebar" aria-label="サイドバー">
            <p>よく使う項目</p>
            <button type="button">🛜 AirDrop</button>
            <button type="button">🕘 最近の項目</button>
            <button type="button" aria-current={world.filesFolder === "documents" ? "true" : undefined} onClick={() => openFolder("documents")}>📄 書類</button>
            <button type="button" aria-current={world.filesFolder === "downloads" ? "true" : undefined} onClick={() => openFolder("downloads")}>⤓ ダウンロード</button>
            <button type="button" aria-current={world.filesFolder === "pictures" ? "true" : undefined} onClick={() => openFolder("pictures")}>🖼 ピクチャ</button>
            <p>iCloud</p>
            <button type="button">☁ iCloud Drive</button>
          </nav>
          <div className="os-finder__list">
            <table>
              <thead><tr><th>名前</th><th>変更日</th><th>種類</th><th>サイズ</th></tr></thead>
              <tbody>{rows}</tbody>
            </table>
            {contextMenu}
          </div>
        </div>
        <footer className="os-finder__status">{visible.length} 項目、224.6 GB 空き</footer>
      </div>
    );
  }

  if (os === "iphone") {
    return (
      <div className="os-ios-files">
        <div className="os-ios-largetitle"><h1>{labels[world.filesFolder]}</h1><button type="button" aria-label="その他">{SystemGlyph.more}</button></div>
        <div className="os-ios-search"><span aria-hidden="true">{SystemGlyph.search}</span>検索</div>
        <div className="os-ios-group">
          {visible.map((file) => (
            <button className="os-ios-row" key={file.id} type="button" onClick={() => { update({ selectedFileId: file.id }); emit("file-opened", `「${file.name}」を開きました。`); }}>
              <span className={`os-filekind is-${file.kind}`} aria-hidden="true">{fileGlyph(file.kind)}</span>
              <span className="os-ios-row__text"><strong>{file.name}</strong><small>{file.date}　{file.size}</small></span>
              <span className="os-ios-chevron" aria-hidden="true">{SystemGlyph.chevronRight}</span>
            </button>
          ))}
        </div>
        <p className="os-ios-note">場所を変えるには、下の「ブラウズ」から選びます。</p>
        <nav className="os-ios-tabbar" aria-label="ファイルのタブ">
          <button type="button" aria-current="page" onClick={() => openFolder("downloads")}><span aria-hidden="true">🕘</span>最近使った項目</button>
          <button type="button" onClick={() => openFolder("documents")}><span aria-hidden="true">👥</span>共有</button>
          <button type="button" onClick={() => openFolder("pictures")}><span aria-hidden="true">📁</span>ブラウズ</button>
        </nav>
      </div>
    );
  }

  return (
    <div className="os-android-files">
      <div className="os-android-appbar"><strong>Files</strong><div><button type="button" aria-label="検索">{SystemGlyph.search}</button><button type="button" aria-label="その他">{SystemGlyph.moreVertical}</button></div></div>
      <div className="os-android-chips">
        {(["downloads", "documents", "pictures"] as const).map((folder) => (
          <button key={folder} type="button" aria-pressed={world.filesFolder === folder} onClick={() => openFolder(folder)}>{labels[folder]}</button>
        ))}
      </div>
      <ul className="os-android-list">
        {visible.map((file) => (
          <li key={file.id}>
            <button type="button" onClick={() => { update({ selectedFileId: file.id }); emit("file-opened", `「${file.name}」を開きました。`); }}>
              <span className={`os-filekind is-${file.kind}`} aria-hidden="true">{fileGlyph(file.kind)}</span>
              <span><strong>{file.name}</strong><small>{file.date}　{file.size}</small></span>
              <span className="os-android-more" aria-hidden="true">{SystemGlyph.moreVertical}</span>
            </button>
          </li>
        ))}
      </ul>
      <nav className="os-android-bottomnav" aria-label="Files のタブ"><button type="button" aria-current="page">🕘 最近</button><button type="button">▦ カテゴリ</button><button type="button">📁 ブラウズ</button></nav>
    </div>
  );
}

/* ------------------------------------------------------------------ メール */

const messages = [
  { id: "kominkan", from: "みどり市 中央公民館", subject: "夏祭りのご案内", time: "14:02", body: "7月19日（土）午前10時から中央公民館で夏祭りを行います。持ちものは青いタオルです。返信は不要です。", safe: true },
  { id: "family", from: "田中 さとし", subject: "写真ありがとう", time: "昨日", body: "先日の写真、届きました。とても良く撮れていますね。", safe: true },
  { id: "phish", from: "セキュリティ通知", subject: "【緊急】本日中にご確認ください", time: "7/29", body: "アカウントが停止されます。下のリンクから確認してください。", safe: false },
];

export function MailApp({ os, world, update, emit }: AppProps) {
  const open = messages.find((message) => message.id === world.mailOpenId) ?? null;
  const select = (id: string) => {
    update({ mailOpenId: id });
    const message = messages.find((item) => item.id === id);
    emit(message?.safe ? "mail-opened" : "suspicious-opened", message?.safe ? `「${message.subject}」を開きました。` : "急がせるメールを開きました。リンクを押す前に送信元を確かめましょう。");
  };
  const list = (
    <ul className="os-mail__list">
      {messages.map((message) => (
        <li key={message.id}>
          <button type="button" aria-current={world.mailOpenId === message.id ? "true" : undefined} onClick={() => select(message.id)}>
            <span className="os-mail__avatar" aria-hidden="true">{message.from.slice(0, 1)}</span>
            <span className="os-mail__meta"><strong>{message.from}</strong><span>{message.subject}</span><small>{message.body}</small></span>
            <time>{message.time}</time>
          </button>
        </li>
      ))}
    </ul>
  );
  const reader = open ? (
    <article className="os-mail__reader">
      {os === "iphone" || os === "android" ? <button className="os-mail__back" type="button" onClick={() => update({ mailOpenId: null })}>{SystemGlyph.back}<span>受信</span></button> : null}
      <h2>{open.subject}</h2>
      <p className="os-mail__from"><span aria-hidden="true">{open.from.slice(0, 1)}</span><strong>{open.from}</strong><small>{open.safe ? "info@city.midori.example" : "notice@mid0ri-support.example"}</small></p>
      <p className="os-mail__body">{open.body}</p>
      {open.safe ? null : <p className="os-mail__warning">送信元のつづりが公式と違います（0 と o）。リンクは押さず、公式アプリから確かめます。</p>}
      <div className="os-mail__actions"><button type="button" onClick={() => emit("mail-replied", "返信画面を開きました。練習なので外部へは送信されません。")}>↩ 返信</button><button type="button">↪ 転送</button><button type="button">🗑 削除</button></div>
    </article>
  ) : (
    <div className="os-mail__empty"><p>左のメールを{os === "windows" ? "クリック" : "選択"}すると、ここに内容が出ます。</p></div>
  );

  if (os === "iphone" || os === "android") {
    return (
      <div className={`os-mail os-mail--${os}`}>
        {open ? reader : (
          <>
            {os === "iphone" ? <div className="os-ios-largetitle"><h1>受信</h1><button type="button" aria-label="編集">編集</button></div> : <div className="os-android-appbar"><span className="os-android-searchpill"><span aria-hidden="true">{SystemGlyph.search}</span>メールを検索</span><span className="os-keep__avatar" aria-hidden="true">み</span></div>}
            {list}
            {os === "android" ? <button className="os-android-fab" type="button" onClick={() => emit("mail-compose", "作成画面を開きました。")}>✎ 作成</button> : null}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`os-mail os-mail--${os}`}>
      <div className="os-mail__pane">
        <div className="os-mail__panehead"><strong>受信トレイ</strong><button type="button" onClick={() => emit("mail-compose", "新しいメールの作成画面を開きました。")}>✎ 新規メール</button></div>
        {list}
      </div>
      {reader}
    </div>
  );
}

/* ------------------------------------------------------------------ 写真 */

const photos = ["#e0a04f", "#6ba3d6", "#7fae72", "#c98a5a", "#b58ad1", "#d98686", "#8fbfae", "#c9a86a", "#7f92c4"].map((color, index) => ({
  id: `photo-${index}`,
  color,
  label: ["夏祭りポスター", "公民館の入口", "会場の地図", "受付の看板", "夕方の広場", "屋台の列", "花火", "帰り道", "記念写真"][index],
}));

export function PhotosApp({ os, emit }: AppProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = photos.find((photo) => photo.id === openId);
  return (
    <div className={`os-photos is-${os}`}>
      {open ? (
        <div className="os-photos__detail">
          <button type="button" className="os-photos__back" onClick={() => setOpenId(null)}>{SystemGlyph.back}<span>すべての写真</span></button>
          <div className="os-photos__large" style={{ background: open.color }} aria-label={`${open.label}の練習写真`} role="img" />
          <p>{open.label}　2026年7月28日</p>
          <div className="os-photos__actions"><button type="button" onClick={() => emit("photo-shared", "共有メニューを開きました。練習なので外部へは送られません。")}>{SystemGlyph.share}<span>共有</span></button><button type="button">♡ お気に入り</button><button type="button">🗑 削除</button></div>
        </div>
      ) : (
        <>
          <div className={os === "iphone" || os === "android" ? "os-ios-largetitle" : "os-photos__head"}><h1>写真</h1><span>2026年7月</span></div>
          <div className="os-photos__grid">
            {photos.map((photo) => (
              <button key={photo.id} type="button" style={{ background: photo.color }} onClick={() => { setOpenId(photo.id); emit("photo-opened", `「${photo.label}」を開きました。`); }}>
                <span className="sr-only">{photo.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ 電卓 */

const calcKeys = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "＋"],
  ["0", ".", "="],
];

export function CalculatorApp({ os, world, update }: AppProps) {
  const press = (key: string) => {
    update((current) => {
      const display = current.calcDisplay;
      if (key === "C") return { calcDisplay: "0" };
      if (key === "=") {
        try {
          const expression = display.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/＋/g, "+");
          if (!/^[-0-9+*/.\s]+$/.test(expression)) return { calcDisplay: display };
          const result = Function(`"use strict";return (${expression})`)() as number;
          return { calcDisplay: Number.isFinite(result) ? String(Math.round(result * 1e8) / 1e8) : "エラー" };
        } catch { return { calcDisplay: "エラー" }; }
      }
      if (key === "±") return { calcDisplay: display.startsWith("-") ? display.slice(1) : `-${display}` };
      if (key === "%") return { calcDisplay: String(Number(display) / 100) };
      return { calcDisplay: display === "0" && /[0-9.]/.test(key) ? key : display + key };
    });
  };
  return (
    <div className={`os-calc is-${os}`}>
      {os === "windows" ? <p className="os-calc__mode">≡ 標準</p> : null}
      <output className="os-calc__display">{world.calcDisplay}</output>
      <div className="os-calc__keys">
        {calcKeys.flatMap((row, rowIndex) => row.map((key) => (
          <button
            key={`${rowIndex}-${key}`}
            className={`${"÷×−＋=".includes(key) ? "is-operator" : ""}${key === "0" ? " is-wide" : ""}${"C±%".includes(key) ? " is-function" : ""}`}
            type="button"
            onClick={() => press(key)}
          >{key}</button>
        )))}
      </div>
    </div>
  );
}
