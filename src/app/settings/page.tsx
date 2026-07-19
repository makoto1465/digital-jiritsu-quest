import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { SettingsPanel } from "@/features/settings/SettingsPanel";

export const metadata: Metadata = { title: "設定" };

export default function SettingsPage() {
  return <div className="section-shell page-stack narrow-shell"><div className="page-heading centered-heading"><span className="heading-icon"><Icon name="settings" size={31} /></span><p className="eyebrow">SETTINGS</p><h1>使いやすさの設定</h1><p>文字の大きさや画面の動きを、自分に合うように変えられます。</p></div><SettingsPanel /></div>;
}
