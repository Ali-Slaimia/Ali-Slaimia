"use client";

import Link from "next/link";
import { catalog, lessonKey } from "@/content/catalog";
import { isLessonUnlocked } from "@/lib/progress";
import { useProgress } from "@/lib/store";

export function SkillTree() {
  const { state } = useProgress();

  return (
    <div className="tree">
      {catalog.map((unit) => (
        <section key={unit.id} className="unit">
          <header className="unit-head" style={{ ["--accent" as string]: unit.accent }}>
            <span className="unit-lang">{unit.language}</span>
            <div>
              <h2>{unit.title}</h2>
              <p>{unit.subtitle}</p>
            </div>
          </header>
          <ol className="path">
            {unit.lessons.map((lesson, index) => {
              const key = lessonKey(unit.id, lesson.id);
              const done = Boolean(state.completed[key]);
              const unlocked = isLessonUnlocked(unit.lessons, index, state.completed, unit.id);
              const current =
                unlocked &&
                !done &&
                (index === 0 || Boolean(state.completed[lessonKey(unit.id, unit.lessons[index - 1].id)]));
              const href = `/learn/${unit.id}/${lesson.id}/`;
              return (
                <li key={lesson.id} className={`node-wrap zig-${index % 3}`}>
                  {unlocked ? (
                    <Link
                      href={href}
                      className={`node ${done ? "done" : ""} ${current ? "current" : ""}`}
                      style={{ ["--accent" as string]: unit.accent }}
                    >
                      <span className="node-core">{done ? "✓" : index + 1}</span>
                      {current ? <span className="start-pill">START</span> : null}
                    </Link>
                  ) : (
                    <div className="node locked" aria-disabled>
                      <span className="node-core">🔒</span>
                    </div>
                  )}
                  <div className="node-meta">
                    <strong>{lesson.title}</strong>
                    <span>{done ? (state.completed[key].perfect ? "Perfect" : "Cleared") : lesson.blurb}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
