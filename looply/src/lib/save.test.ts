import { describe, expect, it } from "vitest";
import { defaultState } from "./constants";
import { hashIp } from "./cloud";
import {
  formatSaveCode,
  generateSaveCode,
  mergeSaves,
  normalizeSaveCode,
  parseStoredSave,
  progressScore,
  type SaveEnvelope,
} from "./save";
import type { GameState } from "./types";

function envelope(partial: Partial<GameState>, code = "ABCDEF"): SaveEnvelope {
  return {
    v: 1,
    updatedAt: 1,
    code,
    state: { ...defaultState, ...partial },
  };
}

describe("save codes", () => {
  it("normalizes LOOP- prefixes and junk characters", () => {
    expect(normalizeSaveCode("loop-ab2def")).toBe("AB2DEF");
    expect(normalizeSaveCode("AB2-DEF")).toBe("AB2DEF");
    expect(normalizeSaveCode("nope")).toBe("");
    expect(formatSaveCode("ab2def")).toBe("LOOP-AB2DEF");
  });

  it("generates 6-character alphabet codes", () => {
    const code = generateSaveCode();
    expect(code).toHaveLength(6);
    expect(normalizeSaveCode(code)).toBe(code);
  });
});

describe("parseStoredSave", () => {
  it("migrates a raw GameState from the first Looply save format", () => {
    const raw = JSON.stringify({ ...defaultState, displayName: "Ali", xp: 40, onboardingComplete: true });
    const parsed = parseStoredSave(raw, 99);
    expect(parsed.state.displayName).toBe("Ali");
    expect(parsed.state.xp).toBe(40);
    expect(parsed.code).toHaveLength(6);
    expect(parsed.v).toBe(1);
  });

  it("reads a versioned envelope", () => {
    const parsed = parseStoredSave(JSON.stringify(envelope({ displayName: "Loopy" }, "XYZ234")), 1);
    expect(parsed.code).toBe("XYZ234");
    expect(parsed.state.displayName).toBe("Loopy");
  });
});

describe("mergeSaves", () => {
  it("prefers a completed cloud save over an empty local device", () => {
    const local = envelope({ onboardingComplete: false });
    const remote = envelope({ onboardingComplete: true, displayName: "Ali", xp: 80 }, "REMOTE");
    expect(mergeSaves(local, remote).code).toBe("REMOTE");
    expect(mergeSaves(local, remote).state.displayName).toBe("Ali");
  });

  it("keeps the local save when it has more progress", () => {
    const local = envelope({ onboardingComplete: true, xp: 200, completedLessons: { "js-1": { perfect: true, xp: 40, completedAt: "2026-09-14" } } }, "LOCAL1");
    const remote = envelope({ onboardingComplete: true, xp: 10 }, "CLOUD1");
    expect(mergeSaves(local, remote).code).toBe("LOCAL1");
    expect(progressScore(local.state)).toBeGreaterThan(progressScore(remote.state));
  });
});

describe("hashIp", () => {
  it("hashes IPs with a pepper so the raw address is never the storage key", async () => {
    const first = await hashIp("203.0.113.10");
    const second = await hashIp("203.0.113.10");
    const other = await hashIp("203.0.113.11");
    expect(first).toBe(second);
    expect(first).toHaveLength(20);
    expect(first).not.toBe(other);
    expect(first.includes("203")).toBe(false);
  });
});
