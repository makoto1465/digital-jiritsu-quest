"use client";

import type { ReactNode } from "react";
import { glossaryTerms } from "@/content/glossary";
import { useGlossary } from "@/features/glossary/GlossaryProvider";

export function TermButton({ termId, children }: { termId: string; children?: ReactNode }) {
  const { openTerm } = useGlossary();
  const term = glossaryTerms.find((item) => item.id === termId);
  if (!term) return <>{children ?? termId}</>;
  return (
    <button className="term-button" type="button" onClick={() => openTerm(termId)} aria-label={`${term.term}の意味を見る`}>
      {children ?? term.term}<span aria-hidden="true">?</span>
    </button>
  );
}
