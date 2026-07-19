"use client";

import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";
import styles from "./StartExperience.module.css";

const environments: readonly { value: JourneyEnvironment; title: string; note: string; icon: IconName }[] = [
  { value: "windows", title: "Windows パソコン", note: "スタートボタンがあるパソコン", icon: "monitor" },
  { value: "mac", title: "Mac", note: "Appleのマークがあるパソコン", icon: "monitor" },
  { value: "iphone", title: "iPhone", note: "Appleのスマートフォン", icon: "smartphone" },
  { value: "android", title: "Android スマートフォン", note: "iPhone以外の主なスマートフォン", icon: "smartphone" },
];

export function StartExperience() {
  const router = useRouter();
  const { selectEnvironment } = useProgress();

  function start(environment: JourneyEnvironment) {
    selectEnvironment(environment);
    router.push(`/mission/${environment}/pointer`);
  }

  return (
    <div className={styles.page} aria-labelledby="device-title">
      <section className={styles.panel}>
        <p className={styles.step}>はじめにすること</p>
        <h1 id="device-title">練習したい機器を押してください</h1>
        <p className={styles.lead}>押すと、最初の練習が始まります。あとから変更できます。</p>
        <div className={styles.grid}>
          {environments.map((environment) => (
            <button key={environment.value} type="button" onClick={() => start(environment.value)}>
              <span className={styles.icon}><Icon name={environment.icon} size={30} /></span>
              <span><strong>{environment.title}</strong><small>{environment.note}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <p className={styles.help}><strong>どれか分からないとき：</strong>スマートフォンの背面にAppleのマークがあればiPhoneです。それ以外はAndroidを選んでください。</p>
      </section>
    </div>
  );
}
