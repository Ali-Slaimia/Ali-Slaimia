import { ACHIEVEMENTS } from "./achievements";
import { defaultState, HEARTS_MAX, SHOP } from "./constants";
import type { Action, ExerciseType, GameState, ShopItemId } from "./types";

export function localDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return localDate(date);
}

export function isoWeekId(date: Date): string {
  const tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  const week1 = new Date(tmp.getFullYear(), 0, 4);
  const week = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${tmp.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function normalizeAnswer(value: string, type: ExerciseType): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return type === "type" ? trimmed.toLowerCase() : trimmed;
}

export function answersMatch(
  expected: string | string[],
  given: string | string[],
  type: ExerciseType,
): boolean {
  if (Array.isArray(expected)) {
    const actual = Array.isArray(given) ? given : [given];
    return (
      expected.length === actual.length &&
      expected.every((item, i) => normalizeAnswer(item, type) === normalizeAnswer(actual[i] ?? "", type))
    );
  }
  const actual = Array.isArray(given) ? given.join(" ") : given;
  return normalizeAnswer(expected, type) === normalizeAnswer(actual, type);
}

export function lessonXp(base: number, comboMax: number, perfect: boolean, doubleXp: boolean): number {
  const comboBonus = Math.min(comboMax, 8) * 2;
  const perfectBonus = perfect ? 15 : 0;
  const total = base + comboBonus + perfectBonus;
  return doubleXp ? total * 2 : total;
}

export function gemsForLesson(perfect: boolean): number {
  return perfect ? 12 : 6;
}

export function leagueForXp(weeklyXp: number): { id: string; title: string; min: number } {
  const leagues = [
    { id: "ruby", title: "Ruby", min: 320 },
    { id: "sapphire", title: "Sapphire", min: 200 },
    { id: "gold", title: "Gold", min: 120 },
    { id: "silver", title: "Silver", min: 50 },
    { id: "bronze", title: "Bronze", min: 0 },
  ];
  return leagues.find((league) => weeklyXp >= league.min) ?? leagues[leagues.length - 1];
}

function tick(state: GameState, now: number): GameState {
  const date = new Date(now);
  const today = localDate(date);
  const weekId = isoWeekId(date);
  let next = { ...state };

  if (next.lastHeartRefillDate !== today) {
    next = { ...next, hearts: HEARTS_MAX, lastHeartRefillDate: today };
  }
  if (next.weekId !== weekId) {
    next = { ...next, weeklyXp: 0, weekId };
  }
  if (next.todayDate !== today) {
    next = { ...next, todayXp: 0, todayDate: today };
  }
  return next;
}

function unlockAchievements(state: GameState): GameState {
  const earned = new Set(state.achievements);
  for (const achievement of ACHIEVEMENTS) {
    if (!earned.has(achievement.id) && achievement.unlocked(state)) {
      earned.add(achievement.id);
    }
  }
  if (earned.size === state.achievements.length) return state;
  return { ...state, achievements: [...earned] };
}

function applyStreak(state: GameState, today: string): GameState {
  if (state.lastActiveDate === today) return state;
  if (!state.lastActiveDate) {
    return { ...state, streak: 1, lastActiveDate: today };
  }
  if (state.lastActiveDate === addDays(today, -1)) {
    return { ...state, streak: state.streak + 1, lastActiveDate: today };
  }
  if (state.streakFreezes > 0) {
    return {
      ...state,
      streakFreezes: state.streakFreezes - 1,
      lastActiveDate: today,
    };
  }
  return { ...state, streak: 1, lastActiveDate: today };
}

export function canAfford(state: GameState, item: ShopItemId): boolean {
  const catalog = SHOP[item];
  if (state.gems < catalog.cost) return false;
  if (item === "hearts" && state.hearts >= HEARTS_MAX) return false;
  if (item === "shades" && state.mascot === "shades") return false;
  if (item === "crown" && state.mascot === "crown") return false;
  return true;
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK":
      return tick(state, action.now);
    case "ONBOARD": {
      const ticked = tick(defaultState, action.now);
      return {
        ...ticked,
        onboardingComplete: true,
        displayName: action.name.trim() || "Loopster",
        activeTrackId: action.trackId,
        dailyGoal: action.dailyGoal,
        createdAt: localDate(new Date(action.now)),
      };
    }
    case "COMPLETE_LESSON": {
      const ticked = tick(state, action.now);
      const today = localDate(new Date(action.now));
      const already = ticked.completedLessons[action.lessonId];
      const xpGain = already ? Math.round(action.earnedXp * 0.25) : action.earnedXp;
      const gemGain = already ? 2 : gemsForLesson(action.perfect);
      const doubleXpLessons = Math.max(0, ticked.doubleXpLessons - (already ? 0 : 1));
      const mistakes = [...ticked.mistakeBank];
      for (const mistake of action.mistakes) {
        if (!mistakes.some((item) => item.exerciseId === mistake.exerciseId)) {
          mistakes.push(mistake);
        }
      }
      const next = applyStreak(
        {
          ...ticked,
          xp: ticked.xp + xpGain,
          weeklyXp: ticked.weeklyXp + xpGain,
          todayXp: ticked.todayXp + xpGain,
          gems: ticked.gems + gemGain,
          doubleXpLessons,
          mistakeBank: mistakes.slice(-40),
          completedLessons: {
            ...ticked.completedLessons,
            [action.lessonId]: {
              perfect: Boolean(already?.perfect || action.perfect),
              xp: (already?.xp ?? 0) + xpGain,
              completedAt: today,
            },
          },
        },
        today,
      );
      return unlockAchievements(next);
    }
    case "OPEN_CHEST": {
      if (state.openedChests.includes(action.unitId)) return state;
      return {
        ...state,
        gems: state.gems + (20),
        openedChests: [...state.openedChests, action.unitId],
      };
    }
    case "LOSE_HEART": {
      const mistakes = action.mistake
        ? state.mistakeBank.some((item) => item.exerciseId === action.mistake?.exerciseId)
          ? state.mistakeBank
          : [...state.mistakeBank, action.mistake]
        : state.mistakeBank;
      return { ...state, hearts: Math.max(0, state.hearts - 1), mistakeBank: mistakes.slice(-40) };
    }
    case "BUY": {
      if (!canAfford(state, action.item)) return state;
      const cost = SHOP[action.item].cost;
      const spent = { ...state, gems: state.gems - cost };
      if (action.item === "hearts") return { ...spent, hearts: HEARTS_MAX };
      if (action.item === "freeze") return { ...spent, streakFreezes: spent.streakFreezes + 1 };
      if (action.item === "double") return { ...spent, doubleXpLessons: spent.doubleXpLessons + 1 };
      if (action.item === "shades") return { ...spent, mascot: "shades" };
      return { ...spent, mascot: "crown" };
    }
    case "SET_TRACK":
      return { ...state, activeTrackId: action.trackId };
    case "CLEAR_MISTAKE":
      return {
        ...state,
        mistakeBank: state.mistakeBank.filter((item) => item.exerciseId !== action.exerciseId),
      };
    case "RESET":
      return { ...defaultState };
    default:
      return state;
  }
}
