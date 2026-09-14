import { hashString } from "./cn";

const RIVALS = [
  "Ada_Byte",
  "NullPat",
  "LinusLoop",
  "CSSWitch",
  "PipInstall",
  "GitGud",
  "RecurseMe",
  "BizerteDev",
  "StackFox",
  "CommaQueen",
];

export function weeklyBoard(weekId: string, name: string, weeklyXp: number) {
  const seed = hashString(weekId || "week");
  const rows = RIVALS.map((rival, index) => ({
    name: rival,
    xp: 28 + ((seed * (index + 3) + index * 47) % 310),
    you: false,
  }));
  rows.push({ name: name || "You", xp: weeklyXp, you: true });
  return rows.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
}
