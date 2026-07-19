"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const tools = [
  { term: "戻る", plain: "ひとつ前に見ていた画面へ移る操作。入力中は内容が消えないか確認します。", clue: "←、左向きの山形、画面下の戻る" },
  { term: "取り消す（Undo）", plain: "直前の編集や移動だけを元に戻す操作。『戻る』とは別です。", clue: "↶、元に戻す、Ctrl+Z、Command+Z" },
  { term: "アプリ", plain: "メール、地図、カメラなど、目的ごとに使う道具です。", clue: "ホーム画面、スタート、Dock" },
  { term: "ウィンドウ", plain: "PCでアプリの内容を表示する枠。閉じても保存済みの内容は通常残ります。", clue: "タイトルバー、最小化、最大化、閉じる" },
  { term: "タブ", plain: "一つのブラウザ内で、複数のページを開いたまま切り替える仕組みです。", clue: "ページ名が並ぶ帯、＋" },
  { term: "ファイル", plain: "文書や写真など、名前を付けて保存する一まとまりの情報です。", clue: "名前、種類、更新日、保存場所" },
  { term: "フォルダー", plain: "複数のファイルを分類して入れる場所です。", clue: "📁、新規フォルダー、移動" },
  { term: "ダウンロード", plain: "Web上の資料を、自分の端末の保存場所へ受け取ることです。", clue: "↓、ダウンロード、Downloads" },
  { term: "添付", plain: "メールやフォームへ、写真やファイルを一緒に付けることです。", clue: "📎、ファイルを選ぶ、追加" },
  { term: "共有", plain: "選んだ内容を、別の人やアプリへ渡すこと。相手と公開範囲を確認します。", clue: "四角から矢印、共有、送信先" },
  { term: "権限", plain: "アプリがカメラ、位置情報、連絡先などを使ってよいか決める設定です。", clue: "今回のみ、使用中のみ、許可しない" },
  { term: "公式サイト", plain: "自治体や会社など、情報を出す本人・組織が管理するサイトです。", clue: "運営者名、URL、問い合わせ先、更新日" },
  { term: "アドレス（URL）", plain: "Webページの場所を表す文字列。似た文字への置き換えに注意します。", clue: "https:// から始まる表示、ドメイン" },
  { term: "認証コード", plain: "本人確認のため一時的に届く番号。家族やサポート担当を名乗る人にも渡しません。", clue: "有効期限、6桁前後、ワンタイム" },
  { term: "Wi-Fi", plain: "端末を無線でネットワークへつなぐ仕組みです。接続済みでも通信できない場合があります。", clue: "扇形のマーク、ネットワーク名" },
] as const;

export function ToolboxExperience() {
  const [tab, setTab] = useState<"help" | "words" | "question">("help");
  const [query, setQuery] = useState("");
  const [environment, setEnvironment] = useState("iPhone");
  const [place, setPlace] = useState("");
  const [symptom, setSymptom] = useState("");
  const filtered = useMemo(() => tools.filter((item) => `${item.term}${item.plain}${item.clue}`.includes(query.trim())), [query]);
  const question = `${environment}の${place || "（アプリや画面の名前）"}で、${symptom || "（したかったこと・表示された言葉）"}。直前にした操作は何か、画面に何と出たかを一緒に確認したいです。`;
  return <div className="toolbox-page shell">
    <header className="toolbox-header"><p className="section-label">TOOLBOX</p><h1>困ったときに、<br />自分で次を探す道具。</h1><p>言葉をすべて覚える場所ではありません。今の画面を説明したり、検索したり、人へ質問するために使います。</p></header>
    <div className="toolbox-tabs" role="tablist" aria-label="道具箱の種類"><button role="tab" aria-selected={tab === "help"} type="button" onClick={() => setTab("help")}>困ったとき</button><button role="tab" aria-selected={tab === "words"} type="button" onClick={() => setTab("words")}>画面のことば</button><button role="tab" aria-selected={tab === "question"} type="button" onClick={() => setTab("question")}>質問メモを作る</button></div>
    {tab === "help" ? <section className="toolbox-content"><h2>まず、ここだけ確認</h2><ol className="first-aid"><li><span>1</span><div><strong>表示された言葉をそのまま読む</strong><p>閉じる前に、できなかったことと次の候補を探します。</p></div></li><li><span>2</span><div><strong>直前の操作と、変わった場所を思い出す</strong><p>入力、通信、権限、保存場所のどれに近いか考えます。</p></div></li><li><span>3</span><div><strong>小さく戻すか、別の画面で確かめる</strong><p>取り消し、戻る、別サイト、設定確認のどれか一つだけ試します。</p></div></li><li><span>4</span><div><strong>環境名を入れて公式ヘルプを探す</strong><p>「iPhone 文字が大きい」のように端末名と症状を組み合わせます。</p></div></li></ol><aside className="safety-reminder"><strong>急がせる連絡、送金、認証コードはその場で止まる</strong><p>メッセージ内のリンクや電話番号を使わず、保存済みの公式アプリや公式サイトから確認してください。</p></aside></section> : null}
    {tab === "words" ? <section className="toolbox-content"><label className="tool-search">分からない言葉やマークを探す<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：ダウンロード、矢印" /></label><p className="result-count">{filtered.length}件の説明</p><dl className="tool-list">{filtered.map((item) => <div key={item.term}><dt>{item.term}</dt><dd><p>{item.plain}</p><span>画面の手掛かり：{item.clue}</span></dd></div>)}</dl></section> : null}
    {tab === "question" ? <section className="toolbox-content question-builder"><h2>「分からない」を、伝わる質問に</h2><p>助けを求めることも、自分で目的へ進むための方法です。パスワードや認証コードは書きません。</p><label>使っている環境<select value={environment} onChange={(event) => setEnvironment(event.target.value)}><option>Windows</option><option>Mac</option><option>iPhone</option><option>Android</option></select></label><label>アプリや画面の名前<input value={place} onChange={(event) => setPlace(event.target.value)} placeholder="例：写真、ブラウザ、申込画面" /></label><label>したかったこと・表示された言葉<textarea value={symptom} onChange={(event) => setSymptom(event.target.value)} placeholder="例：写真を付けたいが『アクセスできません』と出た" /></label><div className="question-preview"><span>質問メモ</span><p>{question}</p></div></section> : null}
    <nav className="toolbox-next" aria-label="次の行き先"><Link href="/start">練習で試す →</Link><Link href="/progress">できることを見る</Link></nav>
  </div>;
}
