"use client";

import { useState } from "react";

import { AppIcon, SystemGlyph } from "../OsIcons";
import type { AppProps } from "../os-state";

const facilityUrl = "www.city.midori.example/kominkan";
const searchUrl = (query: string) => `www.google.co.jp/search?q=${query.replace(/\s+/g, "+")}`;

function searchLabel(os: AppProps["os"]) {
  return os === "android" ? "検索語句またはウェブアドレスを入力" : os === "windows" ? "検索または Web アドレスを入力します" : "検索または Web サイト名を入力";
}

/** 検索結果・施設ページ。4つのOSで同じ内容を出し、外側の見た目だけ各ブラウザに合わせる。 */
function BrowserPage({ os, world, update, emit }: AppProps) {
  const runSearch = (query: string) => {
    if (!query.trim()) return;
    update({ browserQuery: query, browserPage: "results" });
    emit("useful-query", `「${query}」で検索しました。`);
  };
  const openFacility = () => {
    update({ browserPage: "facility" });
    emit("page-opened", "検索結果から中央公民館の施設案内を開きました。");
  };

  if (world.browserPage === "start") {
    return (
      <div className={`os-web os-web--start is-${os}`}>
        {os === "android" ? <p className="os-web__wordmark"><span>G</span>oogle</p> : null}
        {os === "windows" ? <p className="os-web__wordmark os-web__wordmark--edge">Microsoft Edge へようこそ</p> : null}
        {os === "mac" || os === "iphone" ? <p className="os-web__favorites-title">お気に入り</p> : null}
        {os === "windows" || os === "android" ? (
          <form className="os-web__searchbox" onSubmit={(event) => { event.preventDefault(); runSearch(world.browserQuery || "みどり市 中央公民館"); }}>
            <span aria-hidden="true">{SystemGlyph.search}</span>
            <input aria-label="検索キーワード" value={world.browserQuery} placeholder="検索キーワードを入力" onChange={(event) => update({ browserQuery: event.target.value })} />
            <button type="submit">検索</button>
          </form>
        ) : null}
        <div className="os-web__favorites">
          {[["みどり市 公式", "#0b6bb5"], ["天気", "#e08b2a"], ["地図", "#3d8f4e"], ["ニュース", "#8b4bb5"]].map(([name, color]) => (
            <button key={name} type="button" onClick={() => runSearch("みどり市 中央公民館")}>
              <span style={{ background: color }} aria-hidden="true">{name.slice(0, 1)}</span>
              <small>{name}</small>
            </button>
          ))}
        </div>
        <p className="os-web__hint">「みどり市 中央公民館」と検索すると、練習用の結果が出ます。</p>
      </div>
    );
  }

  if (world.browserPage === "results") {
    return (
      <div className={`os-web os-web--results is-${os}`}>
        <form className="os-web__result-search" onSubmit={(event) => { event.preventDefault(); runSearch(world.browserQuery); }}>
          <span aria-hidden="true">{SystemGlyph.search}</span>
          <input aria-label="検索キーワード" value={world.browserQuery} onChange={(event) => update({ browserQuery: event.target.value })} />
        </form>
        <p className="os-web__result-count">約 4,120 件（0.42 秒）</p>
        <article className="os-web__result">
          <p className="os-web__result-site"><span aria-hidden="true">市</span>みどり市公式ホームページ<small>https://{facilityUrl}</small></p>
          <button type="button" onClick={openFacility}>中央公民館｜施設案内 - みどり市</button>
          <p>2026年7月18日 — 中央公民館の開館時間、休館日、所在地、駐車場のご案内です。夏祭りの受付会場もこちらです。</p>
        </article>
        <article className="os-web__result">
          <p className="os-web__result-site"><span aria-hidden="true">ブ</span>まち歩きブログ<small>https://midori-life.example/diary</small></p>
          <button type="button" onClick={() => emit("blog-opened", "個人ブログの記事を開きました。日付を確かめましょう。")}>中央公民館へ行ってきました</button>
          <p>2022年4月2日 — 当時は午後8時まで開いていました。※個人の感想です。</p>
        </article>
        <article className="os-web__result">
          <p className="os-web__result-site"><span aria-hidden="true">地</span>地図で見る<small>https://maps.example/midori</small></p>
          <button type="button" onClick={() => emit("map-opened", "地図の結果を開きました。")}>中央公民館 - 地図</button>
          <p>みどり市中央3丁目1-1 ・ 徒歩8分</p>
        </article>
      </div>
    );
  }

  return (
    <div className={`os-web os-web--site is-${os}`}>
      <header className="os-web__site-header">
        <p><span aria-hidden="true">市</span>みどり市</p>
        <nav aria-label="サイト内メニュー"><span>くらし</span><span>手続き</span><span>施設</span><span>市政</span></nav>
      </header>
      <p className="os-web__breadcrumb">ホーム ＞ 施設 ＞ 中央公民館</p>
      <h1>中央公民館 施設案内</h1>
      <table>
        <tbody>
          <tr><th>開館時間</th><td>午前9時 〜 午後8時</td></tr>
          <tr><th>休館日</th><td>毎週月曜日・年末年始</td></tr>
          <tr><th>所在地</th><td>みどり市中央3丁目1-1</td></tr>
          <tr><th>電話</th><td>000-1234-5678（練習用）</td></tr>
        </tbody>
      </table>
      <p className="os-web__updated">最終更新日：2026年7月18日　担当：みどり市 生涯学習課</p>
      <button className="os-web__site-action" type="button" onClick={() => emit("source-checked", "発信元が「みどり市」の公式ページだと確認しました。")}>このページの発信元を確認する</button>
    </div>
  );
}

