"use client";

import { AppShell } from "@/components/AppShell";
import { Onboarding } from "@/components/Onboarding";
import { PathMap } from "@/components/PathMap";
import { getTrack, TRACKS } from "@/lib/curriculum";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function HomePage() {
  const { state, dispatch } = useGame();
  if (!state.onboardingComplete) return <Onboarding />;

  const track = getTrack(state.activeTrackId) ?? TRACKS[0];
  const goalPct = Math.min(100, Math.round((state.todayXp / state.dailyGoal) * 100));

  return (
    <AppShell>
      <section className="mb-5 rounded-3xl border-2 border-line bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">Daily goal</p>
            <p className="text-xl font-black">
              {state.todayXp} / {state.dailyGoal} XP
            </p>
          </div>
          <div className="text-right text-sm font-bold text-muted">
            {goalPct >= 100 ? "Goal smashed" : `${goalPct}%`}
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-gold" style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TRACKS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch({ type: "SET_TRACK", trackId: item.id })}
            className={cn(
              "whitespace-nowrap rounded-full border-2 px-3 py-1.5 text-sm font-extrabold",
              state.activeTrackId === item.id ? "border-mint bg-[#e8fff8]" : "border-line bg-white",
            )}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {state.hearts <= 0 && (
        <p className="mb-4 rounded-2xl bg-[#ffe4ea] px-4 py-3 text-sm font-bold text-[#9f1239]">
          Out of hearts — shop a refill or wait for tomorrow&apos;s reset.
        </p>
      )}

      <PathMap track={track} />
    </AppShell>
  );
}
