import type { GameState, ShopItemId } from "./types";

export const HEARTS_MAX = 5;
export const SAVE_KEY = "looply-save-v1";

export const defaultState: GameState = {
  onboardingComplete: false,
  displayName: "",
  dailyGoal: 20,
  activeTrackId: "javascript",
  hearts: HEARTS_MAX,
  lastHeartRefillDate: null,
  gems: 0,
  xp: 0,
  weeklyXp: 0,
  weekId: "",
  todayXp: 0,
  todayDate: null,
  streak: 0,
  lastActiveDate: null,
  streakFreezes: 0,
  completedLessons: {},
  openedChests: [],
  mistakeBank: [],
  achievements: [],
  mascot: "classic",
  doubleXpLessons: 0,
  createdAt: null,
};

export const SHOP: Record<
  ShopItemId,
  { title: string; blurb: string; cost: number; emoji: string }
> = {
  hearts: {
    title: "Full hearts",
    blurb: "Refill to 5 and jump back into a lesson.",
    cost: 100,
    emoji: "❤️",
  },
  freeze: {
    title: "Streak freeze",
    blurb: "Miss a day, keep the fire. Auto-used when needed.",
    cost: 200,
    emoji: "🧊",
  },
  double: {
    title: "Double XP",
    blurb: "Next new lesson pays out twice the XP.",
    cost: 150,
    emoji: "⚡",
  },
  shades: {
    title: "Loopy shades",
    blurb: "A cosmetic for the chameleon who debugs at night.",
    cost: 80,
    emoji: "🕶️",
  },
  crown: {
    title: "Ship crown",
    blurb: "Wear the deploy energy. Pure flex, zero runtime cost.",
    cost: 260,
    emoji: "👑",
  },
};
