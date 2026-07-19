"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createInitialSimulatorState } from "./scenarios";
import type { SimulatorCommand, SimulatorScenario, SimulatorState } from "./types";

interface HistoryState {
  past: SimulatorState[];
  present: SimulatorState;
  future: SimulatorState[];
}

function createHistory(scenario: SimulatorScenario): HistoryState {
  return { past: [], present: createInitialSimulatorState(scenario), future: [] };
}

export function useSimulator(
  onAction: (actionId: string) => void,
  command: SimulatorCommand | undefined,
  scenario: SimulatorScenario,
) {
  const [history, setHistory] = useState<HistoryState>(() => createHistory(scenario));
  const historyRef = useRef(history);
  const onActionRef = useRef(onAction);
  const processedCommandId = useRef<number | null>(null);

  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  const replaceHistory = useCallback((next: HistoryState) => {
    historyRef.current = next;
    setHistory(next);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = createHistory(scenario);
      processedCommandId.current = null;
      replaceHistory(next);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [replaceHistory, scenario]);

  const commit = useCallback((
    actionId: string,
    updater: (current: SimulatorState) => SimulatorState,
  ) => {
    const current = historyRef.current;
    const nextState = updater(current.present);
    if (nextState !== current.present) {
      replaceHistory({
        past: [...current.past, current.present].slice(-50),
        present: nextState,
        future: [],
      });
    }
    onActionRef.current(actionId);
  }, [replaceHistory]);

  const updateDraft = useCallback((patch: Partial<SimulatorState>) => {
    const current = historyRef.current;
    replaceHistory({
      ...current,
      present: { ...current.present, ...patch },
    });
  }, [replaceHistory]);

  const undo = useCallback(() => {
    const current = historyRef.current;
    const previous = current.past.at(-1);
    if (!previous) return;
    replaceHistory({
      past: current.past.slice(0, -1),
      present: previous,
      future: [current.present, ...current.future].slice(0, 50),
    });
    onActionRef.current("undo");
  }, [replaceHistory]);

  const redo = useCallback(() => {
    const current = historyRef.current;
    const next = current.future[0];
    if (!next) return;
    replaceHistory({
      past: [...current.past, current.present].slice(-50),
      present: next,
      future: current.future.slice(1),
    });
    onActionRef.current("redo");
  }, [replaceHistory]);

  const reset = useCallback(() => {
    replaceHistory(createHistory(scenario));
    onActionRef.current("reset");
  }, [replaceHistory, scenario]);

  useEffect(() => {
    if (!command || processedCommandId.current === command.id) return;
    processedCommandId.current = command.id;
    const timer = window.setTimeout(() => {
      if (command.type === "undo") undo();
      if (command.type === "redo") redo();
      if (command.type === "reset") reset();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [command, redo, reset, undo]);

  return {
    state: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    commit,
    updateDraft,
  };
}
