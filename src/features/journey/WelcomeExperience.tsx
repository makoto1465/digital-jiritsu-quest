"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import {
  useProgress,
  type JourneyEnvironment,
} from "@/features/progress/ProgressProvider";
import styles from "./WelcomeExperience.module.css";

const environmentLabels: Record<JourneyEnvironment, string> = {
  windows: "Windows",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android",
};

const discoverySteps = [
  {
    icon: "practice" as const,
    title: "まず、観察する",
    description: "押せそうな場所や、戻る手掛かりを自分で見つけます。",
  },
  {
    icon: "pointer" as const,
    title: "小さく、試す",
    description: "本物のデータへ影響しない画面で、結果を確かめます。",
  },
  {
    icon: "undo" as const,
    title: "戻して、身につける",
    description: "間違えた操作も、元へ戻せたら大切な学びです。",
  },
];

export function WelcomeExperience() {
  const { progress, hydrated } = useProgress();
  const environment = hydrated ? progress.selectedEnvironment : null;
  const hasSavedJourney = environment !== null;
  const primaryHref = hasSavedJourney ? "/journey/" + environment : "/start";
  const primaryLabel = hasSavedJourney ? "続きから" : "練習をはじめる";

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="welcome-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>安全なデジタル発見ラボ</p>
          <h1 id="welcome-title" className={styles.title}>
            分からなくても、
            <span>戻しながら試せる。</span>
          </h1>
          <p className={styles.lead}>
            Windows、Mac、iPhone、Androidを模した練習画面で、
            初めて見るデジタルにも落ち着いて向き合う力を育てます。
          </p>

          <div className={styles.primaryAction} aria-live="polite">
            <Link className={styles.primaryLink} href={primaryHref}>
              <span>{primaryLabel}</span>
              <Icon name="arrowRight" size={22} />
            </Link>
            {hasSavedJourney ? (
              <p className={styles.resumeNote}>
                {environmentLabels[environment]}の記録から再開します。
                <Link href="/start">環境を選び直す</Link>
              </p>
            ) : (
              <p className={styles.resumeNote}>
                登録不要。自分のペースで、いつでも中断できます。
              </p>
            )}
          </div>

          <p className={styles.safetyLine}>
            <Icon name="shieldCheck" size={22} />
            本物の送信・削除・購入は起きません
          </p>
        </div>

        <div className={styles.labVisual} aria-hidden="true">
          <div className={styles.visualHeader}>
            <span />
            <span />
            <span />
            <b>練習環境</b>
          </div>
          <div className={styles.visualCanvas}>
            <div className={styles.devicePair}>
              <div className={styles.monitor}>
                <div className={styles.monitorBar} />
                <div className={styles.monitorContent}>
                  <span className={styles.focusTarget} />
                  <span />
                  <span />
                </div>
              </div>
              <div className={styles.phone}>
                <span className={styles.phoneNotch} />
                <span className={styles.phoneTarget} />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.observation}>
              <span>観察</span>
              <Icon name="arrowRight" size={17} />
              <span>試す</span>
              <Icon name="arrowRight" size={17} />
              <span>戻す</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <div className={styles.methodIntro}>
          <p className={styles.sectionLabel}>HOW IT WORKS</p>
          <h2 id="method-title">正解を覚えるより、進み方を身につける。</h2>
        </div>
        <ol className={styles.stepList}>
          {discoverySteps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.stepIcon}>
                <Icon name={step.icon} size={25} />
              </span>
              <span>
                <strong>{step.title}</strong>
                <small>{step.description}</small>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
