"use client";

import Link from "next/link";
import { allLessons, isLessonUnlocked, isUnitComplete } from "@/lib/curriculum";
import type { Track } from "@/lib/types";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/cn";

export function PathMap({ track }: { track: Track }) {
  const { state, dispatch } = useGame();
  const lessons = allLessons(track);

  return (
    <div className="relative mx-auto max-w-sm pb-8 pt-2">
      <div className="pointer-events-none absolute inset-y-8 left-1/2 w-1 -translate-x-1/2 rounded-full bg-line" />
      {track.units.map((unit) => {
        const complete = isUnitComplete(unit, state.completedLessons);
        const opened = state.openedChests.includes(unit.id);
        return (
          <section key={unit.id} className="relative mb-8">
            <div className="relative z-10 mb-5 rounded-2xl border-2 border-line bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">{track.title}</p>
              <h2 className="text-lg font-extrabold">{unit.title}</h2>
              <p className="text-sm text-muted">{unit.blurb}</p>
            </div>
            <div className="flex flex-col items-center gap-5">
              {unit.lessons.map((lesson) => {
                const index = lessons.findIndex((item) => item.id === lesson.id);
                const unlocked = isLessonUnlocked(track, lesson.id, state.completedLessons);
                const done = Boolean(state.completedLessons[lesson.id]);
                const current = unlocked && !done;
                const shift = Math.round(Math.sin(index * 0.95) * 46);
                const blocked = state.hearts <= 0 && !done;
                const nodeClass = cn(
                  "relative z-10 grid h-[74px] w-[74px] place-items-center rounded-full border-b-8 text-2xl font-black",
                  done && "border-[#0f9b7c] bg-mint text-white",
                  current && "pulse-ring border-[#d19a12] bg-gold text-[#3b2a00]",
                  !unlocked && "cursor-not-allowed border-[#c5d0d6] bg-[#e7eef1] text-[#9aadb6]",
                  blocked && unlocked && !done && "opacity-70",
                );
                const label = `${lesson.title}${done ? " completed" : unlocked ? "" : " locked"}`;
                const inner = (
                  <>
                    {done ? "✓" : unlocked ? index + 1 : "🔒"}
                    <span className="absolute -bottom-6 whitespace-nowrap text-[11px] font-extrabold text-ink">
                      {lesson.title}
                    </span>
                  </>
                );
                if (!unlocked) {
                  return (
                    <div key={lesson.id} style={{ transform: `translateX(${shift}px)` }} className={nodeClass} aria-label={label}>
                      {inner}
                    </div>
                  );
                }
                return (
                  <Link
                    key={lesson.id}
                    href={blocked ? "/shop" : `/lesson/${lesson.id}`}
                    style={{ transform: `translateX(${shift}px)` }}
                    className={nodeClass}
                    aria-label={label}
                  >
                    {inner}
                  </Link>
                );
              })}
              <button
                type="button"
                disabled={!complete || opened}
                onClick={() => dispatch({ type: "OPEN_CHEST", unitId: unit.id })}
                className={cn(
                  "relative z-10 mt-4 grid h-16 w-16 place-items-center rounded-2xl border-b-8 text-2xl",
                  opened ? "border-line bg-white" : complete ? "border-[#d19a12] bg-gold" : "border-[#c5d0d6] bg-[#e7eef1]",
                )}
                aria-label={opened ? "Chest already opened" : complete ? "Open unit chest" : "Chest locked"}
              >
                {opened ? "📦" : "🎁"}
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
