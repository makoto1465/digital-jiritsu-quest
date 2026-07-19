import type { FaqItem } from "../lib/types";

export const faqItems: FaqItem[] = [
  {
    id: "faq-wrong-click",
    category: "getting-started",
    question: "違う場所を押してしまいました。壊れませんか？",
    answer:
      "このアプリは完全な練習環境なので壊れません。何が開いたかを見て、閉じる、戻る、または『1つ前に戻す』を試してください。違う場所を押した経験も大切な練習です。",
    keywords: ["間違えた", "押した", "怖い", "壊れる", "戻す"],
    relatedWorldIds: ["world-1", "world-6"],
    relatedGlossaryTermIds: ["undo", "safe-operation"],
  },
  {
    id: "faq-back-vs-undo",
    category: "operation",
    question: "『戻る』と『元に戻す』は何が違いますか？",
    answer:
      "『戻る』は前に見ていた画面へ移動します。『元に戻す』は、文字の変更やファイル移動など、直前に行った変更を取り消します。どちらも練習画面では何度でも試せます。",
    keywords: ["戻る", "元に戻す", "やり直し", "undo", "違い"],
    relatedWorldIds: ["world-1", "world-6"],
    relatedGlossaryTermIds: ["undo", "browser"],
  },
  {
    id: "faq-browser-search",
    category: "internet",
    question: "ブラウザと検索は同じものですか？",
    answer:
      "ブラウザはインターネットのページを見るためのアプリです。検索は、その中で必要なページを探す方法です。ブラウザを開いてから検索窓を使います。",
    keywords: ["ブラウザ", "検索", "インターネット", "違い"],
    relatedWorldIds: ["world-3"],
    relatedGlossaryTermIds: ["browser", "search"],
  },
  {
    id: "faq-tab-lost",
    category: "internet",
    question: "開いていたページが見えなくなりました。",
    answer:
      "ブラウザ上部のタブが切り替わっているかもしれません。並んでいる見出しを一つずつ確認してください。タブを閉じていなければ、前のページは残っています。",
    keywords: ["ページ", "見えない", "消えた", "タブ", "切り替え"],
    relatedWorldIds: ["world-2", "world-3"],
    relatedGlossaryTermIds: ["tab", "browser", "window"],
  },
  {
    id: "faq-password-practice",
    category: "account",
    question: "本物のパスワードを入力してもよいですか？",
    answer:
      "入力しないでください。このアプリでは画面に用意された練習用情報だけを使います。本物のパスワードは、練習サイト、検索窓、AIへの質問に書きません。",
    keywords: ["パスワード", "本物", "入力", "個人情報", "安全"],
    relatedWorldIds: ["world-4", "world-6"],
    relatedGlossaryTermIds: ["password", "safe-operation", "ai"],
  },
  {
    id: "faq-auth-code",
    category: "account",
    question: "認証コードが届いたら、いつでも入力してよいですか？",
    answer:
      "自分でログインや再設定を始めた直後だけ入力します。何もしていないのに届いたコードや、ほかの人から聞かれたコードは渡さないでください。",
    keywords: ["認証コード", "確認コード", "メール", "SMS", "安全"],
    relatedWorldIds: ["world-4"],
    relatedGlossaryTermIds: ["authentication-code", "password", "email"],
  },
  {
    id: "faq-download-location",
    category: "file",
    question: "ダウンロードしたファイルが見つかりません。",
    answer:
      "まずファイル画面の『ダウンロード』フォルダを確認します。見つからないときは、ファイル名の一部で検索し、最近使ったファイルも確認してください。",
    keywords: ["ダウンロード", "ファイル", "見つからない", "保存場所", "探す"],
    relatedWorldIds: ["world-5", "world-6"],
    relatedGlossaryTermIds: ["download", "file", "folder", "search"],
  },
  {
    id: "faq-download-upload",
    category: "file",
    question: "ダウンロードとアップロードの違いは何ですか？",
    answer:
      "ダウンロードはインターネットから自分の端末へ受け取る操作です。アップロードは自分の端末からインターネット上へ渡す操作です。",
    keywords: ["ダウンロード", "アップロード", "違い", "受け取る", "送る"],
    relatedWorldIds: ["world-5"],
    relatedGlossaryTermIds: ["download", "upload", "file"],
  },
  {
    id: "faq-attachment-check",
    category: "file",
    question: "別のファイルを添付してしまいそうで不安です。",
    answer:
      "添付後も、送信前ならファイル名を確認して外せます。名前、種類、内容を確認してから送ります。この練習では実際には送信されません。",
    keywords: ["添付", "違うファイル", "メール", "外す", "送信"],
    relatedWorldIds: ["world-5"],
    relatedGlossaryTermIds: ["attachment", "file", "email", "safe-operation"],
  },
  {
    id: "faq-button-missing",
    category: "troubleshooting",
    question: "説明にあるボタンが画面にありません。",
    answer:
      "画面の下や横に続きがないかスクロールします。三点メニューや歯車の中、ポップアップの後ろに隠れていることもあります。画面が狭いと場所が変わる場合もあります。",
    keywords: ["ボタン", "見つからない", "ない", "スクロール", "画面が違う"],
    relatedWorldIds: ["world-2", "world-6"],
    relatedGlossaryTermIds: ["scroll", "menu", "more-menu", "popup"],
  },
  {
    id: "faq-error-message",
    category: "troubleshooting",
    question: "エラーメッセージが出たら、最初に何をすればよいですか？",
    answer:
      "慌てて閉じず、文章と番号を読みます。何をしようとしていたか、何が表示されたかをメモし、その言葉でヘルプやFAQを検索します。",
    keywords: ["エラー", "メッセージ", "番号", "止まった", "解決"],
    relatedWorldIds: ["world-6"],
    relatedGlossaryTermIds: ["error-message", "help", "faq", "search"],
  },
  {
    id: "faq-ask-ai",
    category: "troubleshooting",
    question: "AIには、どのように質問すると伝わりますか？",
    answer:
      "『やりたいこと』『今の状態や表示された文章』『すでに試したこと』の三つを書きます。端末やアプリの種類も分かれば加えます。個人情報やパスワードは書きません。",
    keywords: ["AI", "質問", "聞き方", "エラー", "解決"],
    relatedWorldIds: ["world-6", "world-7"],
    relatedGlossaryTermIds: ["ai", "error-message", "safe-operation"],
  },
  {
    id: "faq-hint-penalty",
    category: "progress",
    question: "ヒントを使うと点数が下がりますか？",
    answer:
      "下がりません。ヒントを見て解決することも大切な学びです。最初は小さな手がかりだけ表示し、必要なら最後のヒントまでいつでも進めます。",
    keywords: ["ヒント", "点数", "XP", "減点", "分からない"],
    relatedWorldIds: [],
    relatedGlossaryTermIds: ["help", "search"],
  },
  {
    id: "faq-reset-progress",
    category: "progress",
    question: "練習画面を初期状態に戻すと、進捗も消えますか？",
    answer:
      "消えません。『練習画面を初期状態に戻す』は疑似画面だけを戻します。進捗を消す操作は設定画面に分け、確認してから実行します。",
    keywords: ["初期状態", "リセット", "進捗", "消える", "やり直し"],
    relatedWorldIds: [],
    relatedGlossaryTermIds: ["undo", "safe-operation"],
  },
  {
    id: "faq-device-choice",
    category: "getting-started",
    question: "スマートフォンからPC練習を選んでもよいですか？",
    answer:
      "はい。『PCを練習する』『スマートフォンを練習する』は学びたい内容の選択です。今使っている端末に関係なく、どちらも利用できます。",
    keywords: ["PC", "スマホ", "選択", "端末", "両方"],
    relatedWorldIds: ["world-1"],
    relatedGlossaryTermIds: ["app", "window", "home-screen"],
  },
  {
    id: "faq-safe-actions",
    category: "safety",
    question: "安全に試しやすい操作と、注意する操作を教えてください。",
    answer:
      "開く、メニューを見る、戻る、閉じる、検索する、設定項目を見る操作は比較的試しやすいです。削除、購入、送信、公開、個人情報入力、パスワード変更は内容を読んで慎重に判断します。",
    keywords: ["安全", "注意", "削除", "送信", "購入", "公開"],
    relatedWorldIds: ["world-4", "world-5", "world-6"],
    relatedGlossaryTermIds: ["safe-operation", "share", "password"],
  },
];
