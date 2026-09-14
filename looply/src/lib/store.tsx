"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchPublicIp, hashIp, pullCloudSave, pushCloudSave, unlinkIpSave } from "./cloud";
import { defaultState, SAVE_KEY } from "./constants";
import { reduce } from "./game";
import { generateSaveCode, mergeSaves, parseStoredSave, type SaveEnvelope } from "./save";
import type { Action, GameState } from "./types";

export type CloudStatus = "checking" | "synced" | "local" | "error";

interface GameContextValue {
  state: GameState;
  hydrated: boolean;
  dispatch: (action: Action) => void;
  cloudStatus: CloudStatus;
  saveCode: string;
  restoreWithCode: (code: string) => Promise<boolean>;
}

const GameContext = createContext<GameContextValue | null>(null);

function readLocalEnvelope(now: number): SaveEnvelope {
  const loaded = parseStoredSave(window.localStorage.getItem(SAVE_KEY), now);
  return {
    ...loaded,
    state: reduce(loaded.state, { type: "TICK", now }),
  };
}

function writeLocalEnvelope(envelope: SaveEnvelope) {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(envelope));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [saveCode, setSaveCode] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>("checking");
  const ipHashRef = useRef<string | null>(null);
  const allowPushRef = useRef(false);
  const envelopeMetaRef = useRef({ updatedAt: 0, code: "" });
  const lastPushRef = useRef("");
  const stateRef = useRef(state);

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    const local = readLocalEnvelope(now);
    envelopeMetaRef.current = { updatedAt: local.updatedAt, code: local.code };
    stateRef.current = local.state;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client save hydration
    setSaveCode(local.code);
    setState(local.state);
    if (local.state.onboardingComplete) setHydrated(true);

    (async () => {
      try {
        const ip = await fetchPublicIp();
        const ipHash = ip ? await hashIp(ip) : null;
        if (cancelled) return;
        ipHashRef.current = ipHash;
        const remote = await pullCloudSave({ code: local.code, ipHash });
        if (cancelled) return;
        const current: SaveEnvelope = {
          v: 1,
          updatedAt: envelopeMetaRef.current.updatedAt,
          code: envelopeMetaRef.current.code || local.code,
          state: stateRef.current,
        };
        const merged = mergeSaves(current, remote);
        const ticked = reduce(merged.state, { type: "TICK", now: Date.now() });
        envelopeMetaRef.current = { updatedAt: Date.now(), code: merged.code };
        setSaveCode(merged.code);
        stateRef.current = ticked;
        setState(ticked);
        setCloudStatus(ipHash || remote ? "synced" : "local");
        allowPushRef.current = true;
        if (ticked.onboardingComplete) {
          const nextEnvelope: SaveEnvelope = {
            v: 1,
            updatedAt: envelopeMetaRef.current.updatedAt,
            code: merged.code,
            state: ticked,
          };
          writeLocalEnvelope(nextEnvelope);
          await pushCloudSave(ipHash, nextEnvelope);
        }
      } catch {
        if (!cancelled) {
          setCloudStatus("local");
          allowPushRef.current = true;
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    stateRef.current = state;
    const envelope: SaveEnvelope = {
      v: 1,
      updatedAt: Date.now(),
      code: saveCode || envelopeMetaRef.current.code,
      state,
    };
    envelopeMetaRef.current = { updatedAt: envelope.updatedAt, code: envelope.code };
    writeLocalEnvelope(envelope);
    if (!allowPushRef.current || !state.onboardingComplete) return;
    const fingerprint = JSON.stringify({ code: envelope.code, xp: state.xp, lessons: state.completedLessons, gems: state.gems });
    if (fingerprint === lastPushRef.current) return;
    const timer = window.setTimeout(() => {
      lastPushRef.current = fingerprint;
      void pushCloudSave(ipHashRef.current, envelope).then(
        () => setCloudStatus(ipHashRef.current ? "synced" : "local"),
        () => setCloudStatus("error"),
      );
    }, 700);
    return () => window.clearTimeout(timer);
  }, [hydrated, saveCode, state]);

  const dispatch = useCallback((action: Action) => {
    if (action.type === "RESET") {
      const code = generateSaveCode();
      const ipHash = ipHashRef.current;
      setSaveCode(code);
      envelopeMetaRef.current = { updatedAt: Date.now(), code };
      lastPushRef.current = "";
      if (ipHash) void unlinkIpSave(ipHash, code);
    }
    setState((current) => {
      const next = reduce(current, action);
      stateRef.current = next;
      return next;
    });
  }, []);

  const restoreWithCode = useCallback(async (rawCode: string) => {
    setCloudStatus("checking");
    try {
      const remote = await pullCloudSave({ code: rawCode, ipHash: null });
      if (!remote?.state.onboardingComplete) {
        setCloudStatus("error");
        return false;
      }
      const now = Date.now();
      const ticked = reduce(remote.state, { type: "TICK", now });
      envelopeMetaRef.current = { updatedAt: now, code: remote.code };
      setSaveCode(remote.code);
      stateRef.current = ticked;
      setState(ticked);
      allowPushRef.current = true;
      const envelope: SaveEnvelope = { ...remote, updatedAt: now };
      writeLocalEnvelope(envelope);
      await pushCloudSave(ipHashRef.current, envelope);
      setCloudStatus(ipHashRef.current ? "synced" : "local");
      return true;
    } catch {
      setCloudStatus("error");
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, dispatch, cloudStatus, saveCode, restoreWithCode }),
    [state, hydrated, dispatch, cloudStatus, saveCode, restoreWithCode],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside GameProvider");
  return value;
}
