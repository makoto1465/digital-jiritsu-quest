import type { CSSProperties, ReactNode } from "react";

import { appLabel, type AppKey, type OsId } from "./os-config";

/**
 * アプリアイコン。
 * タイル（背景の色・角丸・影）は os-shell.css 側、この中の SVG は白抜きなどの図柄だけを描く。
 * Windows と macOS の一部は実機と同じく「タイルなしの自由形」なので、図柄側で色を持つ。
 */

const svg = (children: ReactNode, viewBox = "0 0 24 24") => (
  <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" focusable="false">{children}</svg>
);

const edgeGlyph = svg(
  <>
    <path fill="#0c7cc4" d="M21 13.4c0 4.6-4 8.2-9.2 8.2-4.8 0-8.8-3.3-8.8-7.8 0-3.6 2.4-6.2 5.3-7-1.4 1.2-2.2 2.7-2.2 4.4 0 3.3 2.9 5.4 7 5.4 3.2 0 6.1-1 7.9-3.2Z" />
    <path fill="#2bb7ea" d="M6.1 4.7C7.6 3.2 9.7 2.4 12 2.4c4.6 0 8.1 3 8.6 6.9-1 1.4-3 2.3-5.5 2.3-3 0-5.1-1.5-5.1-3.6 0-1.3.8-2.4 2.2-3.1-2.3-.5-4.5-.3-6.1.8Z" />
    <path fill="#6bd6a4" d="M3.4 15.9c-.6-1.1-.9-2.3-.9-3.6 0-2.2.9-4.1 2.4-5.5-.4 3.4 1.2 6.9 4.4 8.8-2.3.9-4.4.9-5.9.3Z" />
  </>,
);

const safariGlyph = svg(
  <>
    <circle cx="12" cy="12" r="9.6" fill="#fff" />
    <circle cx="12" cy="12" r="8.7" fill="none" stroke="#d5e6f5" strokeWidth=".7" />
    <path fill="#f5453b" d="m16.6 7.4-6.1 3.1L7.4 16.6l6.1-3.1Z" />
    <path fill="#d8dde3" d="m7.4 16.6 6.1-3.1-3-3Z" />
    <circle cx="12" cy="12" r="1" fill="#fff" />
  </>,
);

const chromeGlyph = svg(
  <>
    <circle cx="12" cy="12" r="10" fill="#fff" />
    <path fill="#e94435" d="M12 2a10 10 0 0 1 8.7 5H12a5 5 0 0 0-4.4 2.6L4.3 6A10 10 0 0 1 12 2Z" />
    <path fill="#f8bb15" d="M20.7 7A10 10 0 0 1 12 22l4.3-7.4A5 5 0 0 0 16.6 7Z" />
    <path fill="#33a852" d="M12 22A10 10 0 0 1 4.3 6l4.3 7.4A5 5 0 0 0 16.3 15Z" />
    <circle cx="12" cy="12" r="4.3" fill="#fff" />
    <circle cx="12" cy="12" r="3.4" fill="#4183f3" />
  </>,
);

const explorerGlyph = svg(
  <>
    <path fill="#f4b942" d="M2.6 6.2c0-.8.6-1.4 1.4-1.4h4.6l1.9 2h9.5c.8 0 1.4.6 1.4 1.4v3H2.6Z" />
    <path fill="#ffd579" d="M2.6 9.6h18.8v8.2c0 .8-.6 1.4-1.4 1.4H4c-.8 0-1.4-.6-1.4-1.4Z" />
    <path fill="#2e8fd8" d="M11.4 11.6h9.1c.6 0 1 .5 1 1v5.5c0 .8-.6 1.3-1.3 1.3h-8.8Z" opacity=".92" />
  </>,
);

const finderGlyph = svg(
  <>
    <path fill="#1e9bf0" d="M2 4h10v16H2Z" />
    <path fill="#fff" d="M12 4h10v16H12Z" />
    <path fill="#0b2d4d" d="M6.2 9.4a.9 1.5 0 1 0 0 3 .9 1.5 0 0 0 0-3Zm11.6 0a.9 1.5 0 1 0 0 3 .9 1.5 0 0 0 0-3Z" />
    <path fill="none" stroke="#0b2d4d" strokeWidth="1.1" strokeLinecap="round" d="M8.8 15.4c1.6 1.3 5 1.3 6.6 0" />
  </>,
);

