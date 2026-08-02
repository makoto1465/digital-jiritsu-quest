import type { Metadata } from "next";
import { DigitalCheckExperience } from "@/features/digital-check/DigitalCheckExperience";

export const metadata: Metadata = {
  title: "自分に合うデジタル説明をつくる",
  description: "短い質問に答えて、ChatGPTのカスタム指示へ追加できる、自分に合ったデジタル操作の説明項目を作ります。",
};

export default function DigitalCheckPage() {
  return <DigitalCheckExperience />;
}
