import type { ProgressState } from "./types";
import { getUnit, lessonKey } from "@/content/catalog";

export type BadgeDef = {
  id: string;
  name: string;
  blurb: string;
  emoji: string;
};

export const BADGES: BadgeDef[] = [
  { id: "first-bite", name: "First bite", blurb: "Finish your first lesson.", emoji: "🌱" },
  { id: "flawless", name: "Flawless", blurb: "Clear a lesson with no misses.", emoji: "💎" },
  { id: "on-fire", name: "On fire", blurb: "Hold a 3-day streak.", emoji: "🔥" },
  { id: "polyglot", name: "Polyglot", blurb: "Train in three languages.", emoji: "🌍" },
  { id: "centurion", name: "Centurion", blurb: "Earn 100 XP.", emoji: "⚡" },
  { id: "sql-sage", name: "SQL sage", blurb: "Complete the SQL unit.", emoji: "🗃️" },
  { id: "ship-it", name: "Ship it", blurb: "Complete the Git unit.", emoji: "🚢" },
  { id: "hooked", name: "Hooked", blurb: "Complete the React unit.", emoji: "⚛️" },
];

function unitDone(state: ProgressState, unitId: string): boolean {
  const unit = getUnit(unitId);
  if (!unit) return false;
  return unit.lessons.every((lesson) => Boolean(state.completed[lessonKey(unitId, lesson.id)]));
}

export function earnedBadges(state: ProgressState): string[] {
  const completed = Object.values(state.completed);
  const unitHits = new Set(
    Object.keys(state.completed).map((key) => key.split(":")[0]),
  );
  const ids: string[] = [];
  if (completed.length >= 1) ids.push("first-bite");
  if (completed.some((item) => item.perfect)) ids.push("flawless");
  if (state.streak >= 3) ids.push("on-fire");
  if (unitHits.size >= 3) ids.push("polyglot");
  if (state.xp >= 100) ids.push("centurion");
  if (unitDone(state, "sql")) ids.push("sql-sage");
  if (unitDone(state, "git")) ids.push("ship-it");
  if (unitDone(state, "react")) ids.push("hooked");
  return ids;
}
