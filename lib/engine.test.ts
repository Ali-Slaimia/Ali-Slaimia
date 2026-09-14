import { describe, expect, it } from "vitest";
import { checkAnswer, HEARTS_PER_LESSON, lessonXp } from "./scoring";
import { isoDate, isoWeekId, nextStreak, shiftIsoDate, streakOnLoad } from "./streak";
import { clock, defaultState, progressReducer } from "./progress";
import { weeklyBoard, leagueName } from "./leagues";
import type { Exercise } from "./types";

const mcq: Exercise = {
  id: "t1",
  type: "mcq",
  prompt: "Pick B",
  choices: ["A", "B", "C"],
  answer: 1,
  explanation: "B",
};

const order: Exercise = {
  id: "t2",
  type: "order",
  prompt: "Order",
  tokens: ["const", "x", "=", "1"],
  explanation: "const x = 1",
};

describe("checkAnswer", () => {
  it("accepts the right multiple-choice index", () => {
    expect(checkAnswer(mcq, { kind: "index", index: 1 })).toBe(true);
    expect(checkAnswer(mcq, { kind: "index", index: 0 })).toBe(false);
  });

  it("requires exact token order", () => {
    expect(checkAnswer(order, { kind: "tokens", tokens: ["const", "x", "=", "1"] })).toBe(true);
    expect(checkAnswer(order, { kind: "tokens", tokens: ["x", "const", "=", "1"] })).toBe(false);
  });

  it("normalizes blank answers", () => {
    const blank: Exercise = {
      id: "t3",
      type: "blank",
      prompt: "blank",
      choices: ["map", "filter"],
      answer: "map",
      explanation: "map",
    };
    expect(checkAnswer(blank, { kind: "text", value: "  map  " })).toBe(true);
  });
});

describe("lessonXp", () => {
  it("adds a perfect-lesson bonus", () => {
    expect(lessonXp(20, 6, 6, 0)).toBe(20 + 15 + 12);
    expect(lessonXp(20, 5, 6, 1)).toBe(Math.round(20 * (5 / 6)) + 10);
  });
});

describe("hearts", () => {
  it("starts each lesson with five hearts", () => {
    expect(HEARTS_PER_LESSON).toBe(5);
  });
});

describe("streaks", () => {
  it("continues after yesterday", () => {
    expect(nextStreak(4, "2026-09-13", "2026-09-14", "2026-09-13")).toEqual({
      streak: 5,
      event: "continue",
    });
  });

  it("restarts after a gap", () => {
    expect(nextStreak(9, "2026-09-10", "2026-09-14", "2026-09-13")).toEqual({
      streak: 1,
      event: "restart",
    });
  });

  it("does not increment twice the same day", () => {
    expect(nextStreak(3, "2026-09-14", "2026-09-14", "2026-09-13").event).toBe("same-day");
  });

  it("breaks on load after a missed day", () => {
    expect(streakOnLoad(7, "2026-09-10", "2026-09-14", "2026-09-13")).toBe(0);
  });

  it("uses local calendar dates, not UTC ISO", () => {
    expect(isoDate(new Date(2026, 8, 14))).toBe("2026-09-14");
    expect(shiftIsoDate("2026-09-14", -1)).toBe("2026-09-13");
    expect(isoWeekId("2026-09-14")).toMatch(/^2026-W\d{2}$/);
  });
});

describe("progressReducer", () => {
  it("awards XP, bits, and streak on a perfect first clear", () => {
    const today = "2026-09-14";
    const weekId = isoWeekId(today);
    const started = progressReducer(defaultState(new Date(2026, 8, 14)), {
      type: "ONBOARD",
      displayName: "Ali",
      dailyGoal: 20,
    });
    const next = progressReducer(started, {
      type: "COMPLETE_LESSON",
      key: "javascript:values",
      missed: 0,
      xp: 47,
      today,
      weekId,
      yesterday: "2026-09-13",
    });
    expect(next.xp).toBe(47);
    expect(next.bits).toBe(1);
    expect(next.streak).toBe(1);
    expect(next.completed["javascript:values"].perfect).toBe(true);
    expect(next.badges).toContain("first-bite");
    expect(next.badges).toContain("flawless");
  });

  it("grants reduced XP on a repeat lesson", () => {
    const today = "2026-09-14";
    const weekId = isoWeekId(today);
    const payload = {
      type: "COMPLETE_LESSON" as const,
      key: "javascript:values",
      missed: 1,
      xp: 30,
      today,
      weekId,
      yesterday: "2026-09-13",
    };
    const once = progressReducer(defaultState(new Date(2026, 8, 14)), payload);
    const twice = progressReducer(once, payload);
    expect(twice.xp).toBe(once.xp + Math.round(30 * 0.35));
  });

  it("ticks daily and weekly XP on date change", () => {
    const state = progressReducer(defaultState(new Date(2026, 8, 14)), {
      type: "COMPLETE_LESSON",
      key: "javascript:values",
      missed: 0,
      xp: 20,
      today: "2026-09-14",
      weekId: "2026-W38",
      yesterday: "2026-09-13",
    });
    const ticked = progressReducer(state, {
      type: "TICK",
      today: "2026-09-21",
      weekId: "2026-W39",
      yesterday: "2026-09-20",
    });
    expect(ticked.dailyXp).toBe(0);
    expect(ticked.weeklyXp).toBe(0);
    expect(ticked.streak).toBe(0);
  });
});

describe("clock", () => {
  it("returns today, yesterday, and an ISO week", () => {
    const { today, yesterday, weekId } = clock(new Date(2026, 8, 14));
    expect(today).toBe("2026-09-14");
    expect(yesterday).toBe("2026-09-13");
    expect(weekId).toBe(isoWeekId("2026-09-14"));
  });
});

describe("leagues", () => {
  it("is deterministic for a week and ranks you", () => {
    const a = weeklyBoard("2026-W38", "Ali", 120);
    const b = weeklyBoard("2026-W38", "Ali", 120);
    expect(a).toEqual(b);
    expect(a.some((row) => row.you && row.weeklyXp === 120)).toBe(true);
    expect(leagueName(120).id).toBe("bronze");
    expect(leagueName(400).id).toBe("gold");
  });
});
