"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultState, SAVE_KEY } from "./constants";
import { reduce } from "./game";
import type { Action, GameState } from "./types";

interface GameContextValue {
  state: GameState;
  hydrated: boolean;
  dispatch: (action: Action) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadState(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...(JSON.parse(raw) as GameState) };
  } catch {
    return defaultState;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // First paint matches SSR; then restore the local save.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client save hydration
    setState(reduce(loadState(), { type: "TICK", now: Date.now() }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const dispatch = useCallback((action: Action) => {
    setState((current) => reduce(current, action));
  }, []);

  const value = useMemo(() => ({ state, hydrated, dispatch }), [state, hydrated, dispatch]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside GameProvider");
  return value;
}
