import type { Metadata } from "next";
import { ToolboxExperience } from "@/features/journey/ToolboxExperience";

export const metadata: Metadata = { title: "困ったときの道具箱" };
export default function ToolboxPage() { return <ToolboxExperience />; }
