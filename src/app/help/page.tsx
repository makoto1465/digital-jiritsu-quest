import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { HelpSearchClient } from "@/features/search/HelpSearchClient";

export const metadata: Metadata = { title: "ヘルプ検索" };

export default function HelpPage() {
  return <div className="section-shell page-stack narrow-shell"><div className="page-heading centered-heading"><span className="heading-icon"><Icon name="search" size={31} /></span><p className="eyebrow">HELP SEARCH</p><h1>困ったことを調べる</h1><p>辞典・FAQ・解決記事をまとめて探せます。検索すること自体が練習です。</p></div><HelpSearchClient /></div>;
}
