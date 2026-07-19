import type { Metadata, Viewport } from "next";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://digital-jiritsu-quest.vercel.app"),
  title: {
    default: "デジタル自立クエスト",
    template: "%s | デジタル自立クエスト",
  },
  description:
    "試す・調べる・戻すを安心して練習できる、初心者向けデジタル自立トレーニングゲーム。",
  applicationName: "デジタル自立クエスト",
  openGraph: {
    title: "デジタル自立クエスト",
    description: "分からなくても大丈夫。安全な練習画面で、デジタルの自信を育てよう。",
    type: "website",
    locale: "ja_JP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
