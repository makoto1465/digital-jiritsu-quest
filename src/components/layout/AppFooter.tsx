"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/mission/")) return null;

  return (
    <footer className="app-footer">
      <div className="shell app-footer__inner">
        <div>
          <p className="app-brand__name">PC・スマホ実践アプリ</p>
          <p className="app-footer__message">
            実際のデータには触れない、安全な練習空間です。
          </p>
        </div>

        <nav className="app-footer__nav" aria-label="補助メニュー">
          <Link href="/toolbox">困ったときの道具箱</Link>
          <Link href="/settings">見え方・操作の設定</Link>
        </nav>
      </div>
    </footer>
  );
}
