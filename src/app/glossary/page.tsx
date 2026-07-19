import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { GlossaryExplorer } from "@/features/search/GlossaryExplorer";

export const metadata: Metadata = { title: "用語辞典" };

export default function GlossaryPage() {
  return <div className="section-shell page-stack"><div className="page-heading centered-heading"><span className="heading-icon"><Icon name="book" size={32} /></span><p className="eyebrow">GLOSSARY</p><h1>用語辞典</h1><p>知らない言葉を、その場でやさしく確認できます。全部覚える必要はありません。</p></div><GlossaryExplorer /></div>;
}
