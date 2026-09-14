import type { Exercise, Submission } from "./types";

export function normalizeCode(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function sameTokens(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((token, i) => token === b[i]);
}

export function expectedAnswer(exercise: Exercise): string {
  switch (exercise.type) {
    case "mcq":
    case "output":
      return exercise.choices[exercise.answer];
    case "order":
      return exercise.tokens.join(" ");
    case "blank":
      return exercise.answer;
    case "bug":
      return exercise.lines[exercise.answer];
  }
}

export function checkAnswer(exercise: Exercise, submission: Submission): boolean {
  switch (exercise.type) {
    case "mcq":
    case "output":
      return submission.kind === "index" && submission.index === exercise.answer;
    case "bug":
      return submission.kind === "index" && submission.index === exercise.answer;
    case "order":
      return submission.kind === "tokens" && sameTokens(submission.tokens, exercise.tokens);
    case "blank":
      return (
        submission.kind === "text" &&
        normalizeCode(submission.value) === normalizeCode(exercise.answer)
      );
  }
}

export function lessonXp(base: number, correct: number, total: number, missed: number): number {
  const accuracy = total === 0 ? 0 : correct / total;
  const perfectBonus = missed === 0 ? 15 : 0;
  return Math.round(base * accuracy) + perfectBonus + correct * 2;
}

export function heartsAfterMiss(hearts: number): number {
  return Math.max(0, hearts - 1);
}

export const HEARTS_PER_LESSON = 5;
