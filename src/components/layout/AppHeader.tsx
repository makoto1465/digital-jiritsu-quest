"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNavigation = [
  { href: "/start", label: "学びを始める" },
  { href: "/progress", label: "できること" },
  { href: "/toolbox", label: "道具箱" },
  { href: "/settings", label: "設定" },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const missionMatch = pathname.match(/^\/mission\/(windows|mac|iphone|android)\//);
  const journeyMatch = pathname.match(/^\/(?:journey|practice)\/(windows|mac|iphone|android)/);
  const activeEnvironment = missionMatch?.[1] ?? journeyMatch?.[1];
  const isMission = Boolean(missionMatch);

  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へ移動する
      </a>
      <header className={`app-header${isMission ? " app-header--mission" : ""}`}>
        <div className="shell app-header__inner">
          <Link
            className="app-brand"
            href="/"
            aria-label="PC・スマホ実践アプリ ホーム"
          >
            <span className="app-brand__mark" aria-hidden="true">
              <span />
            </span>
            <span className="app-brand__copy">
              <span className="app-brand__name">PC・スマホ実践アプリ</span>
              {!isMission ? <span className="app-brand__tagline">試して、気づいて、自分の力に</span> : null}
            </span>
          </Link>

          {isMission && activeEnvironment ? (
            <Link className="mission-exit" href={`/journey/${activeEnvironment}`}>
              中断して地図へ
            </Link>
          ) : (
            <nav className="app-header__nav" aria-label="メインメニュー">
              {primaryNavigation.map((item) => {
                const learningRoute = item.href === "/start" && /^\/(journey|practice)\//.test(pathname);
                const current = learningRoute || pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link aria-current={current ? "page" : undefined} className="nav-link" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
