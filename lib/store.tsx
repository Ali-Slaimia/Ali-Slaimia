"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { clock, defaultState, progressReducer, STORAGE_KEY } from "@/lib/progress";
import type { DailyGoal, ProgressAction, ProgressState } from "@/lib/types";

type Store = {
  state: ProgressState;
  ready: boolean;
  dispatch: (action: ProgressAction) => void;
  onboard: (displayName: string, dailyGoal: DailyGoal) => void;
  reset: () => void;
};

const ProgressContext = createContext<Store | null>(null);
const emptySubscribe = () => () => undefined;
const listeners = new Set<() => void>();
const serverState = defaultState(new Date(2026, 0, 1));
let memory = serverState;
let hydratedFromDisk = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function readDisk(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return progressReducer(JSON.parse(raw) as ProgressState, { type: "TICK", ...clock() });
  } catch {
    return defaultState();
  }
}

function persist(next: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function subscribeProgress(listener: () => void) {
  if (!hydratedFromDisk) {
    hydratedFromDisk = true;
    memory = readDisk();
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressSnapshot() {
  return memory;
}

export function getProgressServerSnapshot() {
  return serverState;
}

export function dispatchProgress(action: ProgressAction) {
  memory = progressReducer(memory, action);
  persist(memory);
  emit();
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const state = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressServerSnapshot);

  const store = useMemo<Store>(
    () => ({
      state,
      ready,
      dispatch: dispatchProgress,
      onboard: (displayName, dailyGoal) => dispatchProgress({ type: "ONBOARD", displayName, dailyGoal }),
      reset: () => dispatchProgress({ type: "RESET", ...clock() }),
    }),
    [ready, state],
  );

  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
