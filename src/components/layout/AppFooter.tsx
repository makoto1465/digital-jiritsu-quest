"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, type IconName } from "@/components/ui/Icon";

const navigation = [
  { href: "/", label: "ホーム", icon: "home" },
  { href: "/start", label: "練習する", icon: "practice" },
  { href: "/glossary", label: "調べる", icon: "bookOpen" },
  { href: "/progress", label: "進み具合", icon: "progress" },
  { href: "/settings", label: "設定", icon: "settings" },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  icon: IconName;
}>;

export function AppFooter() {
  const pathname = usePathname();
  const current = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <footer className="app-footer">
      <div className="app-shell app-footer__inner">
        <div>
          <p className="app-brand__name">デジタル自立クエスト</p>
          <p className="app-footer__message">
            分からなくても大丈夫。安全な練習画面で、試して、調べて、
            いつでも戻せます。
          </p>
        </div>

        <nav className="app-footer__nav" aria-label="フッターメニュー">
          {navigation.map((item) => (
            <Link aria-current={current(item.href) ? "page" : undefined} className="app-footer__link" href={item.href} key={item.href}>
              <Icon name={item.icon} size={19} strokeWidth={1.9} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="app-footer__meta">
          このアプリは練習用です。実際のデータやアカウントには接続しません。
        </p>
      </div>

      <nav className="mobile-bottom-nav" aria-label="スマートフォン用メニュー">
        {navigation.map((item) => (
          <Link
            aria-current={current(item.href) ? "page" : undefined}
            className="mobile-bottom-nav__link"
            href={item.href}
            key={item.href}
          >
            <Icon name={item.icon} size={22} strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
