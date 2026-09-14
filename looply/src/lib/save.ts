import { defaultState } from "./constants";
import type { GameState } from "./types";

export const SAVE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export interface SaveEnvelope {
  v: 1;
  updatedAt: number;
  code: string;
  state: GameState;
}

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.onboardingComplete === "boolean" && typeof record.completedLessons === "object";
}

export function isSaveEnvelope(value: unknown): value is SaveEnvelope {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return record.v === 1 && typeof record.updatedAt === "number" && typeof record.code === "string" && isGameState(record.state);
}

export function generateSaveCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => SAVE_CODE_ALPHABET[byte % SAVE_CODE_ALPHABET.length]).join("");
}

export function normalizeSaveCode(input: string): string {
  const chars = input
    .toUpperCase()
    .replace(/LOOP-/g, "")
    .split("")
    .filter((char) => SAVE_CODE_ALPHABET.includes(char));
  return chars.length === 6 ? chars.join("") : "";
}

export function formatSaveCode(code: string): string {
  const normalized = normalizeSaveCode(code) || code.toUpperCase();
  return `LOOP-${normalized}`;
}

export function progressScore(state: GameState): number {
  return Object.keys(state.completedLessons).length * 1_000_000 + state.xp + state.gems;
}

export function hydrateState(partial: GameState): GameState {
  return { ...defaultState, ...partial, completedLessons: partial.completedLessons ?? {} };
}

export function parseStoredSave(raw: string | null, now: number): SaveEnvelope {
  if (!raw) {
    return { v: 1, updatedAt: now, code: generateSaveCode(), state: defaultState };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isSaveEnvelope(parsed)) {
      const code = normalizeSaveCode(parsed.code) || parsed.code;
      return {
        v: 1,
        updatedAt: parsed.updatedAt,
        code,
        state: hydrateState(parsed.state),
      };
    }
    if (isGameState(parsed)) {
      return {
        v: 1,
        updatedAt: now,
        code: generateSaveCode(),
        state: hydrateState(parsed),
      };
    }
  } catch {
    // fall through to a fresh envelope
  }
  return { v: 1, updatedAt: now, code: generateSaveCode(), state: defaultState };
}

export function mergeSaves(local: SaveEnvelope, remote: SaveEnvelope | null): SaveEnvelope {
  if (!remote) return local;
  if (!local.state.onboardingComplete && remote.state.onboardingComplete) return remote;
  if (progressScore(remote.state) > progressScore(local.state)) return remote;
  return local;
}
