"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, type IconName } from "@/components/ui/Icon";

const primaryNavigation = [
  { href: "/", label: "ホーム", icon: "home" },
  { href: "/start", label: "練習する", icon: "practice" },
  { href: "/glossary", label: "調べる", icon: "bookOpen" },
  { href: "/progress", label: "進み具合", icon: "progress" },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  icon: IconName;
}>;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へ移動する
      </a>
      <header className="app-header">
        <div className="app-shell app-header__inner">
          <Link
            className="app-brand"
            href="/"
            aria-label="デジタル自立クエスト ホーム"
          >
            <span className="app-brand__mark" aria-hidden="true">
              <Icon name="shieldCheck" size={25} strokeWidth={1.9} />
            </span>
            <span className="app-brand__copy">
              <span className="app-brand__name">デジタル自立クエスト</span>
              <span className="app-brand__tagline">
                試して、戻して、身につける
              </span>
            </span>
          </Link>

          <nav className="app-header__nav" aria-label="メインメニュー">
            {primaryNavigation.map((item) => (
              <Link
                aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined}
                className="nav-link"
                href={item.href}
                key={item.href}
              >
                <Icon name={item.icon} size={20} strokeWidth={1.9} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <Link
            aria-current={pathname === "/settings" ? "page" : undefined}
            className="app-header__settings"
            href="/settings"
            aria-label="設定を開く"
          >
            <Icon name="settings" size={23} strokeWidth={1.9} />
            <span className="app-header__settings-label">設定</span>
          </Link>
        </div>
      </header>
    </>
  );
}
