"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  buildPromptResult,
  digitalDimensionLabels,
  estimateTotalQuestions,
  getGuideDevice,
  getNextQuestion,
  getPasteDevice,
  scoreWordAnswer,
  type AnswerOption,
  type DigitalAnswer,
  type DigitalQuestion,
} from "./digital-check-data";
import styles from "./DigitalCheckExperience.module.css";

type Phase = "intro" | "quiz" | "result";
type GuideDevice = "pc" | "mobile";
type PasteDevice = "iphone" | "android" | "windows" | "mac";

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

/** 「貼り付け（ペースト）」の手順。機器ごとに押す場所とキーが違うので、そのまま真似できる形で書く。 */
const pasteGuides: Readonly<Record<PasteDevice, { label: string; note: string; steps: readonly string[]; rescue: string }>> = {
  iphone: {
    label: "iPhone",
    note: "指で長押しして出るメニューから「ペースト」を選びます。",
    steps: [
      "文章を入れたい四角い枠を、1回タップします。細い線（カーソル）が点滅します。",
      "同じ場所を、指で1秒くらい押したままにします（長押し）。",
      "小さな黒いメニューが出たら、「ペースト」をタップします。",
      "枠の中に文章が入ったか、目で見て確かめます。",
    ],
    rescue: "「ペースト」が見当たらないときは、メニューの右端にある「＞」を押すと続きが出てきます。",
  },
  android: {
    label: "Android",
    note: "指で長押しして出るメニューから「貼り付け」を選びます。",
    steps: [
      "文章を入れたい四角い枠を、1回タップします。細い線（カーソル）が点滅します。",
      "同じ場所を、指で1秒くらい押したままにします（長押し）。",
      "出てきたメニューの「貼り付け」をタップします。",
      "枠の中に文章が入ったか、目で見て確かめます。",
    ],
    rescue: "「貼り付け」が出ないときは、いったん枠の外を1回タップしてから、もう一度長押ししてください。",
  },
  windows: {
    label: "Windows パソコン",
    note: "キーボードの Ctrl を押したまま V を押します。",
    steps: [
      "文章を入れたい枠を、1回左クリックします。細い線（カーソル）が点滅します。",
      "キーボードの Ctrl（コントロール）キーを押したままにします。",
      "そのまま V を1回押して、両方の指を離します。",
      "枠の中に文章が入ったか、目で見て確かめます。",
    ],
    rescue: "キーが分かりにくいときは、枠の上で右クリックし、出てきたメニューの「貼り付け」を1回左クリックしても同じです。",
  },
  mac: {
    label: "Mac",
    note: "キーボードの command を押したまま V を押します。",
    steps: [
      "文章を入れたい枠を、1回クリックします。細い線（カーソル）が点滅します。",
      "キーボードの command（コマンド）キーを押したままにします。",
      "そのまま V を1回押して、両方の指を離します。",
      "枠の中に文章が入ったか、目で見て確かめます。",
    ],
    rescue: "キーが分かりにくいときは、control キーを押しながら枠をクリックし、出てきたメニューの「ペースト」を選んでも同じです。",
  },
};

function PasteHowTo({ device, onChangeDevice, compact = false }: { device: PasteDevice; onChangeDevice: (next: PasteDevice) => void; compact?: boolean }) {
  const guide = pasteGuides[device];
  return (
    <section className={`${styles.pasteBox} ${compact ? styles.pasteBoxCompact : ""}`} aria-labelledby={compact ? "paste-title-compact" : "paste-title"}>
      <p className={styles.eyebrow}>コピーの次にすること</p>
      <h3 id={compact ? "paste-title-compact" : "paste-title"}>②「貼り付け（ペースト）」のやり方</h3>
      <p className={styles.pasteLead}>
        コピーは、ボタンを押した時点で終わっています。<strong>画面は変わりませんが、機器の中に文章が入っています。</strong>次は、その文章を入れたい場所に「貼り付け」ます。
      </p>
      <div className={styles.pasteTabs} role="tablist" aria-label="貼り付ける機器">
        {(Object.keys(pasteGuides) as PasteDevice[]).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={device === key} onClick={() => onChangeDevice(key)}>
            {pasteGuides[key].label}
          </button>
        ))}
      </div>
      <div className={styles.pastePanel} role="tabpanel" aria-label={`${guide.label}での貼り付け方`}>
        <p className={styles.pasteNote}>{guide.note}</p>
        <ol className={styles.pasteSteps}>
          {guide.steps.map((step, index) => (
            <li key={step}><span aria-hidden="true">{index + 1}</span><p>{step}</p></li>
          ))}
        </ol>
        <p className={styles.pasteRescue}><strong>うまくいかないとき：</strong>{guide.rescue}</p>
      </div>
    </section>
  );
}

