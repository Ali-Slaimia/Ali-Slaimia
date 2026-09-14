import { describe, expect, it } from "vitest";
import { catalog, getLesson, lessonKey } from "@/content/catalog";
import { checkAnswer, expectedAnswer } from "@/lib/scoring";

describe("catalog", () => {
  it("has six units and enough exercises to feel like a product", () => {
    expect(catalog).toHaveLength(6);
    const exercises = catalog.flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.exercises));
    expect(exercises.length).toBeGreaterThanOrEqual(70);
    const ids = exercises.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every official answer valid against the engine", () => {
    for (const unit of catalog) {
      for (const lesson of unit.lessons) {
        for (const exercise of lesson.exercises) {
          const submission =
            exercise.type === "order"
              ? { kind: "tokens" as const, tokens: exercise.tokens }
              : exercise.type === "blank"
                ? { kind: "text" as const, value: exercise.answer }
                : { kind: "index" as const, index: exercise.answer };
          expect(checkAnswer(exercise, submission), exercise.id).toBe(true);
          expect(expectedAnswer(exercise).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("resolves nested lookups", () => {
    const found = getLesson("javascript", "values");
    expect(found?.index).toBe(0);
    expect(lessonKey("javascript", "values")).toBe("javascript:values");
  });
});
