export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function shuffle<T>(items: T[], seed: string): T[] {
  const copy = [...items];
  let hash = hashString(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.length > 1 && copy.every((item, index) => item === items[index])) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}
