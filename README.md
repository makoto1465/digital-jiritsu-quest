# デジタル自立クエスト

「分からなくても、試して、調べて、戻しながら自分で進める」力を育てる、デジタル初心者向けの体験型Web教材です。

PC・スマートフォンを模した安全な練習画面の中で、検索、設定、コピー＆ペースト、ファイル整理、アカウント確認、エラー対応などを学べます。シミュレーター内の操作が本物の端末やデータへ影響することはありません。

## 主な機能

- PC版・スマートフォン版、それぞれ7 WORLD・14ステージ
- ステージごとの目的、進行表示、段階ヒント、やさしいフィードバック
- PC・スマートフォンを再現した操作可能な練習シミュレーター
- 課題なしで自由に試せるフリープレイ
- 「1つ前に戻す」「やり直す」「最初に戻す」の復旧操作
- 35語を収録した用語辞典、カテゴリー絞り込み、全文検索、関連語
- FAQ、ヘルプ記事、困りごとの横断検索
- 完了ステージ、XP、身についた力、バッジを記録する進捗画面
- 文字サイズ、コントラスト、動きの軽減を選べる表示設定
- キーボード操作、フォーカス表示、読み上げを考慮したアクセシビリティ
- PC・タブレット・スマートフォン対応のレスポンシブUI

## 学習設計

各WORLDは「案内つき」から始まり、後半ほど自分で考える割合が増えます。

1. まず触ってみる
2. 画面のルールを見つける
3. 検索する・行き来する
4. アカウントの考え方
5. ファイルを扱う
6. 困ったときに自力で進む
7. 自分で課題を解決する

正解以外の場所を押しても減点しません。操作による画面の変化を観察し、戻し、必要ならヒントや辞典で調べる過程そのものを学習として扱います。

## 技術構成

- Next.js 16（App Router）
- React 19
- TypeScript
- CSS（外部UIライブラリ不使用）
- Local Storage（進捗・表示設定の端末内保存）

アカウント登録、外部API、実データの送信はありません。

## ローカルで起動する

Node.js 20.9以降を用意し、次を実行します。

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

本番ビルドの確認:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## ディレクトリ構成

```text
src/
├─ app/                 # App Routerの各画面
├─ components/          # ヘッダー、フッター、共通UI、Provider
├─ content/             # WORLD、ステージ、辞典、FAQ、ヘルプ、バッジ
├─ features/
│  ├─ simulator/        # PC・スマホ練習環境と操作履歴
│  ├─ stages/           # ステージ進行とフィードバック
│  ├─ progress/         # 進捗保存・集計
│  ├─ glossary/         # 用語検索とミニ解説
│  ├─ help/             # 困りごと検索
│  └─ settings/         # 表示・動きの設定
└─ lib/                 # 型定義と共通処理
```

教材データと画面ロジックを分離しているため、文章やステージをコード全体から独立して追加できます。

## WORLD・ステージを追加する

1. `src/content/stages.ts` に `StageDefinition` を追加します。
2. `src/content/worlds.ts` の対象WORLDにステージIDを登録します。
3. 固有の練習内容が必要な場合は `src/features/simulator/scenarios.ts` にシナリオを追加します。
4. `targetActions` の順番と、シミュレーター内で到達する状態が目的文に一致することを確認します。
5. PC幅とスマートフォン幅の両方で、完了・戻す・リセットまで操作確認します。

新しいWORLDを追加する場合も、`worlds.ts` と `stages.ts` のデータ追加が中心です。動的ルートが一覧・詳細画面を生成します。

## 用語・FAQ・ヘルプを追加する

- 用語: `src/content/glossary.ts`
- FAQ: `src/content/faq.ts`
- ヘルプ記事: `src/content/help-articles.ts`

関連IDを設定すると、用語の関連語、FAQからWORLDへの導線、ヘルプ記事から辞典への導線に反映されます。

## 進捗データ

進捗と表示設定はブラウザのLocal Storageへ保存されます。ログイン機能はなく、別のブラウザや端末とは同期しません。設定画面から端末内の記録を消去できます。

保存内容には、完了ステージ、XP、使用した機器モード、ヒント・復旧・フリープレイの利用状況が含まれます。

## GitHubとVercel

GitHubへ登録する例:

```bash
git init -b main
git add .
git commit -m "Create Digital Jiritsu Quest"
git remote add origin https://github.com/OWNER/digital-jiritsu-quest.git
git push -u origin main
```

Vercelへ公開する例:

```bash
npx vercel link
npx vercel deploy --prod
```

環境変数やデータベースは不要です。

## 今後の拡張案

- ステージ制作画面と教材データのCMS化
- 受講者ごとのクラウド同期と複数端末対応
- 音声読み上げ・動画による補助説明
- 教える人向けの進捗レポートとコース編集
- 多言語対応
- より多くのOS・アプリを模したシナリオ

## ライセンス

現時点ではライセンスを設定していません。
