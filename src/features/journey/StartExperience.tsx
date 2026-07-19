"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  useProgress,
  type JourneyEnvironment,
} from "@/features/progress/ProgressProvider";
import styles from "./StartExperience.module.css";

type DeviceKind = "computer" | "smartphone";
type WizardStep = 1 | 2 | 3 | 4;

interface ChoiceOption<T extends string> {
  value: T;
  title: string;
  description: string;
  symbol: string;
  icon?: IconName;
}

const ENVIRONMENT_STORAGE_KEY = "djq-start-environment";
const CONTROL_STORAGE_KEY = "djq-start-control-mode";

const stepLabels = ["安全について", "機器", "環境", "操作方法"] as const;

const deviceOptions: readonly ChoiceOption<DeviceKind>[] = [
  {
    value: "computer",
    title: "PC",
    description: "マウス、ウィンドウ、ファイルなどを練習します。",
    symbol: "PC",
    icon: "monitor",
  },
  {
    value: "smartphone",
    title: "スマートフォン",
    description: "タップ、アプリ、共有などを練習します。",
    symbol: "SP",
    icon: "smartphone",
  },
];

const computerEnvironments: readonly ChoiceOption<JourneyEnvironment>[] = [
  {
    value: "windows",
    title: "Windows",
    description: "スタート、タスクバー、右クリックを使う環境です。",
    symbol: "W",
  },
  {
    value: "mac",
    title: "Mac",
    description: "Dock、メニューバー、Controlクリックを使う環境です。",
    symbol: "⌘",
  },
];

const smartphoneEnvironments: readonly ChoiceOption<JourneyEnvironment>[] = [
  {
    value: "iphone",
    title: "iPhone",
    description: "iOSのホーム、共有、長押しを使う環境です。",
    symbol: "i",
  },
  {
    value: "android",
    title: "Android",
    description: "Androidのホーム、戻る、長押しを使う環境です。",
    symbol: "A",
  },
];

const computerControls: readonly ChoiceOption<string>[] = [
  {
    value: "mouse",
    title: "マウス",
    description: "左右のボタンとホイールを使います。",
    symbol: "M",
    icon: "mouse",
  },
  {
    value: "trackpad",
    title: "トラックパッド",
    description: "指でポインターやスクロールを動かします。",
    symbol: "T",
    icon: "pointer",
  },
  {
    value: "keyboard",
    title: "キーボード中心",
    description: "Tabやショートカットも丁寧に案内します。",
    symbol: "K",
    icon: "keyboard",
  },
  {
    value: "unsure",
    title: "まだ分からない",
    description: "画面を見ながら、あとで選び直せます。",
    symbol: "?",
    icon: "help",
  },
];

const iphoneControls: readonly ChoiceOption<string>[] = [
  {
    value: "face-id",
    title: "ホームボタンなし",
    description: "画面下端からのジェスチャーを練習します。",
    symbol: "↥",
    icon: "smartphone",
  },
  {
    value: "home-button",
    title: "ホームボタンあり",
    description: "画面下の丸いボタンを使う機種です。",
    symbol: "○",
    icon: "smartphone",
  },
  {
    value: "unsure",
    title: "まだ分からない",
    description: "見分け方から一緒に確認します。",
    symbol: "?",
    icon: "help",
  },
];

const androidControls: readonly ChoiceOption<string>[] = [
  {
    value: "gestures",
    title: "ジェスチャー",
    description: "画面下端や左右端から指を動かします。",
    symbol: "↥",
    icon: "pointer",
  },
  {
    value: "three-buttons",
    title: "3つのボタン",
    description: "戻る、ホーム、履歴のボタンを使います。",
    symbol: "◁○□",
    icon: "menu",
  },
  {
    value: "unsure",
    title: "まだ分からない",
    description: "表示を見ながら、あとで選び直せます。",
    symbol: "?",
    icon: "help",
  },
];

function getControlOptions(environment: JourneyEnvironment | null) {
  if (environment === "iphone") return iphoneControls;
  if (environment === "android") return androidControls;
  return computerControls;
}

