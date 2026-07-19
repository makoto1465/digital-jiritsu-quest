"use client";

import type { ReactNode } from "react";
import { GlossaryProvider } from "@/features/glossary/GlossaryProvider";
import { ProgressProvider } from "@/features/progress/ProgressProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <GlossaryProvider>{children}</GlossaryProvider>
    </ProgressProvider>
  );
}
