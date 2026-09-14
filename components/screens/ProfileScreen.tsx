"use client";

import { BADGES } from "@/lib/badges";
import { catalog, lessonKey } from "@/content/catalog";
import { useProgress } from "@/lib/store";
import { Pip } from "@/components/Pip";

export function ProfileScreen() {
  const { state, dispatch, reset } = useProgress();
  const completed = Object.keys(state.completed).length;
  const total = catalog.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const perfects = Object.values(state.completed).filter((item) => item.perfect).length;

  return (
    <div className="screen">
      <header className="profile-hero">
        <Pip mood="idle" size={100} />
        <div>
          <p className="eyebrow">Trail log</p>
          <h1>{state.displayName}</h1>
          <p className="lede">
            {state.xp} XP · {state.streak}-day streak · {completed}/{total} lessons
          </p>
        </div>
      </header>

      <section className="card-grid">
        <article>
          <strong>{perfects}</strong>
          <span>Flawless</span>
        </article>
        <article>
          <strong>{state.bits}</strong>
          <span>Bits</span>
        </article>
        <article>
          <strong>{state.weeklyXp}</strong>
          <span>Week XP</span>
        </article>
      </section>

      <section>
        <h2>Badges</h2>
        <ul className="badges">
          {BADGES.map((badge) => {
            const on = state.badges.includes(badge.id);
            return (
              <li key={badge.id} className={on ? "badge on" : "badge"}>
                <span>{badge.emoji}</span>
                <div>
                  <strong>{badge.name}</strong>
                  <small>{badge.blurb}</small>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Units</h2>
        <ul className="unit-progress">
          {catalog.map((unit) => {
            const done = unit.lessons.filter((lesson) => state.completed[lessonKey(unit.id, lesson.id)]).length;
            return (
              <li key={unit.id}>
                <span style={{ color: unit.accent }}>{unit.language}</span>
                <div>
                  <strong>{unit.title}</strong>
                  <small>
                    {done}/{unit.lessons.length} lessons
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="settings">
        <h2>Settings</h2>
        <button className="btn ghost" onClick={() => dispatch({ type: "TOGGLE_SOUND" })}>
          Sound: {state.sound ? "on" : "off"}
        </button>
        <button
          className="btn danger"
          onClick={() => {
            if (window.confirm("Reset the trail? XP, streaks, and badges go back to zero.")) reset();
          }}
        >
          Reset trail
        </button>
      </section>
    </div>
  );
}
