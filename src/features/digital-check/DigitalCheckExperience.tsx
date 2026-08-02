"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  buildPromptResult,
  digitalDimensionLabels,
  getNextQuestion,
  type AnswerOption,
  type DigitalAnswer,
  type DigitalQuestion,
} from "./digital-check-data";
import styles from "./DigitalCheckExperience.module.css";

type Phase = "intro" | "quiz" | "result";
type GuideDevice = "pc" | "mobile";

function GuideScreenshot({ src, alt, mobile = false }: { src: string; alt: string; mobile?: boolean }) {
  return (
    <Image
      className={`${styles.guideScreenshot} ${mobile ? styles.guideScreenshotMobile : ""}`}
      src={src}
      width={mobile ? 336 : 890}
      height={mobile ? 624 : 400}
      sizes={mobile ? "(max-width: 720px) 85vw, 336px" : "(max-width: 720px) 95vw, 890px"}
      alt={alt}
    />
  );
}

export function DigitalCheckExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<DigitalAnswer[]>([]);
  const [copied, setCopied] = useState(false);
  const [guideDevice, setGuideDevice] = useState<GuideDevice>("pc");
  const [announcement, setAnnouncement] = useState("");

  const currentQuestion = useMemo(() => phase === "quiz" ? getNextQuestion(answers) : null, [answers, phase]);
  const result = useMemo(() => buildPromptResult(answers), [answers]);

  function beginCheck() {
    setAnswers([]);
    setCopied(false);
    setAnnouncement("1問目を表示しました。");
    setPhase("quiz");
  }

  function answerQuestion(question: DigitalQuestion, option: AnswerOption) {
    const nextAnswers: DigitalAnswer[] = [...answers, {
      questionId: question.id,
      optionId: option.id,
      score: option.score,
      dimension: question.dimension,
      device: option.device,
    }];
    const nextQuestion = getNextQuestion(nextAnswers);
    setAnswers(nextAnswers);
    setCopied(false);
    if (nextQuestion) {
      setAnnouncement(`${nextAnswers.length + 1}問目を表示しました。回答に合わせて質問が変わっています。`);
    } else {
      setAnnouncement("チェックが終わり、あなた向けの項目を作りました。");
      setPhase("result");
      window.requestAnimationFrame(() => document.getElementById("digital-result")?.focus());
    }
  }

  function goBack() {
    if (answers.length === 0) {
      setPhase("intro");
      return;
    }
    setAnswers((current) => current.slice(0, -1));
    setAnnouncement("ひとつ前の質問へ戻りました。");
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setAnnouncement("カスタム指示へ追加する項目をコピーしました。");
    } catch {
      const textarea = document.getElementById("generated-custom-instruction") as HTMLTextAreaElement | null;
      textarea?.focus();
      textarea?.select();
      const copiedWithFallback = Boolean(textarea && document.execCommand("copy"));
      setCopied(copiedWithFallback);
      setAnnouncement(copiedWithFallback
        ? "カスタム指示へ追加する項目をコピーしました。"
        : "自動コピーができなかったため、文章を選択しました。端末のコピー操作を使ってください。");
    }
  }

  return (
    <div className={styles.page}>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      {phase === "intro" ? (
        <section className={styles.intro} aria-labelledby="digital-check-title">
          <p className={styles.eyebrow}>自分に合う説明をつくる</p>
          <h1 id="digital-check-title">デジタルの「分かりやすさ」チェック</h1>
          <p className={styles.lead}>スマホやパソコンについてChatGPTへ聞いたとき、あなたに合う言葉と細かさで答えてもらうための短いチェックです。</p>
          <div className={styles.promiseGrid}>
            <div><strong>9〜11問</strong><span>回答で次の質問が変わります</span></div>
            <div><strong>約3分</strong><span>できる・できないのテストではありません</span></div>
            <div><strong>通信なし</strong><span>回答と文章はこの端末内で作ります</span></div>
          </div>
          <div className={styles.introNote}>
            <strong>結果は点数や順位にしません。</strong>
            <p>「どんな説明なら理解しやすいか」を見つけ、既存のカスタム指示に追加できる短い一項目を作ります。</p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={beginCheck}>チェックを始める <span aria-hidden="true">→</span></button>
          <a className={styles.textLink} href="#registration-guide">登録方法だけ先に見る</a>
        </section>
      ) : null}

      {phase === "quiz" && currentQuestion ? (
        <section className={styles.quiz} aria-labelledby="question-title">
          <div className={styles.quizTop}>
            <div>
              <p className={styles.eyebrow}>あなたの回答で質問が変わります</p>
              <p className={styles.counter}>{answers.length + 1}問目 <span>／ だいたい9〜11問</span></p>
            </div>
            <button type="button" className={styles.backButton} onClick={goBack}>← 戻る</button>
          </div>
          <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${Math.min(100, ((answers.length + 1) / 10) * 100)}%` }} /></div>
          <div className={styles.questionCard}>
            <span className={styles.dimensionLabel}>{currentQuestion.dimension === "device" ? "使っている機器" : digitalDimensionLabels[currentQuestion.dimension]}</span>
            <h1 id="question-title">{currentQuestion.title}</h1>
            <p>{currentQuestion.help}</p>
            <div className={styles.answerGrid}>
              {currentQuestion.options.map((option) => (
                <button type="button" key={option.id} onClick={() => answerQuestion(currentQuestion, option)}>
                  <span><strong>{option.label}</strong>{option.note ? <small>{option.note}</small> : null}</span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>
          <p className={styles.reassurance}>迷ったら、今の気持ちにいちばん近い答えで大丈夫です。</p>
        </section>
      ) : null}

      {phase === "result" ? (
        <>
          <section className={styles.result} aria-labelledby="digital-result" id="result-top">
            <p className={styles.eyebrow}>チェック完了・{answers.length}問で分かりました</p>
            <h1 id="digital-result" tabIndex={-1}>{result.title}</h1>
            <p className={styles.resultSummary}>{result.summary}</p>
            <div className={styles.resultColumns}>
              <section>
                <h2>今できていること</h2>
                <ul>{result.strengths.map((item) => <li key={item}>✓ {item}</li>)}</ul>
              </section>
              <section>
                <h2>こう説明すると分かりやすい</h2>
                <ul>{result.support.map((item) => <li key={item}>● {item}</li>)}</ul>
              </section>
            </div>

            <section className={styles.promptCard} aria-labelledby="prompt-title">
              <div className={styles.promptHeading}>
                <div>
                  <p>カスタム指示へ追加する一項目</p>
                  <h2 id="prompt-title">短くまとめました</h2>
                </div>
                <span>{result.prompt.length}文字</span>
              </div>
              <p className={styles.promptHelp}>既存のカスタム指示を消さず、空いている場所へこの項目を追加してください。</p>
              <textarea id="generated-custom-instruction" readOnly value={result.prompt} aria-label="あなた向けに作られたカスタム指示の項目" />
              <button className={styles.copyButton} type="button" onClick={copyPrompt}>
                {copied ? "✓ コピーしました" : "この項目をコピーする"}
              </button>
              <p className={styles.privacyNote}>氏名・メールアドレス・回答内容は文章に入りません。</p>
            </section>
            <button type="button" className={styles.restartButton} onClick={beginCheck}>回答をやり直す</button>
          </section>
        </>
      ) : null}

      <section className={styles.guide} id="registration-guide" aria-labelledby="guide-title">
        <p className={styles.eyebrow}>コピーしたあとの手順</p>
        <h2 id="guide-title">ChatGPTのカスタム指示へ登録する</h2>
        <p className={styles.guideLead}>使っている機器を選ぶと、画面に合わせて説明します。画像は個人情報を含まない日本語の再現スクリーンショットです。表示名はアプリの更新や契約プランで少し違う場合があります。</p>
        <div className={styles.guideTabs} role="tablist" aria-label="登録する機器">
          <button type="button" role="tab" aria-selected={guideDevice === "pc"} onClick={() => setGuideDevice("pc")}>PC・デスクトップ版</button>
          <button type="button" role="tab" aria-selected={guideDevice === "mobile"} onClick={() => setGuideDevice("mobile")}>スマホアプリ版</button>
        </div>

        {guideDevice === "pc" ? (
          <div className={styles.guidePanel} role="tabpanel" aria-label="PC・デスクトップ版の登録方法">
            <ol className={styles.guideSteps}>
              <li data-guide-shot="pc-1">
                <div><span>1</span><h3>プロフィールから「パーソナライズ」を開く</h3></div>
                <p>ChatGPT左下のプロフィールを押し、メニューの「パーソナライズ」を押します。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-1.png" alt="PC版ChatGPTのプロフィールメニューで、パーソナライズが黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="pc-2">
                <div><span>2</span><h3>「カスタム指示」の入力欄を見つける</h3></div>
                <p>設定画面が開いたら「パーソナライズ」を選び、「カスタム指示」まで進みます。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-2.png" alt="PC版ChatGPTの設定で、パーソナライズとカスタム指示欄が黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="pc-3">
                <div><span>3</span><h3>既存の文章を残して、下へ貼り付ける</h3></div>
                <p>入力欄の末尾で改行し、コピーした項目を貼り付けます。保存ボタンがある画面では最後に押します。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-3.png" alt="PC版ChatGPTのカスタム指示欄へ、デジタル操作の説明レベルを貼り付けた見本画面" />
              </li>
            </ol>
          </div>
        ) : (
          <div className={styles.guidePanel} role="tabpanel" aria-label="スマホアプリ版の登録方法">
            <ol className={styles.guideSteps}>
              <li data-guide-shot="mobile-1">
                <div><span>1</span><h3>サイドバーのプロフィールを押す</h3></div>
                <p>ChatGPTアプリでサイドバーを開き、画面下のプロフィールを押します。</p>
                <GuideScreenshot mobile src="/guides/chatgpt-custom-mobile-1.png" alt="スマホ版ChatGPTのサイドバーで、プロフィールが黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="mobile-2">
                <div><span>2</span><h3>「ChatGPTをカスタマイズ」を開く</h3></div>
                <p>設定から「ChatGPTをカスタマイズ」を押します。「パーソナライズ」と表示される場合は、そちらを選びます。</p>
                <GuideScreenshot mobile src="/guides/chatgpt-custom-mobile-2.png" alt="スマホ版ChatGPTの設定で、ChatGPTをカスタマイズが黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="mobile-3">
                <div><span>3</span><h3>カスタム指示へ貼り付ける</h3></div>
                <p>「カスタマイズを有効にする」があればオンにし、「カスタム指示」の末尾へ貼り付けます。</p>
                <GuideScreenshot mobile src="/guides/chatgpt-custom-mobile-3.png" alt="スマホ版ChatGPTのカスタム指示欄へ、デジタル操作の説明レベルを貼り付けた見本画面" />
              </li>
            </ol>
          </div>
        )}

        <div className={styles.finishBox}>
          <strong>最後に、新しいチャットで試します</strong>
          <p>「ブラウザって何？」など、デジタル操作について一つ質問し、説明が自分に合うか確かめてください。合わなければ、いつでもこのチェックをやり直せます。</p>
          <div>
            <a className={styles.openChatGpt} href="https://chatgpt.com/" target="_blank" rel="noreferrer">ChatGPTを開く <span aria-hidden="true">↗</span></a>
            <a className={styles.helpLink} href="https://help.openai.com/ja-jp/articles/8096356-custom-instructions-for-chatgpt" target="_blank" rel="noreferrer">OpenAI公式の説明を見る</a>
          </div>
        </div>
      </section>
    </div>
  );
}
