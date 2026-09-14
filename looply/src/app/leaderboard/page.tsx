"use client";

import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { leagueForXp } from "@/lib/game";
import { weeklyBoard } from "@/lib/leaderboard";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function LeaderboardPage() {
  const { state } = useGame();
  const league = leagueForXp(state.weeklyXp);
  const board = weeklyBoard(state.weekId, state.displayName, state.weeklyXp);

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <Mascot look={state.mascot} className="h-20 w-20" />
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">{league.title} league</p>
          <h1 className="text-3xl font-black">This week</h1>
          <p className="text-sm font-bold text-muted">{state.weeklyXp} XP · resets Monday</p>
        </div>
      </div>
      <ol className="grid gap-2">
        {board.map((row, index) => (
          <li
            key={row.name}
            className={cn(
              "flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-extrabold",
              row.you ? "border-[#14342c] bg-[#e8fff8] shadow-[0_4px_0_#14342c]" : "border-line bg-white",
            )}
          >
            <span>
              <span className="mr-3 text-muted">{index + 1}</span>
              {row.name}
              {row.you ? " · you" : ""}
            </span>
            <span>{row.xp}</span>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
