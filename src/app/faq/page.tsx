import type { Metadata } from "next";
import Link from "next/link";
import { faqItems } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { TermButton } from "@/components/ui/TermButton";

export const metadata: Metadata = { title: "よくある質問" };

export default function FaqPage() {
  return (
    <div className="section-shell page-stack narrow-shell">
      <div className="page-heading centered-heading"><span className="heading-icon"><Icon name="help" size={32} /></span><p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h1>よくある質問</h1><p>困ったときに答えを探すことも、デジタルの練習です。</p><Link className="button button-primary" href="/help"><Icon name="search" />困りごとを検索する</Link></div>
      <aside className="search-tip"><Icon name="lightbulb" /><p><strong>調べるコツ</strong>質問を全部読まなくても、太字や自分と似た言葉から探して大丈夫です。</p></aside>
      <div className="faq-list large-faq-list">
        {faqItems.map((item) => (
          <details key={item.id}><summary>{item.question}<Icon name="chevronDown" /></summary><div className="faq-answer"><p>{item.answer}</p>{item.relatedGlossaryTermIds.length ? <div className="related-terms"><strong>関連する言葉</strong>{item.relatedGlossaryTermIds.slice(0, 3).map((termId) => <TermButton termId={termId} key={termId} />)}</div> : null}</div></details>
        ))}
      </div>
      <aside className="help-callout"><Icon name="message" size={30} /><div><h2>まだ解決しないときは</h2><p>やりたいことと、画面に出た言葉を組み合わせて検索してみましょう。</p></div><Link className="button button-secondary" href="/help">ヘルプ検索へ</Link></aside>
    </div>
  );
}