function ChoiceGrid<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T | null;
  options: readonly ChoiceOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.choiceGrid}>
      {options.map((option) => {
        const inputId = "start-" + name + "-" + option.value;
        const descriptionId = inputId + "-description";
        return (
          <label className={styles.choice} key={option.value} htmlFor={inputId}>
            <input
              checked={value === option.value}
              id={inputId}
              name={name}
              type="radio"
              value={option.value}
              aria-describedby={descriptionId}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceContent}>
              <span className={styles.choiceSymbol} aria-hidden="true">
                {option.icon ? <Icon name={option.icon} size={27} /> : option.symbol}
              </span>
              <span className={styles.choiceText}>
                <strong>{option.title}</strong>
                <small id={descriptionId}>{option.description}</small>
              </span>
              <span className={styles.choiceMark} aria-hidden="true">
                <Icon name="check" size={18} />
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function StartExperience() {
  const router = useRouter();
  const { selectEnvironment } = useProgress();
  const stepStatusRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState<WizardStep>(1);
  const [device, setDevice] = useState<DeviceKind | null>(null);
  const [environment, setEnvironment] =
    useState<JourneyEnvironment | null>(null);
  const [controlMode, setControlMode] = useState<string | null>(null);

  const environmentOptions =
    device === "computer" ? computerEnvironments : smartphoneEnvironments;
  const controlOptions = getControlOptions(environment);
  const canContinue =
    step === 1 ||
    (step === 2 && device !== null) ||
    (step === 3 && environment !== null) ||
    (step === 4 && controlMode !== null);

  useEffect(() => {
    stepStatusRef.current?.focus();
  }, [step]);

  function chooseDevice(nextDevice: DeviceKind) {
    if (nextDevice !== device) {
      setEnvironment(null);
      setControlMode(null);
    }
    setDevice(nextDevice);
  }

  function chooseEnvironment(nextEnvironment: JourneyEnvironment) {
    if (nextEnvironment !== environment) setControlMode(null);
    setEnvironment(nextEnvironment);
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1) as WizardStep);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;

    if (step < 4) {
      setStep((step + 1) as WizardStep);
      return;
    }

    if (!environment || !controlMode) return;

    try {
      window.localStorage.setItem(ENVIRONMENT_STORAGE_KEY, environment);
      window.localStorage.setItem(CONTROL_STORAGE_KEY, controlMode);
    } catch {
      // The selected journey still works for this session when storage is blocked.
    }

    selectEnvironment(environment);
    router.push("/journey/" + environment);
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <p className={styles.kicker}>練習環境の準備</p>
        <h1>あなたの画面に合わせます。</h1>
        <p>4つの短い質問で、説明するボタンや動かし方を選びます。あとから変更できます。</p>
      </div>

      <nav className={styles.progress} aria-label="開始設定の進み具合">
        <ol>
          {stepLabels.map((label, index) => {
            const stepNumber = (index + 1) as WizardStep;
            const isCurrent = stepNumber === step;
            const isComplete = stepNumber < step;
            return (
              <li
                className={isCurrent ? styles.currentStep : undefined}
                key={label}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span aria-hidden="true">
                  {isComplete ? <Icon name="check" size={16} /> : stepNumber}
                </span>
                <small>{label}</small>
              </li>
            );
          })}
        </ol>
      </nav>

      <form className={styles.wizard} onSubmit={handleSubmit}>
        <p
          className={styles.stepStatus}
          ref={stepStatusRef}
          tabIndex={-1}
          aria-live="polite"
        >
          ステップ {step} / 4：{stepLabels[step - 1]}
        </p>

        {step === 1 ? (
          <section className={styles.stepPanel} aria-labelledby="start-step-title">
            <div className={styles.safetyIcon} aria-hidden="true">
              <Icon name="shieldCheck" size={36} />
            </div>
            <h2 id="start-step-title">
              ここは、何度でも戻せる練習場所です。
            </h2>
            <p className={styles.stepLead}>
              表示される名前、メール、ファイル、Webサイトはすべて架空です。
            </p>
            <ul className={styles.safetyList}>
              <li>
                <Icon name="checkCircle" size={22} />
                <span><strong>本物のデータは変わりません</strong>送信、削除、購入も練習画面の中だけです。</span>
              </li>
              <li>
                <Icon name="undo" size={22} />
                <span><strong>間違えても戻せます</strong>一つ戻す、やり直す、最初からをいつでも使えます。</span>
              </li>
              <li>
                <Icon name="alert" size={22} />
                <span><strong>秘密の情報は入力しません</strong>本物のパスワードや認証コードは使いません。</span>
              </li>
            </ul>
          </section>
        ) : null}

        {step === 2 ? (
          <fieldset className={styles.stepPanel}>
            <legend id="start-step-title">
              どちらを練習しますか？
            </legend>
            <p className={styles.stepLead}>
              いま使っている機器と違う方を選んでも大丈夫です。
            </p>
            <ChoiceGrid
              name="device"
              value={device}
              options={deviceOptions}
              onChange={chooseDevice}
            />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className={styles.stepPanel}>
            <legend id="start-step-title">
              使い方を覚えたい環境は？
            </legend>
            <p className={styles.stepLead}>
              同じ目的でも、名前や操作が少しずつ違います。
            </p>
            <ChoiceGrid
              name="environment"
              value={environment}
              options={environmentOptions}
              onChange={chooseEnvironment}
            />
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className={styles.stepPanel}>
            <legend id="start-step-title">
              いつもの操作方法に近いものは？
            </legend>
            <p className={styles.stepLead}>
              分からなければ「まだ分からない」を選べます。
            </p>
            <ChoiceGrid
              name="control-mode"
              value={controlMode}
              options={controlOptions}
              onChange={setControlMode}
            />
          </fieldset>
        ) : null}

        <div className={styles.actions}>
          {step > 1 ? (
            <button className={styles.backButton} type="button" onClick={goBack}>
              <Icon name="arrowLeft" size={20} />
              戻る
            </button>
          ) : (
            <span />
          )}
          <button
            className={styles.nextButton}
            type="submit"
            disabled={!canContinue}
          >
            {step === 4 ? "この環境で始める" : "次へ"}
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </form>

      <p className={styles.keyboardNote}>
        <Icon name="keyboard" size={20} />
        Tabキーで移動し、SpaceまたはEnterでも選べます。
      </p>
    </div>
  );
}
