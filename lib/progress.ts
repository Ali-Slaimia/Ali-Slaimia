import { lessonKey } from "@/content/catalog";
import type { MistakeRef, ProgressAction, ProgressState } from "./types";
import { earnedBadges } from "./badges";
import { isoDate, isoWeekId, nextStreak, shiftIsoDate, streakOnLoad } from "./streak";

export const STORAGE_KEY = "bytetrail.progress.v1";

export function clock(now = new Date()) {
  const today = isoDate(now);
  return {
    today,
    yesterday: shiftIsoDate(today, -1),
    weekId: isoWeekId(today),
  };
}

export function defaultState(now = new Date()): ProgressState {
  const { today, weekId } = clock(now);
  return {
    onboarded: false,
    displayName: "You",
    dailyGoal: 20,
    sound: true,
    xp: 0,
    bits: 0,
    streak: 0,
    lastActiveDate: null,
    dailyXp: 0,
    dailyXpDate: today,
    weeklyXp: 0,
    weekId,
    completed: {},
    mistakes: [],
    badges: [],
  };
}

function uniqueMistakes(refs: MistakeRef[]): MistakeRef[] {
  const seen = new Set<string>();
  const next: MistakeRef[] = [];
  for (const ref of refs) {
    const key = `${ref.unitId}:${ref.lessonId}:${ref.exerciseId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(ref);
  }
  return next;
}

function withBadges(state: ProgressState): ProgressState {
  const badges = earnedBadges(state);
  return { ...state, badges };
}

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "TICK": {
      const streak = streakOnLoad(state.streak, state.lastActiveDate, action.today, action.yesterday);
      return {
        ...state,
        streak,
        dailyXp: state.dailyXpDate === action.today ? state.dailyXp : 0,
        dailyXpDate: action.today,
        weeklyXp: state.weekId === action.weekId ? state.weeklyXp : 0,
        weekId: action.weekId,
      };
    }
    case "ONBOARD":
      return {
        ...state,
        onboarded: true,
        displayName: action.displayName.trim() || "You",
        dailyGoal: action.dailyGoal,
      };
    case "COMPLETE_LESSON": {
      const { streak } = nextStreak(state.streak, state.lastActiveDate, action.today, action.yesterday);
      const already = state.completed[action.key];
      const xpGain = already ? Math.round(action.xp * 0.35) : action.xp;
      const bitsGain = action.missed === 0 && !already?.perfect ? 1 : 0;
      const dailyXp = state.dailyXpDate === action.today ? state.dailyXp : 0;
      const weeklyXp = state.weekId === action.weekId ? state.weeklyXp : 0;
      return withBadges({
        ...state,
        xp: state.xp + xpGain,
        bits: state.bits + bitsGain,
        streak,
        lastActiveDate: action.today,
        dailyXp: dailyXp + xpGain,
        dailyXpDate: action.today,
        weeklyXp: weeklyXp + xpGain,
        weekId: action.weekId,
        completed: {
          ...state.completed,
          [action.key]: {
            perfect: action.missed === 0 || Boolean(already?.perfect),
            missed: Math.min(action.missed, already?.missed ?? action.missed),
            xp: (already?.xp ?? 0) + xpGain,
            at: action.today,
          },
        },
      });
    }
    case "ADD_MISTAKES":
      return { ...state, mistakes: uniqueMistakes([...state.mistakes, ...action.refs]) };
    case "CLEAR_MISTAKE":
      return {
        ...state,
        mistakes: state.mistakes.filter(
          (item) =>
            !(
              item.unitId === action.ref.unitId &&
              item.lessonId === action.ref.lessonId &&
              item.exerciseId === action.ref.exerciseId
            ),
        ),
      };
    case "TOGGLE_SOUND":
      return { ...state, sound: !state.sound };
    case "RESET":
      return { ...defaultState(), dailyXpDate: action.today, weekId: action.weekId, onboarded: true };
    default:
      return state;
  }
}

export function isLessonUnlocked(
  unitLessons: { id: string }[],
  lessonIndex: number,
  completed: Record<string, LessonLike>,
  unitId: string,
): boolean {
  if (lessonIndex <= 0) return true;
  const prev = unitLessons[lessonIndex - 1];
  return Boolean(completed[lessonKey(unitId, prev.id)]);
}

type LessonLike = { perfect?: boolean };
