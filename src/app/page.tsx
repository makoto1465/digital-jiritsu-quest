import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TermButton } from "@/components/ui/TermButton";

export default function Home() {
  return (
    <>
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">DIGITAL JIRITSU QUEST</p>
          <h1 id="hero-title">
            分からなくても、<br />
            <span>自分で進める。</span>
          </h1>
          <p className="hero-lead">
            試して、調べて、戻してみる。安全な練習画面で、初めて見るデジタルにも向き合える力を育てます。
          </p>
          <div className="button-row">
            <Link className="button button-primary button-large" href="/start">
              <Icon name="play" size={21} />
              練習をはじめる
            </Link>
            <Link className="button button-secondary button-large" href="/free-play/pc">
              <Icon name="practice" size={21} />
              自由に試す
            </Link>
          </div>
          <p className="hero-note">
            <Icon name="shield" size={20} />
            登録不要・時間制限なし・本物のデータは変わりません
          </p>
        </div>
        <div className="hero-map" aria-label="試す、調べる、戻すを繰り返して自信へ進む図">
          <div className="map-card map-card-a">
            <span className="map-icon"><Icon name="practice" /></span>
            <strong>試してみる</strong>
            <small>気になる場所を押す</small>
          </div>
          <div className="map-path" aria-hidden="true" />
          <div className="map-card map-card-b">
            <span className="map-icon"><Icon name="search" /></span>
            <strong>調べてみる</strong>
            <small>ことばやヒントを探す</small>
          </div>
          <div className="map-card map-card-c">
            <span className="map-icon"><Icon name="undo" /></span>
            <strong>戻してみる</strong>
            <small>何度でもやり直せる</small>
          </div>
          <div className="map-finish">
            <Icon name="award" size={30} />
            <span>自分でできた</span>
          </div>
        </div>
      </section>

      <section className="section-shell home-section" aria-labelledby="start-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">CHOOSE YOUR PRACTICE</p>
            <h2 id="start-heading">どちらから練習しますか？</h2>
          </div>
          <p>いま使っている機器とは違う方を選んでも大丈夫です。</p>
        </div>
        <div className="choice-grid">
          <Link className="choice-card choice-card-pc" href="/learn/pc">
            <span className="choice-illustration"><Icon name="monitor" size={56} /></span>
            <span>
              <small>マウスやウィンドウに慣れる</small>
              <strong>PCを練習する</strong>
              <span className="card-link">7つのWORLDを見る <Icon name="arrowRight" size={19} /></span>
            </span>
          </Link>
          <Link className="choice-card choice-card-mobile" href="/learn/mobile">
            <span className="choice-illustration"><Icon name="smartphone" size={50} /></span>
            <span>
              <small>タップやアプリに慣れる</small>
              <strong>スマートフォンを練習する</strong>
              <span className="card-link">7つのWORLDを見る <Icon name="arrowRight" size={19} /></span>
            </span>
          </Link>
        </div>
      </section>

      <section className="section-shell confidence-section" aria-labelledby="confidence-heading">
        <div className="confidence-copy">
          <p className="eyebrow">A SAFE PLACE TO LEARN</p>
          <h2 id="confidence-heading">「間違えた」も、ここでは前進です。</h2>
          <p>
            このアプリは、正しい場所を一度で押すゲームではありません。別の場所を開いたら、何が起きたかを見て戻る。その経験も、きちんと記録します。
          </p>
          <p>
            分からない言葉は、たとえば <TermButton termId="browser" /> のように、その場で意味を確認できます。
          </p>
        </div>
        <ul className="confidence-list">
          <li><Icon name="shield" /><span><strong>安全に試す</strong>本物の送信・削除・購入は起きません</span></li>
          <li><Icon name="search" /><span><strong>自分で調べる</strong>辞典・FAQ・ヘルプ検索を練習できます</span></li>
          <li><Icon name="undo" /><span><strong>元に戻す</strong>1つ前・やり直し・初期状態を使えます</span></li>
        </ul>
      </section>

      <section className="section-shell quick-links" aria-label="すぐに使える機能">
        <Link href="/glossary"><Icon name="book" /><span><strong>用語辞典</strong>知らない言葉をやさしく確認</span><Icon name="chevronRight" /></Link>
        <Link href="/faq"><Icon name="help" /><span><strong>困ったとき</strong>FAQと検索で解決を練習</span><Icon name="chevronRight" /></Link>
        <Link href="/progress"><Icon name="progress" /><span><strong>進み具合</strong>できるようになったことを見る</span><Icon name="chevronRight" /></Link>
      </section>
    </>
  );
}
