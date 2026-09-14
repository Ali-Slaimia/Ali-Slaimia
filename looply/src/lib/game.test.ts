import { describe, expect, it } from "vitest";
import { defaultState, HEARTS_MAX } from "./constants";
import { flattenExercises } from "./curriculum";
import {
  addDays,
  answersMatch,
  canAfford,
  isoWeekId,
  lessonXp,
  localDate,
  reduce,
} from "./game";
import type { GameState } from "./types";

function at(iso: string, hour = 12): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, hour).getTime();
}

function withState(partial: Partial<GameState>): GameState {
  return { ...defaultState, ...partial };
}

describe("answersMatch", () => {
  it("ignores case and extra spaces for typed answers", () => {
    expect(answersMatch("undefined", "  Undefined ", "type")).toBe(true);
  });

  it("requires exact order for code blocks", () => {
    expect(answersMatch(["a", "b"], ["b", "a"], "order")).toBe(false);
    expect(answersMatch(["a", "b"], ["a", "b"], "order")).toBe(true);
  });
});

describe("lessonXp", () => {
  it("adds combo, perfect bonus, and optional double", () => {
    expect(lessonXp(20, 3, true, false)).toBe(20 + 6 + 15);
    expect(lessonXp(20, 3, true, true)).toBe((20 + 6 + 15) * 2);
  });
});

describe("reduce", () => {
  it("onboards and unlocks the first lesson path state", () => {
    const next = reduce(defaultState, {
      type: "ONBOARD",
      name: "Ali",
      trackId: "javascript",
      dailyGoal: 20,
      now: at("2026-09-14"),
    });
    expect(next.onboardingComplete).toBe(true);
    expect(next.displayName).toBe("Ali");
    expect(next.hearts).toBe(HEARTS_MAX);
  });

  it("increments streak on consecutive days and resets after a gap", () => {
    const day1 = reduce(withState({ onboardingComplete: true }), {
      type: "COMPLETE_LESSON",
      lessonId: "js-1",
      perfect: true,
      earnedXp: 40,
      mistakes: [],
      now: at("2026-09-14"),
    });
    expect(day1.streak).toBe(1);
    const day2 = reduce(day1, {
      type: "COMPLETE_LESSON",
      lessonId: "js-2",
      perfect: false,
      earnedXp: 30,
      mistakes: [],
      now: at("2026-09-15"),
    });
    expect(day2.streak).toBe(2);
    const gap = reduce(day2, {
      type: "COMPLETE_LESSON",
      lessonId: "js-3",
      perfect: false,
      earnedXp: 20,
      mistakes: [],
      now: at("2026-09-18"),
    });
    expect(gap.streak).toBe(1);
  });

  it("consumes a streak freeze instead of resetting", () => {
    const frozen = withState({
      onboardingComplete: true,
      streak: 6,
      lastActiveDate: "2026-09-14",
      streakFreezes: 1,
    });
    const next = reduce(frozen, {
      type: "COMPLETE_LESSON",
      lessonId: "js-1",
      perfect: true,
      earnedXp: 20,
      mistakes: [],
      now: at("2026-09-16"),
    });
    expect(next.streak).toBe(6);
    expect(next.streakFreezes).toBe(0);
  });

  it("refills hearts on a new local day", () => {
    const empty = withState({
      hearts: 1,
      lastHeartRefillDate: "2026-09-13",
    });
    const next = reduce(empty, { type: "TICK", now: at("2026-09-14") });
    expect(next.hearts).toBe(HEARTS_MAX);
  });

  it("resets weekly XP when the ISO week changes", () => {
    const dated = new Date(2026, 8, 14);
    const week = isoWeekId(dated);
    const nextWeekDate = new Date(2026, 8, 21);
    const state = withState({ weekId: week, weeklyXp: 90, todayDate: localDate(dated) });
    const next = reduce(state, { type: "TICK", now: nextWeekDate.getTime() });
    expect(next.weeklyXp).toBe(0);
    expect(next.weekId).toBe(isoWeekId(nextWeekDate));
  });

  it("does not sell hearts the learner already has", () => {
    const rich = withState({ gems: 500, hearts: HEARTS_MAX });
    expect(canAfford(rich, "hearts")).toBe(false);
    const spent = reduce(withState({ gems: 500, hearts: 1 }), { type: "BUY", item: "hearts" });
    expect(spent.hearts).toBe(HEARTS_MAX);
    expect(spent.gems).toBe(400);
  });

  it("banks mistakes when a heart is lost", () => {
    const next = reduce(defaultState, {
      type: "LOSE_HEART",
      mistake: { exerciseId: "js-1-a", lessonId: "js-1" },
    });
    expect(next.hearts).toBe(HEARTS_MAX - 1);
    expect(next.mistakeBank).toHaveLength(1);
  });

  it("replays award reduced XP", () => {
    const first = reduce(withState({ onboardingComplete: true }), {
      type: "COMPLETE_LESSON",
      lessonId: "js-1",
      perfect: true,
      earnedXp: 40,
      mistakes: [],
      now: at("2026-09-14"),
    });
    const replay = reduce(first, {
      type: "COMPLETE_LESSON",
      lessonId: "js-1",
      perfect: true,
      earnedXp: 40,
      mistakes: [],
      now: at("2026-09-14"),
    });
    expect(replay.xp).toBe(first.xp + 10);
  });
});

describe("curriculum", () => {
  it("keeps every multiple-choice answer inside its options", () => {
    for (const { exercise } of flattenExercises()) {
      if (exercise.options) {
        expect(exercise.options, exercise.id).toContain(exercise.answer as string);
      }
      if (exercise.pieces) {
        expect(exercise.answer).toEqual(exercise.pieces);
      }
    }
  });
});

describe("dates", () => {
  it("adds days across month boundaries", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
  });
});