function useBrowserNav({ world, update, emit }: AppProps) {
  const canGoBack = world.browserPage !== "start";
  const goBack = () => {
    if (world.browserPage === "facility") {
      update({ browserPage: "results" });
      emit("went-back", "「戻る」で、ひとつ前の検索結果へ戻りました。");
      return;
    }
    if (world.browserPage === "results") {
      update({ browserPage: "start" });
      emit("went-back", "「戻る」で、ひとつ前の画面へ戻りました。");
    }
  };
  const address = world.browserPage === "facility" ? facilityUrl : world.browserPage === "results" ? searchUrl(world.browserQuery) : "www.google.co.jp";
  return { canGoBack, goBack, address };
}

export function BrowserApp(props: AppProps) {
  const { os, world, update, emit } = props;
  const { canGoBack, goBack, address } = useBrowserNav(props);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState<string | null>(null);

  const submitAddress = (value: string) => {
    setAddressDraft(null);
    if (!value.trim()) return;
    update({ browserQuery: value, browserPage: "results" });
    emit("useful-query", `「${value}」で検索しました。`);
  };

  const openMenu = (open: boolean) => {
    setMenuOpen(open);
    if (open) emit("menu-opened", "ブラウザのメニューを開きました。");
  };

  const enlargeText = () => {
    update((current) => ({ textScale: Math.min(150, current.textScale + 10) }));
    setMenuOpen(false);
    emit("display-opened", "表示メニューから、文字の大きさを変えました。");
  };

  if (os === "windows") {
    return (
      <div className="os-edge">
        <div className="os-edge__tabs">
          <div className="os-edge__tab is-active">
            <AppIcon os="windows" app="browser" size={15} />
            <span>{world.browserPage === "facility" ? "中央公民館｜施設案内" : world.browserPage === "results" ? `${world.browserQuery} - Google 検索` : "新しいタブ"}</span>
            <button type="button" aria-label="タブを閉じる">✕</button>
          </div>
          <button className="os-edge__newtab" type="button" aria-label="新しいタブ">＋</button>
        </div>
        <div className="os-edge__toolbar">
          <button type="button" aria-label="戻る" disabled={!canGoBack} onClick={goBack}>{SystemGlyph.back}</button>
          <button type="button" aria-label="進む" disabled>{SystemGlyph.forward}</button>
          <button type="button" aria-label="更新">{SystemGlyph.reload}</button>
          <form className="os-edge__address" onSubmit={(event) => { event.preventDefault(); submitAddress(addressDraft ?? address); }}>
            <span aria-hidden="true">{SystemGlyph.lock}</span>
            <input aria-label="アドレス バーと検索ボックス" value={addressDraft ?? address} placeholder={searchLabel(os)} onChange={(event) => setAddressDraft(event.target.value)} />
          </form>
          <button type="button" aria-label="お気に入りに追加">☆</button>
          <button type="button" aria-label="設定など" onClick={() => openMenu(!menuOpen)}>{SystemGlyph.more}</button>
          {menuOpen ? (
            <div className="os-menu os-menu--edge" role="menu">
              <button role="menuitem" type="button" onClick={enlargeText}>ズーム　－　{world.textScale}%　＋</button>
              <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>お気に入り</button>
              <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>閲覧データをクリア</button>
              <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>設定</button>
            </div>
          ) : null}
        </div>
        <div className="os-edge__page" style={{ fontSize: `${world.textScale}%` }}><BrowserPage {...props} /></div>
      </div>
    );
  }

  if (os === "mac") {
    return (
      <div className="os-safari">
        <div className="os-safari__toolbar">
          <div className="os-safari__nav">
            <button type="button" aria-label="戻る" disabled={!canGoBack} onClick={goBack}>{SystemGlyph.back}</button>
            <button type="button" aria-label="進む" disabled>{SystemGlyph.forward}</button>
          </div>
          <form className="os-safari__address" onSubmit={(event) => { event.preventDefault(); submitAddress(addressDraft ?? address); }}>
            <span aria-hidden="true">{SystemGlyph.lock}</span>
            <input aria-label="スマート検索フィールド" value={addressDraft ?? address} placeholder={searchLabel(os)} onChange={(event) => setAddressDraft(event.target.value)} />
            <button type="button" aria-label="このページを再読み込み">{SystemGlyph.reload}</button>
          </form>
          <div className="os-safari__actions">
            <button type="button" aria-label="共有">{SystemGlyph.share}</button>
            <button type="button" aria-label="新規タブ">{SystemGlyph.plus}</button>
            <button type="button" aria-label="タブの概要">▦</button>
          </div>
        </div>
        <div className="os-safari__page" style={{ fontSize: `${world.textScale}%` }}><BrowserPage {...props} /></div>
      </div>
    );
  }

  if (os === "iphone") {
    return (
      <div className="os-ios-safari">
        <div className="os-ios-safari__page" style={{ fontSize: `${world.textScale}%` }}><BrowserPage {...props} /></div>
        <div className="os-ios-safari__bar">
          <div className="os-ios-safari__address">
            <button type="button" aria-label="ページの表示設定" onClick={() => openMenu(!menuOpen)}>ぁA</button>
            <span>{address}</span>
            <button type="button" aria-label="再読み込み">{SystemGlyph.reload}</button>
          </div>
          <div className="os-ios-safari__tools">
            <button type="button" aria-label="戻る" disabled={!canGoBack} onClick={goBack}>{SystemGlyph.back}</button>
            <button type="button" aria-label="進む" disabled>{SystemGlyph.forward}</button>
            <button type="button" aria-label="共有">{SystemGlyph.share}</button>
            <button type="button" aria-label="ブックマーク">📖</button>
            <button type="button" aria-label="タブ">⧉</button>
          </div>
        </div>
        {menuOpen ? (
          <div className="os-sheet os-sheet--ios" role="dialog" aria-label="表示メニュー">
            <div className="os-sheet__row"><button type="button" onClick={() => { update((current) => ({ textScale: Math.max(75, current.textScale - 10) })); }}>ぁ</button><strong>{world.textScale}%</strong><button type="button" onClick={enlargeText}>Ａ</button></div>
            <button className="os-sheet__item" type="button" onClick={() => setMenuOpen(false)}>デスクトップ用 Web サイトを表示</button>
            <button className="os-sheet__item" type="button" onClick={() => setMenuOpen(false)}>リーダーを表示</button>
            <button className="os-sheet__close" type="button" onClick={() => setMenuOpen(false)}>閉じる</button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="os-chrome">
      <div className="os-chrome__bar">
        <div className="os-chrome__address">
          <span aria-hidden="true">{SystemGlyph.lock}</span>
          <span>{address}</span>
        </div>
        <button className="os-chrome__tabcount" type="button" aria-label="タブ切り替え">1</button>
        <button type="button" aria-label="その他のオプション" onClick={() => openMenu(!menuOpen)}>{SystemGlyph.moreVertical}</button>
      </div>
      {canGoBack ? null : null}
      <div className="os-chrome__page" style={{ fontSize: `${world.textScale}%` }}><BrowserPage {...props} /></div>
      {menuOpen ? (
        <div className="os-menu os-menu--chrome" role="menu">
          <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>新しいタブ</button>
          <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>ブックマーク</button>
          <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>履歴</button>
          <button role="menuitem" type="button" onClick={enlargeText}>テキストのサイズ変更（{world.textScale}%）</button>
          <button role="menuitem" type="button" onClick={() => setMenuOpen(false)}>設定</button>
        </div>
      ) : null}
    </div>
  );
}
