import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "練習する機器を選ぶ" };

export default function StartPage() {
  return (
    <div className="section-shell page-stack">
      <div className="page-heading centered-heading">
        <p className="eyebrow">START PRACTICE</p>
        <h1>今日は、どちらを練習しますか？</h1>
        <p>いま見ている端末に関係なく選べます。あとからいつでも切り替えられます。</p>
      </div>
      <div className="device-choice-grid">
        <article className="device-choice-card device-pc">
          <div className="device-preview pc-preview"><Icon name="monitor" size={72} /><span>マウス・画面・ファイル</span></div>
          <div><span className="status-pill status-safe"><Icon name="shield" size={16} />練習用PC</span><h2>PCを練習する</h2><p>クリック、ウィンドウ、ブラウザ、ファイルなど、仕事や暮らしで使う基本を試します。</p>
            <ul className="check-list"><li><Icon name="check" />マウスで選ぶ</li><li><Icon name="check" />複数の画面を行き来する</li><li><Icon name="check" />ファイルを整理する</li></ul>
            <Link className="button button-primary button-block" href="/learn/pc">PCのWORLDへ <Icon name="arrowRight" /></Link>
          </div>
        </article>
        <article className="device-choice-card device-mobile">
          <div className="device-preview mobile-preview"><Icon name="smartphone" size={68} /><span>タップ・アプリ・共有</span></div>
          <div><span className="status-pill status-safe"><Icon name="shield" size={16} />練習用スマートフォン</span><h2>スマートフォンを練習する</h2><p>タップ、ホーム、アプリ、検索、共有など、日常でよく使う操作を試します。</p>
            <ul className="check-list"><li><Icon name="check" />タップして開く</li><li><Icon name="check" />戻る・ホームを使う</li><li><Icon name="check" />共有前に確認する</li></ul>
            <Link className="button button-primary button-block" href="/learn/mobile">スマホのWORLDへ <Icon name="arrowRight" /></Link>
          </div>
        </article>
      </div>
      <aside className="reassurance-banner"><Icon name="info" /><p><strong>どちらからでも大丈夫です</strong>順番や時間の決まりはありません。分からなくなったら、用語辞典やヒントをいつでも使えます。</p></aside>
    </div>
  );
}
