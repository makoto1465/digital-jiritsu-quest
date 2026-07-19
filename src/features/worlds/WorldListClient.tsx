"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/features/progress/ProgressProvider";
import type { DeviceMode, StageDefinition, WorldDefinition } from "@/lib/types";

const worldIcons: IconName[] = ["practice", "eye", "globe", "user", "folder", "help", "award"];

export function WorldListClient({ device, worlds, stages }: { device: DeviceMode; worlds: WorldDefinition[]; stages: StageDefinition[] }) {
  const { progress } = useProgress();
  return (
    <div className="world-grid">
      {worlds.map((world, index) => {
        const deviceStages = stages.filter((stage) => stage.worldId === world.id && stage.device === device);
        const completed = deviceStages.filter((stage) => progress.completedStageIds.includes(stage.id)).length;
        const value = deviceStages.length ? (completed / deviceStages.length) * 100 : 0;
        const status = completed === deviceStages.length && completed > 0 ? "できた" : completed > 0 ? "練習中" : "これから";
        return (
          <article className="world-card" key={world.id}>
            <div className="world-card-top"><span className={`world-number world-${index + 1}`}><Icon name={worldIcons[index]} /></span><span className={`status-pill ${status === "できた" ? "status-complete" : status === "練習中" ? "status-active" : "status-neutral"}`}>{status === "できた" ? <Icon name="check" size={15} /> : null}{status}</span></div>
            <p className="world-label">WORLD {world.order}</p>
            <h2>{world.shortTitle}</h2>
            <p>{world.description}</p>
            <ProgressBar value={value} label={`${device === "pc" ? "PC" : "スマホ"}ステージ`} />
            <div className="world-card-footer"><span>{deviceStages.length} ステージ</span><Link href={`/learn/${device}/world/${world.id}`}>{completed > 0 ? "つづきから" : "このWORLDを見る"}<Icon name="arrowRight" size={18} /></Link></div>
          </article>
        );
      })}
    </div>
  );
}
