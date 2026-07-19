"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { journeyAreas, journeyMissions } from "@/content/journey";
import { useProgress, type JourneyEnvironment } from "@/features/progress/ProgressProvider";
import type { JourneyAreaId } from "@/lib/journey-types";

const environmentNames: Record<JourneyEnvironment, string> = {
  windows: "Windows パソコン",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android スマートフォン",
};

export function JourneyMap({ environment }: { environment: JourneyEnvironment }) {
  const { progress, hydrated, selectEnvironment } = useProgress();
  useEffect(() => selectEnvironment(environment), [environment, selectEnvironment]);

  const completed = useMemo(
    () => new Set(progress.completedMissionKeys.filter((key) => key.startsWith(`${environment}:`)).map((key) => key.split(":")[1])),
    [environment, progress.completedMissionKeys],
  );
  const firstIncompleteIndex = journeyMissions.findIndex((mission) => !completed.has(mission.id));
  const unlockedThrough = firstIncompleteIndex === -1 ? journeyMissions.length - 1 : firstIncompleteIndex;
  const nextMission = journeyMissions[firstIncompleteIndex === -1 ? journeyMissions.length - 1 : firstIncompleteIndex];
  const [selectedAreaId, setSelectedAreaId] = useState<JourneyAreaId | null>(null);
  const selectedArea = journeyAreas.find((area) => area.id === selectedAreaId) ?? journeyAreas.find((area) => area.id === nextMission.areaId) ?? journeyAreas[0];
  const selectedMissions = journeyMissions.filter((mission) => mission.areaId === selectedArea.id);
  const completionRate = Math.round((completed.size / journeyMissions.length) * 100);

  function isMissionUnlocked(missionId: string) {
    const index = journeyMissions.findIndex((mission) => mission.id === missionId);
    return completed.has(missionId) || index <= unlockedThrough;
  }

  return (
    <div className="journey-page">
      <section className="curriculum shell" aria-labelledby="journey-title">
        <header className="curriculum__header">
          <div>
            <p>{environmentNames[environment]}・できた項目 {hydrated ? `${completed.size} / ${journeyMissions.length}` : "— / 32"}</p>
            <h1 id="journey-title">練習を選ぶ</h1>
          </div>
          <Link className="change-environment" href="/start">使う機器を変える</Link>
        </header>

        <div className="curriculum__quick-actions" aria-label="すぐに始める">
          <Link className="quick-action quick-action--restart" href={`/mission/${environment}/pointer`}>
            <span>最初</span><strong>最初から始める</strong><small>1-1「日付をクリックする」</small><b aria-hidden="true">→</b>
          </Link>
          {completed.size ? (
            <Link className="quick-action quick-action--resume" href={`/mission/${environment}/${nextMission.id}`}>
              <span>続き</span><strong>前回の続きから始める</strong><small>{nextMission.title}</small><b aria-hidden="true">→</b>
            </Link>
          ) : (
            <div className="quick-action quick-action--disabled" aria-disabled="true">
              <span>続き</span><strong>前回の続きはまだありません</strong><small>1-1を終えると使えます</small>
            </div>
          )}
        </div>

        <div className="curriculum__progress" aria-label={`全体の${completionRate}%完了`}><span style={{ width: `${completionRate}%` }} /></div>

        <section className="curriculum-picker" aria-labelledby="curriculum-picker-title">
          <div className="curriculum-picker__heading">
            <h2 id="curriculum-picker-title">番号から選ぶ</h2>
            <p>できた練習と、その次の練習を選べます。</p>
          </div>

          <div className="area-selector" aria-label="学習内容の番号">
            {journeyAreas.map((area) => {
              const areaMissions = journeyMissions.filter((mission) => mission.areaId === area.id);
              const doneCount = areaMissions.filter((mission) => completed.has(mission.id)).length;
              const unlocked = areaMissions.some((mission) => isMissionUnlocked(mission.id));
              const selected = area.id === selectedArea.id;
              return (
                <button
                  aria-pressed={selected}
                  className={`${selected ? "is-selected" : ""}${doneCount === areaMissions.length ? " is-complete" : ""}`}
                  disabled={!unlocked}
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  type="button"
                >
                  <span>{area.order}</span><strong>{area.title}</strong><small>{unlocked ? `${doneCount} / 4` : "🔒 未開放"}</small>
                </button>
              );
            })}
          </div>

          <div className="mission-selector">
            <h3>{selectedArea.order}. {selectedArea.title}</h3>
            <ol>
              {selectedMissions.map((mission, index) => {
                const unlocked = isMissionUnlocked(mission.id);
                const done = completed.has(mission.id);
                const number = `${selectedArea.order}-${index + 1}`;
                return (
                  <li key={mission.id}>
                    {unlocked ? (
                      <Link className={done ? "is-complete" : "is-next"} href={`/mission/${environment}/${mission.id}`}>
                        <span>{done ? "✓" : number}</span><strong>{mission.title}</strong><small>{done ? "もう一度練習できます" : "次に進めます"}</small><b aria-hidden="true">→</b>
                      </Link>
                    ) : (
                      <div className="is-locked" aria-disabled="true">
                        <span>🔒</span><strong>{number}　{mission.title}</strong><small>前の練習が終わると選べます</small>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </section>
    </div>
  );
}
