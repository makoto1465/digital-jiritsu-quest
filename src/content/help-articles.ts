import type { HelpArticle } from "../lib/types";

export const helpArticles: HelpArticle[] = [
  {
    id: "help-safe-first-step",
    title: "知らない画面で、最初に試しやすいこと",
    summary:
      "画面を観察し、元に戻しやすい小さな操作から試す方法を紹介します。",
    body:
      "知らない画面でも、すぐに壊れるわけではありません。目的を確認し、開く、メニューを見る、戻るなど、結果を確かめやすい操作から一つずつ試します。",
    steps: [
      "今やりたいことを短い言葉にします。",
      "見出し、マーク、ボタンの言葉をゆっくり見ます。",
      "戻しやすい操作を一つだけ試します。",
      "違ったら戻る、閉じる、元に戻すを使います。",
    ],
    keywords: ["初めて", "怖い", "安全", "試す", "知らない画面"],
    relatedActionIds: ["open-more", "go-back", "safe-cancel"],
    relatedGlossaryTermIds: ["safe-operation", "menu", "undo"],
    relatedFaqIds: ["faq-wrong-click", "faq-safe-actions"],
  },
  {
    id: "help-find-settings",
    title: "設定が見つからないときの探し方",
    summary: "歯車、三点メニュー、人物マークなどの手がかりから探します。",
    body:
      "設定はすべての画面で同じ場所にあるわけではありません。画面の右上や左上、三点メニュー、アカウントの中を順番に確認します。",
    steps: [
      "画面の四隅に歯車のマークがないか見ます。",
      "三点や三本線のメニューを開きます。",
      "表示、環境、プロフィールという言葉も探します。",
      "違う画面なら戻って別の入口を試します。",
    ],
    keywords: ["設定", "歯車", "三点", "メニュー", "見つからない"],
    relatedActionIds: ["open-settings", "open-more", "go-back"],
    relatedGlossaryTermIds: ["settings", "more-menu", "menu"],
    relatedFaqIds: ["faq-button-missing"],
  },
  {
    id: "help-close-popup",
    title: "画面をふさぐ案内を閉じる方法",
    summary: "ポップアップを閉じて、後ろの画面へ戻る方法です。",
    body:
      "小さな案内が画面の上に重なっているときは、右上の閉じる、下部のキャンセル、または案内の外側を探します。文章を読んでから閉じれば安心です。",
    steps: [
      "案内の内容と、何についての確認かを読みます。",
      "右上の閉じる、または『あとで』『キャンセル』を探します。",
      "閉じた後、元の画面が操作できるか確認します。",
    ],
    keywords: ["ポップアップ", "閉じる", "案内", "画面", "邪魔"],
    relatedActionIds: ["dismiss-popup", "safe-cancel"],
    relatedGlossaryTermIds: ["popup", "window", "safe-operation"],
    relatedFaqIds: ["faq-button-missing", "faq-wrong-click"],
  },
  {
    id: "help-better-search",
    title: "検索する言葉の作り方",
    summary: "場所、目的、困っている言葉を組み合わせて検索します。",
    body:
      "検索結果が多すぎるときは、固有の名前と知りたいことを組み合わせます。エラーの場合は番号や画面に表示された言葉も加えます。",
    steps: [
      "知りたいことを二つか三つの重要な言葉に分けます。",
      "場所やアプリの名前を一つ加えます。",
      "結果が違えば、別の言い方へ変えます。",
      "日付と発信元を確認して結果を比べます。",
    ],
    keywords: ["検索", "検索語", "調べ方", "見つからない", "キーワード"],
    relatedActionIds: ["open-browser", "search-web", "open-result"],
    relatedGlossaryTermIds: ["search", "browser", "link", "url"],
    relatedFaqIds: ["faq-browser-search", "faq-error-message"],
  },
  {
    id: "help-use-tabs",
    title: "複数のページをタブで比べる",
    summary: "ページを閉じずに残し、見出しを選んで切り替える方法です。",
    body:
      "二つ以上の検索結果を比べるときは、タブに残して切り替えると便利です。どのタブを見ているか、見出しや色だけでなくページ名も確認します。",
    steps: [
      "一つ目の検索結果を開きます。",
      "二つ目の結果を別の練習タブで開きます。",
      "上に並んだ見出しを選んで切り替えます。",
      "日付や発信元を比べ、必要な情報を選びます。",
    ],
    keywords: ["タブ", "切り替え", "比較", "ページ", "消えた"],
    relatedActionIds: ["open-result", "switch-tab", "go-back"],
    relatedGlossaryTermIds: ["tab", "browser", "window"],
    relatedFaqIds: ["faq-tab-lost"],
  },
  {
    id: "help-password-recovery",
    title: "パスワードを忘れたときの考え方",
    summary: "推測を繰り返さず、公式の再設定入口を使います。",
    body:
      "パスワードを忘れたら、ログイン画面の再設定リンクを探します。認証コードは、自分で再設定を始めたときだけ使います。",
    steps: [
      "ログイン画面の『パスワードを忘れた方』を探します。",
      "表示されたメールアドレスが自分のものか確認します。",
      "自分で始めた操作なら、届いた認証コードを確認します。",
      "本物のパスワードやコードを他人へ伝えません。",
    ],
    keywords: ["パスワード", "忘れた", "再設定", "認証コード", "ログイン"],
    relatedActionIds: ["open-account", "password-help", "open-mail"],
    relatedGlossaryTermIds: [
      "password",
      "login",
      "authentication-code",
      "email",
    ],
    relatedFaqIds: ["faq-password-practice", "faq-auth-code"],
  },
  {
    id: "help-find-download",
    title: "ダウンロードしたファイルの探し方",
    summary: "ダウンロードフォルダ、最近使った項目、名前検索の順に探します。",
    body:
      "ダウンロードが終わっても画面上から見えなくなることがあります。ファイル画面を開き、保存場所とファイル名を手がかりに探します。",
    steps: [
      "ファイル画面を開きます。",
      "『ダウンロード』フォルダを確認します。",
      "最近使った項目を確認します。",
      "ファイル名の分かる部分で検索します。",
    ],
    keywords: ["ダウンロード", "ファイル", "保存場所", "見つからない", "フォルダ"],
    relatedActionIds: ["open-files", "select-file"],
    relatedGlossaryTermIds: ["download", "file", "folder", "search"],
    relatedFaqIds: ["faq-download-location", "faq-download-upload"],
  },
  {
    id: "help-attach-file",
    title: "正しいファイルを添付する確認方法",
    summary: "保存場所、名前、内容を確認してから添付します。",
    body:
      "添付ボタンはクリップのマークで表されることがあります。送る前に添付されたファイル名をもう一度読み、違えば外して選び直します。",
    steps: [
      "メールやフォームの添付ボタンを選びます。",
      "保存したフォルダを開きます。",
      "ファイル名と種類を確認して選びます。",
      "送信前に添付欄をもう一度確認します。",
    ],
    keywords: ["添付", "メール", "ファイル", "選ぶ", "間違い"],
    relatedActionIds: ["open-mail", "select-file", "attach-file", "safe-cancel"],
    relatedGlossaryTermIds: ["attachment", "file", "folder", "email"],
    relatedFaqIds: ["faq-attachment-check"],
  },
  {
    id: "help-read-errors",
    title: "エラーメッセージから手がかりを探す",
    summary: "番号、重要な言葉、直前の操作を確認します。",
    body:
      "エラーは解決の手がかりです。すぐ閉じず、番号と文章を読み、何をした直後に出たかを整理します。",
    steps: [
      "エラー番号があれば控えます。",
      "ファイル、ログインなど、重要な言葉を見つけます。",
      "直前に何をしたかを思い出します。",
      "番号と重要な言葉でヘルプを検索します。",
    ],
    keywords: ["エラー", "メッセージ", "番号", "原因", "読めない"],
    relatedActionIds: ["read-error", "open-help", "search-help"],
    relatedGlossaryTermIds: ["error-message", "help", "search"],
    relatedFaqIds: ["faq-error-message"],
  },
  {
    id: "help-missing-button",
    title: "ボタンが見えないときの確認順",
    summary: "スクロール、メニュー、ポップアップ、画面幅を順に確かめます。",
    body:
      "画面の大きさが変わると、ボタンの場所も変わることがあります。下へ続いていないか、別のメニューに入っていないかを確認します。",
    steps: [
      "画面を少し下へスクロールします。",
      "三点メニューや歯車を確認します。",
      "案内やポップアップが重なっていないか見ます。",
      "戻るで一つ前の画面も確認します。",
    ],
    keywords: ["ボタン", "ない", "見えない", "スクロール", "画面が違う"],
    relatedActionIds: [
      "open-more",
      "open-settings",
      "dismiss-popup",
      "go-back",
    ],
    relatedGlossaryTermIds: ["scroll", "more-menu", "settings", "popup"],
    relatedFaqIds: ["faq-button-missing"],
  },
  {
    id: "help-ask-ai",
    title: "AIに状況が伝わる質問の作り方",
    summary: "目的、現在の状態、試したことを短くまとめます。",
    body:
      "AIは画面を自動で見ているとは限りません。状況を言葉で具体的に伝え、答えを試す前に安全な操作か確認します。",
    steps: [
      "最初に『何をしたいか』を書きます。",
      "表示された文章やエラー番号を書きます。",
      "すでに試した方法を書きます。",
      "個人情報、ID、パスワードを取り除いてから質問します。",
    ],
    keywords: ["AI", "質問", "聞き方", "プロンプト", "トラブル"],
    relatedActionIds: ["read-error", "search-help", "write-question"],
    relatedGlossaryTermIds: ["ai", "error-message", "safe-operation"],
    relatedFaqIds: ["faq-ask-ai", "faq-password-practice"],
  },
  {
    id: "help-undo-reset",
    title: "戻る・元に戻す・初期状態の使い分け",
    summary: "困った状態に合わせて、戻し方を選びます。",
    body:
      "前のページへ行くなら戻る、直前の変更を消すなら元に戻す、練習を最初から試すなら初期状態に戻すを使います。進捗データの削除とは別です。",
    steps: [
      "前の画面へ行きたいか、変更を消したいかを考えます。",
      "前の画面なら『戻る』を使います。",
      "直前の変更なら『1つ前に戻す』を使います。",
      "全部やり直したいときだけ練習画面を初期状態に戻します。",
    ],
    keywords: ["戻る", "元に戻す", "リセット", "初期状態", "進捗"],
    relatedActionIds: ["go-back", "safe-cancel"],
    relatedGlossaryTermIds: ["undo", "safe-operation"],
    relatedFaqIds: ["faq-back-vs-undo", "faq-reset-progress"],
  },
];
