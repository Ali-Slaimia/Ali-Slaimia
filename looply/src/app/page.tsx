"use client";

import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
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
      <section className="relative mb-5 overflow-hidden rounded-3xl border-[3px] border-[#14342c] bg-white p-4 shadow-[0_6px_0_#14342c]">
        <div className="flex items-center gap-3">
          <Mascot look={state.mascot} mood={goalPct >= 100 ? "celebrate" : "happy"} className="h-20 w-20 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">Daily goal</p>
            <p className="text-xl font-black">
              {state.todayXp} / {state.dailyGoal} XP
            </p>
            <p className="text-sm font-bold text-muted">
              {goalPct >= 100 ? "Goal smashed. Loopy is proud." : `${goalPct}% to tonight's treat.`}
            </p>
          </div>
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded-full border-2 border-[#14342c] bg-[#e7f8ef]">
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
              "whitespace-nowrap rounded-full border-[3px] border-b-4 px-3 py-1.5 text-sm font-extrabold",
              state.activeTrackId === item.id
                ? "border-[#14342c] bg-mint text-[#07342c]"
                : "border-line bg-white text-ink",
            )}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {state.hearts <= 0 && (
        <p className="mb-4 rounded-2xl border-2 border-[#9f1239] bg-[#ffe4ea] px-4 py-3 text-sm font-bold text-[#9f1239]">
          Out of hearts — shop a refill or wait for tomorrow&apos;s reset.
        </p>
      )}

      <PathMap track={track} />
    </AppShell>
  );
}
