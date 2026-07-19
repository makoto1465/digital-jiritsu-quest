import type { Metadata } from "next";
import { ProgressDashboard } from "@/features/progress/ProgressDashboard";

export const metadata: Metadata = { title: "学習の進み具合" };

export default function ProgressPage() {
  return <div className="section-shell page-stack"><ProgressDashboard /></div>;
}