const folderGlyph = (color: string) => svg(
  <path fill={color} d="M4 6.4c0-.8.6-1.4 1.4-1.4h3.8l1.7 1.9h7.7c.8 0 1.4.6 1.4 1.4v9.3c0 .8-.6 1.4-1.4 1.4H5.4c-.8 0-1.4-.6-1.4-1.4Z" />,
);

const noteLinesGlyph = (color: string) => svg(
  <>
    <path fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" d="M6.5 8.5h11M6.5 12h11M6.5 15.5h7" />
  </>,
);

const notepadGlyph = svg(
  <>
    <path fill="#fff" stroke="#b9c3ce" strokeWidth=".8" d="M5.4 3.2h10l3.4 3.4v14.2H5.4Z" />
    <path fill="#dfe6ed" d="M15.2 3.2 18.8 6.6h-3.6Z" />
    <path fill="none" stroke="#4a9fd8" strokeWidth="1.2" strokeLinecap="round" d="M8 10h8M8 13h8M8 16h5" />
  </>,
);

const texteditGlyph = svg(
  <>
    <path fill="#fff" stroke="#c3ccd6" strokeWidth=".8" d="M5 3h14v18H5Z" />
    <path fill="none" stroke="#8b96a3" strokeWidth="1.1" strokeLinecap="round" d="M8 8h8M8 11h8M8 14h5" />
    <path fill="#f2b03c" d="m14.4 18.6 4.9-4.9 1.7 1.7-4.9 4.9-2.3.6Z" />
  </>,
);

const gearGlyph = (color: string) => svg(
  <path fill={color} d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm9 4.9v-2.6l-2.4-.5a6.9 6.9 0 0 0-.8-1.9l1.4-2-1.9-1.9-2 1.4c-.6-.4-1.2-.6-1.9-.8L12.9 3h-2.6l-.5 2.4c-.7.2-1.3.4-1.9.8l-2-1.4L4 6.7l1.4 2c-.4.6-.6 1.2-.8 1.9L2.2 11v2.6l2.4.5c.2.7.4 1.3.8 1.9l-1.4 2 1.9 1.9 2-1.4c.6.4 1.2.6 1.9.8l.5 2.4h2.6l.5-2.4c.7-.2 1.3-.4 1.9-.8l2 1.4 1.9-1.9-1.4-2c.4-.6.6-1.2.8-1.9Z" />,
);

const envelopeGlyph = (color: string) => svg(
  <>
    <rect x="3" y="5.6" width="18" height="12.8" rx="2.2" fill={color} />
    <path fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" d="m4.6 7.6 7.4 5.4 7.4-5.4" />
  </>,
);

const gmailGlyph = svg(
  <>
    <path fill="#fff" d="M3 6.4h18v11.2H3Z" />
    <path fill="#e94435" d="M3.9 5.4h1.7L12 10.2l6.4-4.8h1.7c.6 0 1 .5 1 1v1.2L12 14.1 2.9 7.6V6.4c0-.6.5-1 1-1Z" />
    <path fill="#33a852" d="M2.9 7.6 12 14.1l9.1-6.5v9.8c0 .6-.5 1-1 1h-2.3V11l-5.8 4.2L6.2 11v7.4H3.9c-.6 0-1-.5-1-1Z" />
  </>,
);

