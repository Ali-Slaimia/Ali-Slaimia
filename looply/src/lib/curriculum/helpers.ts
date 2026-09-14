import type { Exercise, Lesson, Unit } from "../types";

export function lesson(id: string, title: string, exercises: Exercise[], xp = 20): Lesson {
  return { id, title, xp, exercises };
}

export function unit(id: string, title: string, blurb: string, lessons: Lesson[], chestGems = 20): Unit {
  return { id, title, blurb, lessons, chestGems };
}

export function mcq(
  id: string,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return { id, type: "mcq", prompt, options, answer, explanation, ...extra };
}

export function output(
  id: string,
  prompt: string,
  code: string,
  options: string[],
  answer: string,
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return { id, type: "output", prompt, code, options, answer, explanation, ...extra };
}

export function fill(
  id: string,
  prompt: string,
  code: string,
  options: string[],
  answer: string,
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return { id, type: "fill", prompt, code, options, answer, explanation, ...extra };
}

export function typeIn(
  id: string,
  prompt: string,
  answer: string,
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return { id, type: "type", prompt, answer, explanation, ...extra };
}

export function order(
  id: string,
  prompt: string,
  pieces: string[],
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return { id, type: "order", prompt, pieces, answer: pieces, explanation, ...extra };
}
