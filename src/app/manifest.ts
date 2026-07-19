import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "デジタル自立クエスト",
    short_name: "自立クエスト",
    description: "試す・調べる・戻すを安心して練習できるデジタル自立トレーニング。",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ec",
    theme_color: "#176b6f",
    lang: "ja",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