const photosFlowerGlyph = svg(
  <>
    <g opacity=".92">
      <ellipse cx="12" cy="6.6" rx="2.4" ry="3.5" fill="#f8c23c" />
      <ellipse cx="12" cy="17.4" rx="2.4" ry="3.5" fill="#3fb9f0" />
      <ellipse cx="6.6" cy="12" rx="3.5" ry="2.4" fill="#f2603f" />
      <ellipse cx="17.4" cy="12" rx="3.5" ry="2.4" fill="#54c06a" />
      <ellipse cx="8.2" cy="8.2" rx="2.4" ry="3.4" transform="rotate(-45 8.2 8.2)" fill="#f28d3a" />
      <ellipse cx="15.8" cy="15.8" rx="2.4" ry="3.4" transform="rotate(-45 15.8 15.8)" fill="#41c8bd" />
      <ellipse cx="15.8" cy="8.2" rx="2.4" ry="3.4" transform="rotate(45 15.8 8.2)" fill="#a4d150" />
      <ellipse cx="8.2" cy="15.8" rx="2.4" ry="3.4" transform="rotate(45 8.2 15.8)" fill="#8d7ee0" />
    </g>
    <circle cx="12" cy="12" r="2.3" fill="#fff" />
  </>,
);

const googlePhotosGlyph = svg(
  <>
    <path fill="#f8bb15" d="M11.4 2.6v9H2.4c0-5 4-9 9-9Z" />
    <path fill="#e94435" d="M21.4 11.4h-9v-9c5 0 9 4 9 9Z" transform="rotate(0 12 12)" />
    <path fill="#4183f3" d="M12.6 21.4v-9h9c0 5-4 9-9 9Z" />
    <path fill="#33a852" d="M2.6 12.6h9v9c-5 0-9-4-9-9Z" />
  </>,
);

const mountainGlyph = svg(
  <>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.4" fill="#fff" opacity=".95" />
    <circle cx="8.4" cy="9.4" r="1.7" fill="#f6b73c" />
    <path fill="#2f9fdc" d="M4.6 18.2 9.8 12l3.4 3.9 2.6-2.7 3.6 5Z" />
  </>,
);

const cameraGlyph = (body: string) => svg(
  <>
    <rect x="2.8" y="6.4" width="18.4" height="12.4" rx="3" fill={body} />
    <path fill={body} d="M8.6 4.6h6.8l1.2 2H7.4Z" />
    <circle cx="12" cy="12.6" r="4" fill="#25303c" />
    <circle cx="12" cy="12.6" r="2.5" fill="#4a97c9" />
    <circle cx="18.2" cy="9" r=".9" fill="#f5d67a" />
  </>,
);

const phoneGlyph = svg(
  <path fill="#fff" d="M7.4 3.4c.7 0 1.3.4 1.6 1l1.1 2.6c.3.7.1 1.5-.5 1.9l-1.1.8a11 11 0 0 0 4.8 4.8l.8-1.1c.4-.6 1.2-.8 1.9-.5l2.6 1.1c.6.3 1 .9 1 1.6v2.6c0 1.1-.9 2-2 2C9.7 20.2 3.8 14.3 3.8 5.4c0-1.1.9-2 2-2Z" />,
);

const chatGlyph = svg(
  <path fill="#fff" d="M12 4.4c-4.7 0-8.5 3.1-8.5 6.9 0 2.2 1.2 4.1 3.2 5.4v3.3l3.1-1.7c.7.1 1.4.2 2.2.2 4.7 0 8.5-3.1 8.5-6.9S16.7 4.4 12 4.4Z" />,
);

const calculatorGlyph = (accent: string) => svg(
  <>
    <rect x="4.6" y="2.8" width="14.8" height="18.4" rx="2.6" fill="#fff" opacity=".16" />
    <rect x="6.6" y="5" width="10.8" height="3.4" rx="1" fill="#fff" opacity=".85" />
    <g fill="#fff">
      <circle cx="8.4" cy="11.6" r="1.15" /><circle cx="12" cy="11.6" r="1.15" /><circle cx="15.6" cy="11.6" r="1.15" />
      <circle cx="8.4" cy="15" r="1.15" /><circle cx="12" cy="15" r="1.15" /><circle cx="15.6" cy="15" r="1.15" />
      <circle cx="8.4" cy="18.4" r="1.15" /><circle cx="12" cy="18.4" r="1.15" />
    </g>
    <circle cx="15.6" cy="18.4" r="1.15" fill={accent} />
  </>,
);

const appStoreGlyph = svg(
  <path fill="#fff" d="M12 4.6 6.2 15.9h2.4L12 9.2l3.4 6.7h2.4Zm-4.9 12.6h9.8l-1 2H8.1Z" />,
);

