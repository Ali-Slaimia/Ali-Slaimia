"use client";

import Link from "next/link";
import { allLessons, isLessonUnlocked, isUnitComplete } from "@/lib/curriculum";
import type { Track } from "@/lib/types";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/cn";

const UNIT_TONES = ["#2ee59d", "#58cc02", "#1cb0f6", "#ce82ff", "#ff9600"];

export function PathMap({ track }: { track: Track }) {
  const { state, dispatch } = useGame();
  const lessons = allLessons(track);

  return (
    <div className="relative mx-auto max-w-sm pb-8 pt-2">
      <div className="path-rail pointer-events-none" />
      {track.units.map((unit, unitIndex) => {
        const complete = isUnitComplete(unit, state.completedLessons);
        const opened = state.openedChests.includes(unit.id);
        const tone = UNIT_TONES[unitIndex % UNIT_TONES.length];
        return (
          <section key={unit.id} className="relative mb-10">
            <div
              className="relative z-10 mb-6 overflow-hidden rounded-3xl border-[3px] border-[#14342c] bg-white px-4 py-3 text-center shadow-[0_6px_0_#14342c]"
              style={{ borderTopColor: tone, borderTopWidth: 10 }}
            >
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">{track.title}</p>
              <h2 className="text-lg font-black">{unit.title}</h2>
              <p className="text-sm font-semibold text-muted">{unit.blurb}</p>
            </div>
            <div className="flex flex-col items-center gap-8">
              {unit.lessons.map((lesson) => {
                const index = lessons.findIndex((item) => item.id === lesson.id);
                const unlocked = isLessonUnlocked(track, lesson.id, state.completedLessons);
                const done = Boolean(state.completedLessons[lesson.id]);
                const current = unlocked && !done;
                const shift = Math.round(Math.sin(index * 0.95) * 52);
                const blocked = state.hearts <= 0 && !done;
                const nodeClass = cn(
                  "relative z-10 grid h-[78px] w-[78px] place-items-center rounded-full border-[3px] border-b-[8px] text-2xl font-black",
                  done && "border-[#0b7a52] bg-mint text-[#07342c]",
                  current && "pulse-ring border-[#c48512] bg-gold text-[#3b2a00]",
                  !unlocked && "cursor-not-allowed border-[#9aaeb0] bg-[#d9e3e6] text-[#7d9096]",
                  blocked && unlocked && !done && "opacity-70",
                );
                const label = `${lesson.title}${done ? " completed" : unlocked ? "" : " locked"}`;
                const inner = (
                  <>
                    <span className="absolute -inset-2 -z-10 rounded-full bg-[#7dcc8f]" />
                    {done ? "★" : current ? "▶" : unlocked ? index + 1 : "🔒"}
                    {current ? (
                      <span className="absolute -top-5 rounded-full bg-[#14342c] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                        Start
                      </span>
                    ) : null}
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
                  "relative z-10 mt-2 grid h-[68px] w-[68px] place-items-center rounded-2xl border-[3px] border-b-8 text-3xl",
                  opened ? "border-line bg-white" : complete ? "bounce-y border-[#c48512] bg-gold" : "border-[#9aaeb0] bg-[#d9e3e6]",
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
