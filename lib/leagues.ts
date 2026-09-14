import { hashSeed, mulberry32 } from "./shuffle";

export type Rival = {
  id: string;
  name: string;
  city: string;
  weeklyXp: number;
  you?: boolean;
};

const ROSTER: Array<{ id: string; name: string; city: string }> = [
  { id: "yasmine", name: "Yasmine K.", city: "Tunis" },
  { id: "lea", name: "Léa M.", city: "Lyon" },
  { id: "jonas", name: "Jonas P.", city: "Berlin" },
  { id: "karim", name: "Karim B.", city: "Sfax" },
  { id: "sara", name: "Sara N.", city: "Barcelona" },
  { id: "hugo", name: "Hugo T.", city: "Paris" },
  { id: "amira", name: "Amira C.", city: "Sousse" },
  { id: "noah", name: "Noah W.", city: "Amsterdam" },
  { id: "ines", name: "Inès R.", city: "Marseille" },
];

export function leagueName(weeklyXp: number): { id: string; label: string } {
  if (weeklyXp >= 320) return { id: "gold", label: "Gold league" };
  if (weeklyXp >= 160) return { id: "silver", label: "Silver league" };
  if (weeklyXp >= 60) return { id: "bronze", label: "Bronze league" };
  return { id: "wood", label: "Wood league" };
}

export function weeklyBoard(weekId: string, youName: string, youXp: number): Rival[] {
  const rivals: Rival[] = ROSTER.map((person) => {
    const rand = mulberry32(hashSeed(`${weekId}:${person.id}`));
    const weeklyXp = 28 + Math.floor(rand() * 360);
    return { ...person, weeklyXp };
  });
  rivals.push({
    id: "you",
    name: youName || "You",
    city: "Bizerte",
    weeklyXp: youXp,
    you: true,
  });
  return rivals.sort((a, b) => b.weeklyXp - a.weeklyXp || a.name.localeCompare(b.name));
}
