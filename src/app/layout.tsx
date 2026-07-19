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
    "Windows、Mac、iPhone、Androidの実践操作を、失敗しても戻せる安全な画面で学ぶデジタル自立トレーニング。",
  applicationName: "PC・スマホ実践アプリ",
  openGraph: {
    title: "PC・スマホ実践アプリ",
    description: "分からない画面でも、見つけて、試して、戻せる力を育てよう。",
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