const playStoreGlyph = svg(
  <>
    <path fill="#33a852" d="m4.6 3.4 9.7 8.6-9.7 8.6c-.4-.2-.6-.6-.6-1.1V4.5c0-.5.2-.9.6-1.1Z" />
    <path fill="#f8bb15" d="m14.3 12 3.1-2.8 2.7 1.6c.7.4.7 1.4 0 1.8l-2.7 1.6Z" />
    <path fill="#e94435" d="m4.6 20.6 9.7-8.6 3.1 2.8-9.6 5.6c-.5.3-1 .3-1.4.1Z" opacity=".92" />
    <path fill="#4183f3" d="m4.6 3.4 12.8 7.4-3.1 1.2Z" opacity=".92" />
  </>,
);

const storeBagGlyph = svg(
  <>
    <path fill="#fff" d="M4.6 7.6h14.8l-1.2 12.2H5.8Z" opacity=".95" />
    <path fill="none" stroke="#0a63b0" strokeWidth="1.5" d="M8.8 9.6V7a3.2 3.2 0 0 1 6.4 0v2.6" />
  </>,
);

const clockGlyph = svg(
  <>
    <circle cx="12" cy="12" r="9" fill="#fff" />
    <path fill="none" stroke="#1d2430" strokeWidth="1.5" strokeLinecap="round" d="M12 6.6V12l3.6 2.2" />
    <circle cx="12" cy="12" r="1.1" fill="#f4553d" />
  </>,
);

const mapsGlyph = svg(
  <>
    <path fill="#fff" d="M3.4 6.4 9 4.6v13.2l-5.6 1.8Zm5.6-1.8 6 2v13.2l-6-2Zm6 2 5.6-1.8v13.2L15 19.8Z" opacity=".9" />
    <path fill="#e0452f" d="M12 3.6a3.3 3.3 0 0 0-3.3 3.3c0 2.4 3.3 6 3.3 6s3.3-3.6 3.3-6A3.3 3.3 0 0 0 12 3.6Z" />
    <circle cx="12" cy="6.9" r="1.2" fill="#fff" />
  </>,
);

const musicGlyph = svg(
  <path fill="#fff" d="M9.4 17.6a2.6 2.6 0 1 1-1.8-2.5V6.4l9-2v9.6a2.6 2.6 0 1 1-1.8-2.5V6.9l-5.4 1.2Z" />,
);

const trashGlyph = svg(
  <>
    <path fill="#c8d0d8" d="M6.4 7.6h11.2l-.9 11.5c-.1 1-.9 1.7-1.9 1.7H9.2c-1 0-1.8-.7-1.9-1.7Z" />
    <rect x="5" y="5.2" width="14" height="2.2" rx="1.1" fill="#98a4b0" />
    <path fill="none" stroke="#7b8794" strokeWidth="1.1" strokeLinecap="round" d="M9.6 10.4v7.2M14.4 10.4v7.2" />
    <path fill="none" stroke="#98a4b0" strokeWidth="1.4" strokeLinecap="round" d="M9.4 5.2c0-1 .8-1.8 1.8-1.8h1.6c1 0 1.8.8 1.8 1.8" />
  </>,
);

const recycleBinGlyph = svg(
  <>
    <path fill="#cfe0ec" d="M6.6 6.6h10.8l-1.2 12.6c-.1 1-.9 1.8-1.9 1.8H9.7c-1 0-1.8-.8-1.9-1.8Z" opacity=".95" />
    <ellipse cx="12" cy="6.6" rx="5.4" ry="1.6" fill="#a9c3d8" />
    <path fill="none" stroke="#2f7fbe" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" d="M10 11.6 8.8 14h2.4l-1.2 2.4M14 11.6l1.2 2.4h-2.4l1.2 2.4" />
  </>,
);

