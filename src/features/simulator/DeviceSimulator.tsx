"use client";

import { usePathname } from "next/navigation";
import { MobileSimulator } from "./MobileSimulator";
import { PcSimulator } from "./PcSimulator";
import type { SimulatorCommand } from "./types";

interface DeviceSimulatorProps {
  device: "pc" | "mobile";
  onAction: (actionId: string) => void;
  command?: SimulatorCommand;
  highlightAction?: string;
  stageId?: string;
}

export function DeviceSimulator({ device, onAction, command, highlightAction, stageId }: DeviceSimulatorProps) {
  const pathname = usePathname();
  const routeStageId = pathname.match(/^\/play\/([^/]+)/)?.[1];
  const resolvedStageId = stageId ?? routeStageId;

  if (device === "mobile") {
    return <MobileSimulator stageId={resolvedStageId} onAction={onAction} command={command} highlightAction={highlightAction} />;
  }
  return <PcSimulator stageId={resolvedStageId} onAction={onAction} command={command} highlightAction={highlightAction} />;
}