export function DigitalCheckExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<DigitalAnswer[]>([]);
  const [multiSelection, setMultiSelection] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [guideDevice, setGuideDevice] = useState<GuideDevice | null>(null);
  const [pasteDevice, setPasteDevice] = useState<PasteDevice | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const currentQuestion = useMemo(() => phase === "quiz" ? getNextQuestion(answers) : null, [answers, phase]);
  const result = useMemo(() => buildPromptResult(answers), [answers]);
  const totalQuestions = useMemo(() => estimateTotalQuestions(answers), [answers]);
  const activeGuideDevice = guideDevice ?? getGuideDevice(answers);
  const activePasteDevice = pasteDevice ?? getPasteDevice(answers);

  function beginCheck() {
    setAnswers([]);
    setMultiSelection([]);
    setCopied(false);
    setGuideDevice(null);
    setPasteDevice(null);
    setAnnouncement("1問目を表示しました。");
    setPhase("quiz");
  }

  function commitAnswer(question: DigitalQuestion, optionIds: readonly string[], score: DigitalAnswer["score"], device?: DigitalAnswer["device"]) {
    const nextAnswers: DigitalAnswer[] = [...answers, { questionId: question.id, optionIds, score, dimension: question.dimension, device }];
    const nextQuestion = getNextQuestion(nextAnswers);
    setAnswers(nextAnswers);
    setMultiSelection([]);
    setCopied(false);
    if (nextQuestion) {
      setAnnouncement(`${nextAnswers.length + 1}問目を表示しました。答えに合わせて質問が変わっています。`);
      return;
    }
    setAnnouncement("チェックが終わり、あなた向けの文章ができました。");
    setPhase("result");
    window.requestAnimationFrame(() => document.getElementById("digital-result")?.focus());
  }

  function answerSingle(question: DigitalQuestion, option: AnswerOption) {
    commitAnswer(question, [option.id], option.score, option.device);
  }

  function toggleMulti(option: AnswerOption) {
    setMultiSelection((current) => {
      if (option.exclusive) return current.includes(option.id) ? [] : [option.id];
      // 「どれも初めて見た」と、ふつうの選択肢は同時に選べない
      const others = current.filter((id) => id !== "none");
      return others.includes(option.id)
        ? others.filter((id) => id !== option.id)
        : [...others, option.id];
    });
  }

  function submitMulti(question: DigitalQuestion) {
    const selection = multiSelection.length ? multiSelection : ["none"];
    commitAnswer(question, selection, scoreWordAnswer(selection), undefined);
  }

  function goBack() {
    setMultiSelection([]);
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
      setAnnouncement("文章をコピーしました。次は、貼り付けのやり方をご覧ください。");
    } catch {
      const textarea = document.getElementById("generated-custom-instruction") as HTMLTextAreaElement | null;
      textarea?.focus();
      textarea?.select();
      const copiedWithFallback = Boolean(textarea && document.execCommand("copy"));
      setCopied(copiedWithFallback);
      setAnnouncement(copiedWithFallback
        ? "文章をコピーしました。次は、貼り付けのやり方をご覧ください。"
        : "自動でコピーできなかったため、文章を選んだ状態にしました。お使いの機器のコピー操作を使ってください。");
    }
  }

  return (
    <div className={styles.page}>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      {phase === "intro" ? (
        <section className={styles.intro} aria-labelledby="digital-check-title">
          <p className={styles.eyebrow}>自分に合う説明をつくる</p>
          <h1 id="digital-check-title">デジタルの「分かりやすさ」チェック</h1>
          <p className={styles.lead}>スマホやパソコンのことをChatGPTに聞いたとき、あなたに合う言葉と細かさで答えてもらうための短いチェックです。</p>
          <div className={styles.promiseGrid}>
            <div><strong>8〜10問</strong><span>やさしい質問から始まり、答えに合わせて内容が変わります</span></div>
            <div><strong>約3分</strong><span>できる・できないを調べるテストではありません</span></div>
            <div><strong>通信なし</strong><span>答えと文章は、この端末の中だけで作ります</span></div>
          </div>
          <div className={styles.introNote}>
            <strong>分からない言葉があっても大丈夫です。</strong>
            <p>「知らない」と答えるほど、ていねいな説明を作ります。点数や順位はつきません。</p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={beginCheck}>チェックを始める <span aria-hidden="true">→</span></button>
          <a className={styles.textLink} href="#paste-guide">貼り付け方・登録方法だけ先に見る</a>
        </section>
      ) : null}

      {phase === "quiz" && currentQuestion ? (
        <section className={styles.quiz} aria-labelledby="question-title">
          <div className={styles.quizTop}>
            <div>
              <p className={styles.eyebrow}>答えに合わせて、次の質問が変わります</p>
              <p className={styles.counter}>{answers.length + 1}問目 <span>／ だいたい{totalQuestions}問</span></p>
            </div>
            <button type="button" className={styles.backButton} onClick={goBack}>← 戻る</button>
          </div>
          <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${Math.min(100, ((answers.length + 1) / totalQuestions) * 100)}%` }} /></div>
          <div className={styles.questionCard}>
            <span className={styles.dimensionLabel}>{currentQuestion.dimension === "device" ? "使っている機器" : digitalDimensionLabels[currentQuestion.dimension]}</span>
            <h1 id="question-title">{currentQuestion.title}</h1>
            <p>{currentQuestion.help}</p>

            {currentQuestion.kind === "multi" ? (
              <>
                <div className={styles.checkGrid}>
                  {currentQuestion.options.map((option) => {
                    const checked = multiSelection.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={checked ? styles.checkedOption : undefined}
                        aria-pressed={checked}
                        onClick={() => toggleMulti(option)}
                      >
                        <span className={styles.checkBox} aria-hidden="true">{checked ? "✓" : ""}</span>
                        <span><strong>{option.label}</strong>{option.note ? <small>{option.note}</small> : null}</span>
                      </button>
                    );
                  })}
                </div>
                <button className={styles.primaryButton} type="button" onClick={() => submitMulti(currentQuestion)}>
                  {multiSelection.length ? `${multiSelection.filter((id) => id !== "none").length}個を選んで次へ` : "選ばずに次へ進む"} <span aria-hidden="true">→</span>
                </button>
              </>
            ) : (
              <div className={styles.answerGrid}>
                {currentQuestion.options.map((option) => (
                  <button type="button" key={option.id} onClick={() => answerSingle(currentQuestion, option)}>
                    <span><strong>{option.label}</strong>{option.note ? <small>{option.note}</small> : null}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className={styles.reassurance}>迷ったら、今の気持ちにいちばん近い答えで大丈夫です。あとから戻れます。</p>
        </section>
      ) : null}

      {phase === "result" ? (
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
              <h2>こう説明してもらうと分かりやすい</h2>
              <ul>{result.support.map((item) => <li key={item}>● {item}</li>)}</ul>
            </section>
          </div>

          <section className={styles.promptCard} aria-labelledby="prompt-title">
            <div className={styles.promptHeading}>
              <div>
                <p>ChatGPTに覚えてもらう文章</p>
                <h2 id="prompt-title">この文章ができました</h2>
              </div>
              <span>{result.prompt.length}文字</span>
            </div>
            <p className={styles.promptHelp}>すでに書いてある文章は消さずに、いちばん下へ足してください。</p>
            <textarea id="generated-custom-instruction" readOnly value={result.prompt} aria-label="あなた向けに作られた、ChatGPTへ登録する文章" />
            <button className={styles.copyButton} type="button" onClick={copyPrompt}>
              {copied ? "✓ コピーしました" : "① この文章をコピーする"}
            </button>
            {copied ? (
              <p className={styles.copiedHint}>
                コピーできました。画面は変わりませんが、機器の中に文章が入っています。<a href="#paste-guide">次は「貼り付け」のやり方を見る</a>
              </p>
            ) : (
              <p className={styles.privacyNote}>氏名・メールアドレス・答えた内容は、この文章に入りません。</p>
            )}
          </section>
          <button type="button" className={styles.restartButton} onClick={beginCheck}>答えをやり直す</button>
        </section>
      ) : null}

      <div id="paste-guide">
        <PasteHowTo device={activePasteDevice} onChangeDevice={setPasteDevice} />
      </div>

      <section className={styles.guide} id="registration-guide" aria-labelledby="guide-title">
        <p className={styles.eyebrow}>貼り付ける場所を開く</p>
        <h2 id="guide-title">③ ChatGPTのカスタム指示へ登録する</h2>
        <p className={styles.guideLead}>使っている機器を選ぶと、画面に合わせて説明します。画像は個人情報を含まない日本語の再現画面です。表示名は、アプリの更新や契約プランで少し違う場合があります。</p>
        <div className={styles.guideTabs} role="tablist" aria-label="登録する機器">
          <button type="button" role="tab" aria-selected={activeGuideDevice === "pc"} onClick={() => setGuideDevice("pc")}>パソコン版</button>
          <button type="button" role="tab" aria-selected={activeGuideDevice === "mobile"} onClick={() => setGuideDevice("mobile")}>スマホアプリ版</button>
        </div>

        {activeGuideDevice === "pc" ? (
          <div className={styles.guidePanel} role="tabpanel" aria-label="パソコン版の登録方法">
            <ol className={styles.guideSteps}>
              <li data-guide-shot="pc-1">
                <div><span>1</span><h3>プロフィールから「パーソナライズ」を開く</h3></div>
                <p>ChatGPT左下のプロフィールを押し、メニューの「パーソナライズ」を押します。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-1.png" alt="パソコン版ChatGPTのプロフィールメニューで、パーソナライズが黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="pc-2">
                <div><span>2</span><h3>「カスタム指示」の入力欄を見つける</h3></div>
                <p>設定画面が開いたら「パーソナライズ」を選び、「カスタム指示」まで進みます。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-2.png" alt="パソコン版ChatGPTの設定で、パーソナライズとカスタム指示欄が黄色く囲まれた見本画面" />
              </li>
              <li data-guide-shot="pc-3">
                <div><span>3</span><h3>いちばん下で、貼り付ける</h3></div>
                <p>すでに書いてある文章の末尾をクリックし、Enter キーで1行あけてから、②で説明した方法（Ctrl または command を押しながら V）で貼り付けます。保存ボタンがある画面では、最後に押します。</p>
                <GuideScreenshot src="/guides/chatgpt-custom-pc-3.png" alt="パソコン版ChatGPTのカスタム指示欄へ、デジタル操作の説明レベルを貼り付けた見本画面" />
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
                <div><span>3</span><h3>いちばん下で、貼り付ける</h3></div>
                <p>「カスタマイズを有効にする」があればオンにし、「カスタム指示」の枠を長押しして、②で説明した方法（メニューの「ペースト」または「貼り付け」）で貼り付けます。</p>
                <GuideScreenshot mobile src="/guides/chatgpt-custom-mobile-3.png" alt="スマホ版ChatGPTのカスタム指示欄へ、デジタル操作の説明レベルを貼り付けた見本画面" />
              </li>
            </ol>
          </div>
        )}

        <div className={styles.finishBox}>
          <strong>最後に、新しいチャットで試します</strong>
          <p>「ブラウザって何？」など、スマホやパソコンのことを一つ聞いてみて、説明が自分に合うか確かめてください。合わなければ、いつでもこのチェックをやり直せます。</p>
          <div>
            <a className={styles.openChatGpt} href="https://chatgpt.com/" target="_blank" rel="noreferrer">ChatGPTを開く <span aria-hidden="true">↗</span></a>
            <a className={styles.helpLink} href="https://help.openai.com/ja-jp/articles/8096356-custom-instructions-for-chatgpt" target="_blank" rel="noreferrer">OpenAI公式の説明を見る</a>
          </div>
        </div>
      </section>
    </div>
  );
}