const keepGlyph = svg(
  <>
    <path fill="#fff" d="M12 4.4a5.2 5.2 0 0 0-3.1 9.4c.5.4.8 1 .8 1.6v.4h4.6v-.4c0-.6.3-1.2.8-1.6A5.2 5.2 0 0 0 12 4.4Z" />
    <path fill="#fff" d="M9.7 17.2h4.6v1.2a1.6 1.6 0 0 1-1.6 1.6h-1.4a1.6 1.6 0 0 1-1.6-1.6Z" opacity=".8" />
  </>,
);

const glyphs: Partial<Record<string, ReactNode>> = {
  "windows:browser": edgeGlyph,
  "mac:browser": safariGlyph,
  "iphone:browser": safariGlyph,
  "android:browser": chromeGlyph,
  "windows:files": explorerGlyph,
  "mac:files": finderGlyph,
  "iphone:files": folderGlyph("#2f8fe8"),
  "android:files": folderGlyph("#4183f3"),
  "windows:notes": notepadGlyph,
  "mac:notes": texteditGlyph,
  "iphone:notes": noteLinesGlyph("#fff"),
  "android:notes": keepGlyph,
  "windows:settings": gearGlyph("#5b6975"),
  "mac:settings": gearGlyph("#fff"),
  "iphone:settings": gearGlyph("#fff"),
  "android:settings": gearGlyph("#0b57d0"),
  "windows:mail": envelopeGlyph("#0a63b0"),
  "mac:mail": envelopeGlyph("#1d8ff0"),
  "iphone:mail": envelopeGlyph("#1d8ff0"),
  "android:mail": gmailGlyph,
  "windows:photos": mountainGlyph,
  "mac:photos": photosFlowerGlyph,
  "iphone:photos": photosFlowerGlyph,
  "android:photos": googlePhotosGlyph,
  "windows:camera": cameraGlyph("#e8edf2"),
  "mac:camera": cameraGlyph("#e8edf2"),
  "iphone:camera": cameraGlyph("#e8edf2"),
  "android:camera": cameraGlyph("#dfe7ef"),
  "windows:store": storeBagGlyph,
  "mac:store": appStoreGlyph,
  "iphone:store": appStoreGlyph,
  "android:store": playStoreGlyph,
  "windows:trash": recycleBinGlyph,
  "mac:trash": trashGlyph,
  "iphone:trash": trashGlyph,
  "android:trash": trashGlyph,
  "windows:calculator": calculatorGlyph("#ffb44d"),
  "mac:calculator": calculatorGlyph("#ff9f0a"),
  "iphone:calculator": calculatorGlyph("#ff9f0a"),
  "android:calculator": calculatorGlyph("#a8c7fa"),
  phone: phoneGlyph,
  messages: chatGlyph,
  clock: clockGlyph,
  maps: mapsGlyph,
  music: musicGlyph,
};

export function AppIcon({ os, app, size, className }: { os: OsId; app: AppKey; size?: number; className?: string }) {
  const glyph = glyphs[`${os}:${app}`] ?? glyphs[app] ?? gearGlyph("#fff");
  const style = size ? ({ "--os-icon-size": `${size}px` } as CSSProperties) : undefined;
  return (
    <span aria-hidden="true" className={`os-app-icon os-app-icon--${app} is-${os}${className ? ` ${className}` : ""}`} style={style}>
      {glyph}
    </span>
  );
}

export function AppTile({ os, app, size, label }: { os: OsId; app: AppKey; size?: number; label?: string }) {
  return (
    <>
      <AppIcon os={os} app={app} size={size} />
      <span className="os-app-name">{label ?? appLabel(os, app)}</span>
    </>
  );
}

