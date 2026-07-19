"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { glossaryTerms } from "@/content/glossary";
import { Icon } from "@/components/ui/Icon";
import { useProgress } from "@/features/progress/ProgressProvider";

interface GlossaryContextValue {
  openTerm: (termId: string) => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const { recordGlossaryView } = useProgress();
  const activeTerm = glossaryTerms.find((term) => term.id === activeTermId);

  const openTerm = useCallback((termId: string) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setActiveTermId(termId);
    recordGlossaryView();
  }, [recordGlossaryView]);

  const closeTerm = useCallback(() => {
    setActiveTermId(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!activeTerm) return;
    closeButtonRef.current?.focus();
    const inertElements = [
      document.querySelector<HTMLElement>(".app-header"),
      document.querySelector<HTMLElement>("#main-content"),
      document.querySelector<HTMLElement>(".app-footer"),
    ].filter((element): element is HTMLElement => Boolean(element));
    inertElements.forEach((element) => {
      element.inert = true;
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTerm();
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      inertElements.forEach((element) => {
        element.inert = false;
      });
      document.body.style.overflow = previousOverflow;
    };
  }, [activeTerm, closeTerm]);

  const value = useMemo(() => ({ openTerm }), [openTerm]);

  return (
    <GlossaryContext.Provider value={value}>
      {children}
      {activeTerm ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeTerm}>
          <section
            aria-labelledby="term-dialog-title"
            aria-modal="true"
            className="term-dialog"
            onMouseDown={(event) => event.stopPropagation()}
            ref={dialogRef}
            role="dialog"
          >
            <div className="dialog-heading">
              <span className="dialog-icon"><Icon name="book" /></span>
              <div>
                <p className="eyebrow">ことばのミニ解説</p>
                <h2 id="term-dialog-title">{activeTerm.term}</h2>
              </div>
              <button ref={closeButtonRef} className="icon-button" type="button" onClick={closeTerm}>
                <Icon name="close" />
                <span className="sr-only">解説を閉じる</span>
              </button>
            </div>
            <p className="term-short">{activeTerm.shortDescription}</p>
            <div className="example-box">
              <strong>たとえば</strong>
              <p>{activeTerm.example}</p>
            </div>
            <div className="button-row">
              <button className="button button-primary" type="button" onClick={closeTerm}>わかりました</button>
              <Link className="button button-ghost" href={`/glossary?term=${activeTerm.id}`} onClick={closeTerm}>
                辞典で詳しく見る
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const value = useContext(GlossaryContext);
  if (!value) throw new Error("useGlossary must be used within GlossaryProvider");
  return value;
}
