import type { Metadata } from "next";
import { StartExperience } from "@/features/journey/StartExperience";

export const metadata: Metadata = {
  title: "練習環境を選ぶ",
  description:
    "PC・スマートフォンとWindows・Mac・iPhone・Androidから、練習する環境を選びます。",
};

export default function StartPage() {
  return <StartExperience />;
}
