import type { Achievement, GameState } from "./types";
import { TRACKS } from "./curriculum";

export const ACHIEVEMENTS: Array<Achievement & { unlocked: (state: GameState) => boolean }> = [
  {
    id: "first-commit",
    title: "First commit",
    hint: "Finish any lesson",
    emoji: "🌱",
    unlocked: (state) => Object.keys(state.completedLessons).length >= 1,
  },
  {
    id: "clean-compile",
    title: "Clean compile",
    hint: "Perfect a lesson",
    emoji: "✨",
    unlocked: (state) => Object.values(state.completedLessons).some((lesson) => lesson.perfect),
  },
  {
    id: "warm-cache",
    title: "Warm cache",
    hint: "Reach a 3-day streak",
    emoji: "🔥",
    unlocked: (state) => state.streak >= 3,
  },
  {
    id: "weekly-deploy",
    title: "Weekly deploy",
    hint: "Reach a 7-day streak",
    emoji: "🚀",
    unlocked: (state) => state.streak >= 7,
  },
  {
    id: "ten-checks",
    title: "Ten green checks",
    hint: "Complete 10 lessons",
    emoji: "✅",
    unlocked: (state) => Object.keys(state.completedLessons).length >= 10,
  },
  {
    id: "polyglot",
    title: "Polyglot",
    hint: "Complete lessons in two tracks",
    emoji: "🌍",
    unlocked: (state) => {
      const tracks = new Set<string>();
      for (const track of TRACKS) {
        if (track.units.some((unit) => unit.lessons.some((lesson) => state.completedLessons[lesson.id]))) {
          tracks.add(track.id);
        }
      }
      return tracks.size >= 2;
    },
  },
  {
    id: "sql-join",
    title: "Join the club",
    hint: "Finish a SQL lesson",
    emoji: "🔗",
    unlocked: (state) => Object.keys(state.completedLessons).some((id) => id.startsWith("sql-")),
  },
  {
    id: "treasure",
    title: "Treasure malloc",
    hint: "Hold 200 gems at once",
    emoji: "💎",
    unlocked: (state) => state.gems >= 200,
  },
];
