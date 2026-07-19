import type { WorldDefinition } from "../lib/types";

export const worlds: WorldDefinition[] = [
  {
    id: "world-1",
    order: 1,
    title: "WORLD 1 基本操作",
    shortTitle: "基本操作",
    description:
      "クリックやタップ、コピー、貼り付けなど、いろいろな画面で役立つ基本の動きを試します。",
    icon: "👆",
    stageIds: ["w1-pc-copy-paste", "w1-mobile-copy-paste"],
    competencyIds: ["safe-experiment", "observation"],
    freePlayPrompt:
      "メモを開いたり閉じたりして、押すと何が起きるかを自由に確かめてみましょう。",
  },
  {
    id: "world-2",
    order: 2,
    title: "WORLD 2 画面の見方",
    shortTitle: "画面の見方",
    description:
      "メニュー、三点マーク、歯車、ポップアップなど、目的の機能につながる手がかりを探します。",
    icon: "👀",
    stageIds: ["w2-pc-find-settings", "w2-mobile-more-menu"],
    competencyIds: ["observation", "safe-experiment"],
    freePlayPrompt:
      "画面の端やマークを見ながら、開けそうなメニューを安全に試してみましょう。",
  },
  {
    id: "world-3",
    order: 3,
    title: "WORLD 3 インターネット",
    shortTitle: "インターネット",
    description:
      "検索、リンク、戻る、タブを使い、必要な情報まで自分でたどり着く練習をします。",
    icon: "🌐",
    stageIds: ["w3-pc-search-tabs", "w3-mobile-search-back"],
    competencyIds: ["research", "observation", "recovery"],
    freePlayPrompt:
      "架空のブラウザで検索語を変えたり、リンクを開いたり、戻ったりしてみましょう。",
  },
  {
    id: "world-4",
    order: 4,
    title: "WORLD 4 アカウント",
    shortTitle: "アカウント",
    description:
      "練習用アカウントだけを使い、ログイン、パスワード再設定、切り替えを安全に学びます。",
    icon: "🔐",
    stageIds: ["w4-pc-password-recovery", "w4-mobile-switch-account"],
    competencyIds: ["safe-experiment", "recovery", "observation"],
    freePlayPrompt:
      "練習用プロフィールを開き、ログイン中の名前やログアウトの場所を確かめてみましょう。",
  },
  {
    id: "world-5",
    order: 5,
    title: "WORLD 5 ファイル",
    shortTitle: "ファイル",
    description:
      "ダウンロードした資料や写真を見つけ、移動したり添付したりする練習をします。",
    icon: "📁",
    stageIds: ["w5-pc-download-attach", "w5-mobile-share-attach"],
    competencyIds: ["observation", "transfer", "safe-experiment"],
    freePlayPrompt:
      "練習用ファイルをフォルダ間で動かし、元の場所へ戻してみましょう。",
  },
  {
    id: "world-6",
    order: 6,
    title: "WORLD 6 トラブル解決",
    shortTitle: "トラブル解決",
    description:
      "画面がいつもと違うときやエラーが出たときに、内容を読み、調べ、元に戻します。",
    icon: "🧭",
    stageIds: ["w6-pc-hidden-button", "w6-mobile-ask-for-help"],
    competencyIds: ["research", "recovery", "transfer"],
    freePlayPrompt:
      "わざと違う場所を開き、戻る、閉じる、ヘルプ検索で落ち着いて復旧してみましょう。",
  },
  {
    id: "world-7",
    order: 7,
    title: "WORLD 7 デジタル自立チャレンジ",
    shortTitle: "自立チャレンジ",
    description:
      "細かな手順ではなく目的だけを見て、これまでの知識を組み合わせて解決します。",
    icon: "🌱",
    stageIds: ["w7-pc-independent-file", "w7-mobile-independent-research"],
    competencyIds: [
      "independent-exploration",
      "transfer",
      "research",
      "recovery",
    ],
    freePlayPrompt:
      "自分で小さな目的を一つ決め、分からないときは調べながら達成してみましょう。",
  },
];
