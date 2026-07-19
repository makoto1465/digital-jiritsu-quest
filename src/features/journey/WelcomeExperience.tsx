"use client";

import Link from "next/link";
import { journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";
import styles from "./WelcomeExperience.module.css";

const environmentLabels: Record<JourneyEnvironment, string> = {
  windows: "Windows パソコン",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android スマートフォン",
};

export function WelcomeExperience() {
  const { progress, hydrated } = useProgress();
  const environment = hydrated ? progress.selectedEnvironment : null;
  const completed = environment
    ? new Set(progress.completedMissionKeys.filter((key) => key.startsWith(`${environment}:`)).map((key) => key.split(":")[1]))
    : new Set<string>();
  const started = environment
    ? Object.values(progress.missionRecords).some((record) => record.environment === environment && record.attempts > 0)
    : false;
  const nextMission = journeyMissions.find((mission) => !completed.has(mission.id)) ?? journeyMissions[journeyMissions.length - 1];

  return (
    <div className={styles.page} aria-labelledby="welcome-title">
      <section className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.appName}>PC・スマホ実践アプリ</p>
          <h1 id="welcome-title">パソコン・スマホの操作を、画面で練習できます。</h1>
          <p>本物のメール送信・購入・削除は行いません。間違えても、何度でもやり直せます。</p>
        </div>

        {environment ? (
          <div className={styles.savedArea} aria-label="学習の始め方">
            <p className={styles.currentDevice}>前回使った機器：<strong>{environmentLabels[environment]}</strong></p>
            <div className={styles.actionGrid}>
              <Link className={`${styles.actionCard} ${styles.menuCard}`} href={completed.size ? `/journey/${environment}` : "/start"}>
                <span className={styles.actionNumber}>選</span>
                <span><strong>{completed.size ? "練習を選ぶ" : "最初から始める"}</strong><small>{completed.size ? "できた練習と次の練習を選べます" : "機器を選んで1-1から始めます"}</small></span>
                <span aria-hidden="true">→</span>
              </Link>
              {started || completed.size ? (
                <Link className={`${styles.actionCard} ${styles.resumeCard}`} href={`/mission/${environment}/${nextMission.id}`}>
                  <span className={styles.actionNumber}>続</span>
                  <span><strong>前回の続きから始める</strong><small>{nextMission.title}</small></span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <div className={`${styles.actionCard} ${styles.disabledCard}`} aria-disabled="true">
                  <span className={styles.actionNumber}>続</span>
                  <span><strong>前回の続きはまだありません</strong><small>練習を始めると使えるようになります</small></span>
                </div>
              )}
            </div>
            {completed.size ? <Link className={styles.changeDevice} href="/start">使う機器を変える <span aria-hidden="true">→</span></Link> : null}
          </div>
        ) : (
          <div className={styles.firstArea}>
            <p>最初に、練習したい機器を選びます。</p>
            <Link className={styles.startButton} href="/start">最初から始める <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </section>
    </div>
  );
}
