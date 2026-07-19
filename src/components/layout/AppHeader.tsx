"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const missionMatch = pathname.match(/^\/mission\/(windows|mac|iphone|android)\//);
  const journeyMatch = pathname.match(/^\/(?:journey|practice)\/(windows|mac|iphone|android)/);
  const activeEnvironment = missionMatch?.[1] ?? journeyMatch?.[1];
  const isMission = Boolean(missionMatch);
  const isEntry = pathname === "/" || pathname === "/start";

  return (
    <>
      <a className="skip-link" href="#main-content">本文へ移動する</a>
      <header className={`app-header${isMission ? " app-header--mission" : ""}`}>
        <div className="shell app-header__inner">
          <Link className="app-brand" href="/" aria-label="PC・スマホ実践アプリ ホーム">
            <span className="app-brand__mark" aria-hidden="true"><span /></span>
            <span className="app-brand__copy">
              <span className="app-brand__name">PC・スマホ実践アプリ</span>
              {!isMission ? <span className="app-brand__tagline">パソコン・スマホの操作練習</span> : null}
            </span>
          </Link>

          {!isEntry ? (
            activeEnvironment ? <Link className="mission-exit" href={`/journey/${activeEnvironment}`}>学習メニューへ戻る</Link>
              : <Link className="mission-exit" href="/">ホームへ戻る</Link>
          ) : null}
        </div>
      </header>
    </>
  );
}
