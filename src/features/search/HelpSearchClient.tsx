"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faqItems, glossaryTerms, helpArticles } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { TermButton } from "@/components/ui/TermButton";

function normalize(value: string) { return value.normalize("NFKC").toLocaleLowerCase("ja").replace(/\s+/g, ""); }

export function HelpSearchClient({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const normalized = normalize(query);
  const results = useMemo(() => {
    if (!normalized) return { articles: helpArticles.slice(0, 4), faqs: faqItems.slice(0, 4), terms: glossaryTerms.slice(0, 6) };
    return {
      articles: helpArticles.filter((item) => normalize(`${item.title}${item.summary}${item.body}${item.keywords.join("")}`).includes(normalized)),
      faqs: faqItems.filter((item) => normalize(`${item.question}${item.answer}${item.keywords.join("")}`).includes(normalized)),
      terms: glossaryTerms.filter((item) => normalize(`${item.term}${item.reading}${item.description}`).includes(normalized)),
    };
  }, [normalized]);
  const total = results.articles.length + results.faqs.length + results.terms.length;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); router.push(`/help/search?q=${encodeURIComponent(query.trim())}`); };
  return (
    <>
      <form className="search-hero-form help-search-form" role="search" onSubmit={submit}><label htmlFor="help-search">いま、何に困っていますか？</label><div><Icon name="search" /><input id="help-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：ファイルが見つからない" /><button className="button button-primary" type="submit">調べる</button></div><p>「何をしたいか」＋「どうなったか」を入れると見つけやすくなります。</p></form>
      <div className="results-summary" aria-live="polite"><p>{query ? <>「<strong>{query}</strong>」に関連する </> : "よく使われる "}<strong>{total}</strong> 件</p></div>
      {total === 0 ? <div className="no-results"><Icon name="search" size={40} /><h2>別の短い言葉で試してみましょう</h2><p>「ログインできません」→「ログイン」のように、中心の言葉だけにすると見つかることがあります。</p><button className="button button-secondary" type="button" onClick={() => setQuery("")}>入力を消す</button></div> : (
        <div className="search-sections">
          {results.articles.length ? <section><div className="result-section-heading"><Icon name="help" /><h2>解決のヒント</h2><span>{results.articles.length}件</span></div><div className="article-results">{results.articles.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.summary}</p><ol>{item.steps.slice(0, 3).map((step) => <li key={step}>{step}</li>)}</ol></article>)}</div></section> : null}
          {results.faqs.length ? <section><div className="result-section-heading"><Icon name="message" /><h2>よくある質問</h2><span>{results.faqs.length}件</span></div><div className="faq-list">{results.faqs.map((item) => <details key={item.id}><summary>{item.question}<Icon name="chevronDown" /></summary><p>{item.answer}</p></details>)}</div><Link className="text-link" href="/faq">FAQをすべて見る <Icon name="arrowRight" /></Link></section> : null}
          {results.terms.length ? <section><div className="result-section-heading"><Icon name="book" /><h2>関連する用語</h2><span>{results.terms.length}件</span></div><div className="term-chip-list">{results.terms.map((term) => <TermButton termId={term.id} key={term.id} />)}</div></section> : null}
        </div>
      )}
    </>
  );
}
