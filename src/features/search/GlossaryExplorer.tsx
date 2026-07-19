"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { glossaryTerms } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { TermButton } from "@/components/ui/TermButton";

const categoryLabels: Record<string, string> = {
  screen: "画面の見方", internet: "インターネット", account: "アカウント", file: "ファイル", operation: "基本操作", help: "調べる・解決", safety: "安全",
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja").replace(/\s+/g, "");
}

export function GlossaryExplorer({ initialQuery = "", searchMode = false }: { initialQuery?: string; searchMode?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const router = useRouter();
  const results = useMemo(() => {
    const needle = normalize(query);
    return glossaryTerms.filter((term) => {
      const categoryMatch = category === "all" || term.category === category;
      const text = normalize(`${term.term}${term.reading}${term.shortDescription}${term.description}${term.example}`);
      return categoryMatch && (!needle || text.includes(needle));
    });
  }, [category, query]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/glossary/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <form className="search-hero-form" role="search" onSubmit={submit}>
        <label htmlFor="glossary-search">どんな言葉を調べますか？</label>
        <div><Icon name="search" /><input id="glossary-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：ブラウザ、ダウンロード、戻る" autoComplete="off" /><button className="button button-primary" type="submit">検索する</button></div>
        <p>短い言葉でも大丈夫です。ひらがなやカタカナでも探せます。</p>
      </form>
      <div className="category-filter" aria-label="用語の種類">
        <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>すべて</button>
        {Object.entries(categoryLabels).map(([id, label]) => <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}
      </div>
      <div className="results-summary" aria-live="polite"><p>{searchMode && initialQuery ? <><strong>「{initialQuery}」</strong> の検索結果：</> : null}<strong>{results.length}</strong> 語が見つかりました</p></div>
      {results.length > 0 ? (
        <div className="glossary-grid">
          {results.map((term) => (
            <article className="term-card" id={`term-${term.id}`} key={term.id}>
              <div className="term-card-heading"><span>{categoryLabels[term.category]}</span><small>{term.reading}</small></div>
              <h2>{term.term}</h2><p className="term-card-short">{term.shortDescription}</p><p>{term.description}</p>
              <div className="example-box"><strong>たとえば</strong><p>{term.example}</p></div>
              {term.tryIt ? <p className="try-it"><Icon name="practice" /><span><strong>実際に試すなら</strong>{term.tryIt}</span></p> : null}
              <TermButton termId={term.id}>ミニ解説で見る</TermButton>
            </article>
          ))}
        </div>
      ) : (
        <div className="no-results"><Icon name="search" size={40} /><h2>まだ見つかりませんでした</h2><p>「ファイルを保存する」なら「保存」のように、短い言葉にしてみましょう。</p><button className="button button-secondary" type="button" onClick={() => setQuery("")}>検索をやり直す</button></div>
      )}
    </>
  );
}
