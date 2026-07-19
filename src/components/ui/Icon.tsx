import type { ReactNode, SVGProps } from "react";

const glyphs = {
  home: (
    <>
      <path d="M3 10.7 12 3l9 7.7" />
      <path d="M5.5 9.6V21h13V9.6" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  practice: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.8 9.2-1.9 3.7-3.7 1.9 1.9-3.7 3.7-1.9Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  progress: (
    <>
      <path d="M5 20V10" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
      <path d="M3 20h18" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  shield: <path d="M12 3 20 6v5.5c0 4.8-3.2 8-8 9.5-4.8-1.5-8-4.7-8-9.5V6l8-3Z" />,
  shieldCheck: (
    <>
      <path d="M12 3 20 6v5.5c0 4.8-3.2 8-8 9.5-4.8-1.5-8-4.7-8-9.5V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </>
  ),
  check: <path d="m4.5 12.5 4.8 4.8L19.8 6.8" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.6 2.6 5.6-5.6" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  moreVertical: (
    <>
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="m10 5-7 7 7 7" />
      <path d="M3 12h18" />
    </>
  ),
  arrowRight: (
    <>
      <path d="m14 5 7 7-7 7" />
      <path d="M3 12h18" />
    </>
  ),
  arrowUp: (
    <>
      <path d="m5 10 7-7 7 7" />
      <path d="M12 3v18" />
    </>
  ),
  arrowDown: (
    <>
      <path d="m5 14 7 7 7-7" />
      <path d="M12 3v18" />
    </>
  ),
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronUp: <path d="m5 15 7-7 7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  undo: (
    <>
      <path d="m9 7-5 5 5 5" />
      <path d="M4 12h9a6 6 0 0 1 6 6v1" />
    </>
  ),
  redo: (
    <>
      <path d="m15 7 5 5-5 5" />
      <path d="M20 12h-9a6 6 0 0 0-6 6v1" />
    </>
  ),
  reset: (
    <>
      <path d="M4.7 8.2A8.5 8.5 0 1 1 4 14" />
      <path d="M4.7 3.8v4.4H9" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.7 9a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.4 1.1-1.4 2.1" />
      <path d="M12 17.2h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v6" />
      <path d="M12 7.2h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M10.5 4.3 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.5 4.3a1.7 1.7 0 0 0-3 0Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M8.8 16.5c-.3-1.5-1.1-2.2-1.8-3.2A6.2 6.2 0 1 1 17 13.2c-.8 1.1-1.5 1.8-1.8 3.3" />
      <path d="M9 17h6" />
      <path d="M10 20h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5h10a3 3 0 0 1 3 3V21H7a3 3 0 0 1-3-3V4.5Z" />
      <path d="M4 17.5A3.5 3.5 0 0 1 7.5 14H17" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M3.5 5.5h5A3.5 3.5 0 0 1 12 9v11a3.5 3.5 0 0 0-3.5-3.5h-5v-11Z" />
      <path d="M20.5 5.5h-5A3.5 3.5 0 0 0 12 9v11a3.5 3.5 0 0 1 3.5-3.5h5v-11Z" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6.5" y="2" width="11" height="20" rx="2.5" />
      <path d="M10 5h4" />
      <path d="M12 18.5h.01" />
    </>
  ),
  mouse: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="5" />
      <path d="M12 2.5v6" />
      <path d="M7 9h10" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01" />
      <path d="M6 14h.01M9 14h6M18 14h.01" />
    </>
  ),
  pointer: (
    <>
      <path d="m5 3 13 9-6 1.5L9 19 5 3Z" />
      <path d="m13.5 14 3.5 5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </>
  ),
  folder: (
    <>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-10Z" />
    </>
  ),
  file: (
    <>
      <path d="M6 2.5h8l4 4V21H6V2.5Z" />
      <path d="M14 2.5v4h4" />
    </>
  ),
  save: (
    <>
      <path d="M4 3h14l2 2v16H4V3Z" />
      <path d="M8 3v6h8V3" />
      <path d="M8 21v-7h8v7" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 20h16" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 3h6l1 4H8l1-4Z" />
      <path d="m6 7 1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  send: (
    <>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
      <path d="m11 13 5-5" />
    </>
  ),
  message: (
    <>
      <path d="M4 4h16v13H9l-5 4V4Z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.5-2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  logIn: (
    <>
      <path d="M14 4h5v16h-5" />
      <path d="M10 8l4 4-4 4M14 12H3" />
    </>
  ),
  logOut: (
    <>
      <path d="M10 4H5v16h5" />
      <path d="m14 8 4 4-4 4M18 12H7" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.2 7 4.7-2.5 4.7 2.5-1.2-7" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7V5Z" />,
  pause: (
    <>
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </>
  ),
  edit: (
    <>
      <path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </>
  ),
  externalLink: (
    <>
      <path d="M13 4h7v7" />
      <path d="m20 4-9 9" />
      <path d="M18 14v6H4V6h6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  flag: (
    <>
      <path d="M5 22V3" />
      <path d="M5 4h12l-2 4 2 4H5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2V8" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
      <path d="m5.5 13 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 9a14 14 0 0 1 18 0" />
      <path d="M6.5 12.5a9 9 0 0 1 11 0" />
      <path d="M10 16a4 4 0 0 1 4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  volume: (
    <>
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M18.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  volumeOff: (
    <>
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="m17 10 4 4M21 10l-4 4" />
    </>
  ),
} as const satisfies Record<string, ReactNode>;

const aliases = {
  desktop: "monitor",
  pc: "monitor",
  phone: "smartphone",
  glossary: "bookOpen",
  dictionary: "bookOpen",
  gear: "settings",
  refresh: "reset",
  rotate: "reset",
  "arrow-left": "arrowLeft",
  "arrow-right": "arrowRight",
  "arrow-up": "arrowUp",
  "arrow-down": "arrowDown",
  "chevron-left": "chevronLeft",
  "chevron-right": "chevronRight",
  "chevron-up": "chevronUp",
  "chevron-down": "chevronDown",
  "check-circle": "checkCircle",
  "shield-check": "shieldCheck",
  "help-circle": "help",
  "info-circle": "info",
  "alert-triangle": "alert",
  "book-open": "bookOpen",
  "log-in": "logIn",
  "log-out": "logOut",
  "more-horizontal": "more",
  "more-vertical": "moreVertical",
  "external-link": "externalLink",
  "volume-off": "volumeOff",
} as const satisfies Record<string, keyof typeof glyphs>;

type GlyphName = keyof typeof glyphs;
type AliasName = keyof typeof aliases;

export type IconName = GlyphName | AliasName;

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "children" | "height" | "name" | "width"> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  title?: string;
}

function resolveGlyph(name: IconName): ReactNode {
  if (name in aliases) {
    return glyphs[aliases[name as AliasName]];
  }

  return glyphs[name as GlyphName];
}

export function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  title,
  className,
  ...svgProps
}: IconProps) {
  const isDecorative = !title && !svgProps["aria-label"];

  return (
    <svg
      aria-hidden={isDecorative ? true : undefined}
      className={className}
      fill="none"
      focusable="false"
      height={size}
      role={isDecorative ? undefined : "img"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...svgProps}
    >
      {title ? <title>{title}</title> : null}
      {resolveGlyph(name)}
    </svg>
  );
}
