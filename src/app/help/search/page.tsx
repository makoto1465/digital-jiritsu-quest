import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { HelpSearchClient } from "@/features/search/HelpSearchClient";

export const metadata: Metadata = { title: "ヘルプ検索結果" };

export default async function HelpSearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <div className="section-shell page-stack narrow-shell"><nav className="breadcrumbs" aria-label="現在地"><Link href="/help">ヘルプ検索</Link><Icon name="chevronRight" size={16} /><span aria-current="page">検索結果</span></nav><div className="page-heading compact-heading"><div><p className="eyebrow">HELP SEARCH RESULTS</p><h1>解決方法を探す</h1><p>答えを見比べながら、自分の状況に近いものを選びましょう。</p></div></div><HelpSearchClient initialQuery={query} /></div>;
}
