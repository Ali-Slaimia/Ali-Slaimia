import type { Exercise, Lesson, Unit } from "@/lib/types";
import { javascriptUnit } from "./javascript";
import { pythonUnit } from "./python";
import { typescriptUnit } from "./typescript";
import { sqlUnit } from "./sql";
import { gitUnit } from "./git";
import { reactUnit } from "./react";

export const catalog: Unit[] = [
  javascriptUnit,
  pythonUnit,
  typescriptUnit,
  sqlUnit,
  gitUnit,
  reactUnit,
];

export function lessonKey(unitId: string, lessonId: string): string {
  return `${unitId}:${lessonId}`;
}

export function getUnit(unitId: string): Unit | undefined {
  return catalog.find((unit) => unit.id === unitId);
}

export function getLesson(unitId: string, lessonId: string): { unit: Unit; lesson: Lesson; index: number } | undefined {
  const unit = getUnit(unitId);
  if (!unit) return undefined;
  const index = unit.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return undefined;
  return { unit, lesson: unit.lessons[index], index };
}

export function getExercise(
  unitId: string,
  lessonId: string,
  exerciseId: string,
): { unit: Unit; lesson: Lesson; exercise: Exercise } | undefined {
  const found = getLesson(unitId, lessonId);
  if (!found) return undefined;
  const exercise = found.lesson.exercises.find((item) => item.id === exerciseId);
  if (!exercise) return undefined;
  return { unit: found.unit, lesson: found.lesson, exercise };
}

export function nextLesson(unitId: string, lessonId: string): { unitId: string; lessonId: string } | null {
  const found = getLesson(unitId, lessonId);
  if (!found) return null;
  const upcoming = found.unit.lessons[found.index + 1];
  if (upcoming) return { unitId, lessonId: upcoming.id };
  const unitIndex = catalog.findIndex((unit) => unit.id === unitId);
  const nextUnit = catalog[unitIndex + 1];
  if (nextUnit?.lessons[0]) return { unitId: nextUnit.id, lessonId: nextUnit.lessons[0].id };
  return null;
}

export function allExercises() {
  return catalog.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.exercises.map((exercise) => ({ unit, lesson, exercise })),
    ),
  );
}
