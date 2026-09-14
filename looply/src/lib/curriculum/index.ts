import type { Lesson, Track, Unit } from "../types";
import { javascript } from "./javascript";
import { python } from "./python";
import { react } from "./react";
import { sql } from "./sql";
import { typescript } from "./typescript";

export const TRACKS: Track[] = [javascript, typescript, python, react, sql];

export function getTrack(trackId: string): Track | undefined {
  return TRACKS.find((track) => track.id === trackId);
}

export function allLessons(track: Track): Lesson[] {
  return track.units.flatMap((unit) => unit.lessons);
}

export function findLesson(lessonId: string): { track: Track; unit: Unit; lesson: Lesson; index: number } | undefined {
  for (const track of TRACKS) {
    const lessons = allLessons(track);
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;
    const lesson = lessons[index];
    const unit = track.units.find((item) => item.lessons.some((entry) => entry.id === lessonId));
    if (!unit) continue;
    return { track, unit, lesson, index };
  }
  return undefined;
}

export function isLessonUnlocked(track: Track, lessonId: string, completed: Record<string, unknown>): boolean {
  const lessons = allLessons(track);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return true;
  return Boolean(completed[lessons[index - 1].id]);
}

export function isUnitComplete(unit: Unit, completed: Record<string, unknown>): boolean {
  return unit.lessons.every((lesson) => completed[lesson.id]);
}

export function flattenExercises() {
  return TRACKS.flatMap((track) =>
    track.units.flatMap((unit) =>
      unit.lessons.flatMap((lesson) =>
        lesson.exercises.map((exercise) => ({ exercise, lessonId: lesson.id, trackId: track.id })),
      ),
    ),
  );
}
