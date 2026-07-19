"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useProgress } from "@/features/progress/ProgressProvider";
import type { DeviceMode, StageDefinition } from "@/lib/types";

const guidanceNames = { guided: "案内つき", supported: "少し自分で", independent: "目的だけ" } as const;

export function StageListClient({ device, stages }: { device: DeviceMode; stages: StageDefinition[] }) {
  const { progress } = useProgress();
  return (
    <div className="stage-card-list">
      {stages.map((stage, index) => {
        const done = progress.completedStageIds.includes(stage.id);
        return (
          <article className={`stage-card ${done ? "is-complete" : ""}`} key={stage.id}>
            <div className="stage-index"><span>{done ? <Icon name="check" /> : index + 1}</span><small>STAGE</small></div>
            <div className="stage-card-copy">
              <div className="stage-meta"><span>{stage.code}</span><span><Icon name="clock" size={16} />約{stage.estimatedMinutes}分</span><span><Icon name="lightbulb" size={16} />{guidanceNames[stage.guidance]}</span></div>
              <h2>{stage.title}</h2><p>{stage.description}</p>
              <div className="skill-tags">{stage.competencyIds.map((skill) => <span key={skill}>{skill === "safe-experiment" ? "安全に試す" : skill === "research" ? "調べる" : skill === "recovery" ? "元に戻す" : skill === "observation" ? "観察する" : skill === "transfer" ? "応用する" : "自分で探索"}</span>)}</div>
            </div>
            <div className="stage-card-action"><span className={`status-pill ${done ? "status-complete" : "status-neutral"}`}>{done ? "できた" : "これから"}</span><Link className="button button-primary" href={`/play/${stage.id}`}>{done ? "もう一度ためす" : "このステージへ"}<Icon name="arrowRight" size={18} /></Link></div>
          </article>
        );
      })}
      <article className="stage-card free-stage-card"><div className="stage-index"><span><Icon name="practice" /></span><small>FREE</small></div><div className="stage-card-copy"><div className="stage-meta"><span>フリープレイ</span><span>いつでも利用可能</span></div><h2>このWORLDの操作を自由に試す</h2><p>課題や完了条件はありません。気になる場所を好きな順番で触れます。</p></div><div className="stage-card-action"><Link className="button button-secondary" href={`/free-play/${device}`}>自由に試す<Icon name="arrowRight" size={18} /></Link></div></article>
    </div>
  );
}