/** ステータスバー・トレイで使う小さな図形 */
export const SystemGlyph = {
  wifi: (
    <svg viewBox="0 0 24 18" focusable="false" aria-hidden="true"><path fill="currentColor" d="M12 15.6 15 12a4.2 4.2 0 0 0-6 0Zm-5.4-6.4 1.9 2.2a8.4 8.4 0 0 1 7 0l1.9-2.2a11.2 11.2 0 0 0-10.8 0ZM1.4 4.6l1.9 2.2a14.6 14.6 0 0 1 17.4 0l1.9-2.2a17.6 17.6 0 0 0-21.2 0Z" /></svg>
  ),
  cellular: (
    <svg viewBox="0 0 20 14" focusable="false" aria-hidden="true"><g fill="currentColor"><rect x="0" y="9.4" width="3" height="4.6" rx="1" /><rect x="4.6" y="6.6" width="3" height="7.4" rx="1" /><rect x="9.2" y="3.8" width="3" height="10.2" rx="1" /><rect x="13.8" y="1" width="3" height="13" rx="1" /></g></svg>
  ),
  battery: (
    <svg viewBox="0 0 28 14" focusable="false" aria-hidden="true"><rect x="1" y="1.6" width="22" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".45" /><rect x="2.8" y="3.4" width="16" height="7.2" rx="2" fill="currentColor" /><path fill="currentColor" opacity=".45" d="M24.6 5.2c1 .3 1.6 1 1.6 1.8s-.6 1.5-1.6 1.8Z" /></svg>
  ),
  volume: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M4 9.4h3.4L12 5.2v13.6L7.4 14.6H4Z" /><path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M15.2 9.4a4 4 0 0 1 0 5.2M17.8 7a7.4 7.4 0 0 1 0 10" /></svg>
  ),
  chevronUp: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="m6 14.5 6-6 6 6" /></svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="m15.6 15.6 4.2 4.2" /></svg>
  ),
  windowsLogo: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><g fill="currentColor"><rect x="3" y="3" width="8.2" height="8.2" rx="1" /><rect x="12.8" y="3" width="8.2" height="8.2" rx="1" /><rect x="3" y="12.8" width="8.2" height="8.2" rx="1" /><rect x="12.8" y="12.8" width="8.2" height="8.2" rx="1" /></g></svg>
  ),
  taskView: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><rect x="2.6" y="5" width="12" height="9.6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M17.4 7.4v9.2M20.6 9.4v5.2" /></svg>
  ),
  appleLogo: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M16.5 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.5 1.2-2.5s-2.2-.9-2.2-3.8ZM14.3 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.6-1.3Z" /></svg>
  ),
  controlCenter: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7.4h16M4 16.6h16" /></g><circle cx="9" cy="7.4" r="2.2" fill="currentColor" /><circle cx="15" cy="16.6" r="2.2" fill="currentColor" /></svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" d="M14.5 5.5 8 12l6.5 6.5" /></svg>
  ),
  forward: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" d="m9.5 5.5 6.5 6.5-6.5 6.5" /></svg>
  ),
  reload: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M19.2 12a7.2 7.2 0 1 1-2.1-5.1" /><path fill="currentColor" d="M19.6 3.6v5h-5Z" /></svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><rect x="5.4" y="10.4" width="13.2" height="9.6" rx="2.2" fill="currentColor" /><path fill="none" stroke="currentColor" strokeWidth="1.8" d="M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6" /></svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 15.4V3.6m0 0L8.6 7M12 3.6 15.4 7" /><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M6.4 11H5.2v9.2h13.6V11h-1.2" /></svg>
  ),
  more: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><g fill="currentColor"><circle cx="5.6" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="18.4" cy="12" r="1.7" /></g></svg>
  ),
  moreVertical: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="5.6" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="18.4" r="1.7" /></g></svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9.5 5.5 6.5 6.5-6.5 6.5" /></svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 5.4v13.2M5.4 12h13.2" /></svg>
  ),
  androidBack: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M15.4 4.6 6.6 12l8.8 7.4Z" /></svg>
  ),
  androidHome: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" strokeWidth="2.1" /></svg>
  ),
  androidRecents: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><rect x="5.4" y="5.4" width="13.2" height="13.2" rx="1.6" fill="none" stroke="currentColor" strokeWidth="2.1" /></svg>
  ),
  googleG: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="#4183f3" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" /><path fill="#33a852" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" /><path fill="#f8bb15" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2Z" /><path fill="#e94435" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1Z" /></svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><rect x="9.4" y="3" width="5.2" height="10.4" rx="2.6" fill="currentColor" /><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M6 11.4a6 6 0 0 0 12 0M12 17.4V21" /></svg>
  ),
};
