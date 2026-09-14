export function isoDate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftIsoDate(today: string, days: number): string {
  const [y, m, d] = today.split("-").map(Number);
  const next = new Date(y, m - 1, d);
  next.setDate(next.getDate() + days);
  return isoDate(next);
}

export function isoWeekId(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export type StreakEvent = "same-day" | "continue" | "restart";

export function nextStreak(
  streak: number,
  lastActiveDate: string | null,
  today: string,
  yesterday: string,
): { streak: number; event: StreakEvent } {
  if (lastActiveDate === today) {
    return { streak: Math.max(streak, 1), event: "same-day" };
  }
  if (lastActiveDate === yesterday) {
    return { streak: streak + 1, event: "continue" };
  }
  return { streak: 1, event: "restart" };
}

export function streakOnLoad(
  streak: number,
  lastActiveDate: string | null,
  today: string,
  yesterday: string,
): number {
  if (!lastActiveDate || lastActiveDate === today || lastActiveDate === yesterday) {
    return streak;
  }
  return 0;
}
