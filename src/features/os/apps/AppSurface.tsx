"use client";

import type { AppKey } from "../os-config";
import type { AppProps } from "../os-state";
import { BrowserApp } from "./BrowserApp";
import { CameraApp, ClockApp, MapsApp, MessagesApp, MusicApp, PhoneApp, StoreApp } from "./MobileApps";
import { SettingsApp } from "./SettingsApp";
import { CalculatorApp, FilesApp, MailApp, NotesApp, PhotosApp } from "./WorkApps";

function TrashApp({ os }: AppProps) {
  return (
    <div className={`os-trash is-${os}`}>
      <p className="os-trash__head">{os === "windows" ? "ごみ箱" : "ゴミ箱"}に入っている項目</p>
      <ul>
        <li><span className="os-filekind is-text" aria-hidden="true">TXT</span><span>古いメモ.txt</span><small>2026/07/12</small></li>
        <li><span className="os-filekind is-image" aria-hidden="true">JPG</span><span>ぶれた写真.jpg</span><small>2026/07/09</small></li>
      </ul>
      <p className="os-trash__note">ここに入っている間は元に戻せます。空にすると戻せません（練習用なので実際には消えません）。</p>
    </div>
  );
}

export function AppSurface({ app, ...props }: AppProps & { app: AppKey }) {
  switch (app) {
    case "browser": return <BrowserApp {...props} />;
    case "files": return <FilesApp {...props} />;
    case "notes": return <NotesApp {...props} />;
    case "settings": return <SettingsApp {...props} />;
    case "mail": return <MailApp {...props} />;
    case "photos": return <PhotosApp {...props} />;
    case "calculator": return <CalculatorApp {...props} />;
    case "camera": return <CameraApp {...props} />;
    case "phone": return <PhoneApp {...props} />;
    case "messages": return <MessagesApp {...props} />;
    case "clock": return <ClockApp {...props} />;
    case "maps": return <MapsApp {...props} />;
    case "music": return <MusicApp {...props} />;
    case "store": return <StoreApp {...props} />;
    default: return <TrashApp {...props} />;
  }
}
