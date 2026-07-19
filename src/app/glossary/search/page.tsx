import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GlossaryExplorer } from "@/features/search/GlossaryExplorer";

export const metadata: Metadata = { title: "用語を検索" };

export default async function GlossarySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <div className="section-shell page-stack"><nav className="breadcrumbs" aria-label="現在地"><Link href="/glossary">用語辞典</Link><Icon name="chevronRight" size={16} /><span aria-current="page">検索結果</span></nav><div className="page-heading compact-heading"><div><p className="eyebrow">GLOSSARY SEARCH</p><h1>用語を検索</h1><p>言い方を変えながら探すことも、調べる練習です。</p></div></div><GlossaryExplorer initialQuery={query} searchMode /></div>;
}
