import type { Metadata, Viewport } from "next";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://digital-jiritsu-quest.vercel.app"),
  title: {
    default: "PC・スマホ実践アプリ",
    template: "%s | PC・スマホ実践アプリ",
  },
  description:
    "Windowsパソコン、Mac、iPhone、Androidスマートフォンの基本操作を、画面を見ながら練習できるアプリです。",
  applicationName: "PC・スマホ実践アプリ",
  openGraph: {
    title: "PC・スマホ実践アプリ",
    description: "パソコン・スマートフォンの基本操作を、画面で一つずつ練習できます。",
    type: "website",
    locale: "ja_JP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101935",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AppHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <AppFooter />
        </AppProviders>
      </body>
    </html>
  );
}
