"use client";

import { leagueName, weeklyBoard } from "@/lib/leagues";
import { useProgress } from "@/lib/store";
import { Pip } from "@/components/Pip";

export function LeaguesScreen() {
  const { state } = useProgress();
  const board = weeklyBoard(state.weekId, state.displayName, state.weeklyXp);
  const league = leagueName(state.weeklyXp);
  const rank = board.findIndex((row) => row.you) + 1;

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">{league.label}</p>
        <h1>This week&apos;s climb</h1>
        <p className="lede">
          You are #{rank} with {state.weeklyXp} XP. Rivals reshuffle each ISO week — same week, same board.
        </p>
      </header>
      <div className="league-hero">
        <Pip mood={rank <= 3 ? "cheer" : "idle"} size={88} />
        <div>
          <strong>{league.label}</strong>
          <p>Week {state.weekId}</p>
        </div>
      </div>
      <ol className="board">
        {board.map((row, i) => (
          <li key={row.id} className={row.you ? "board-row you" : "board-row"}>
            <span className="rank">{i + 1}</span>
            <div>
              <strong>{row.name}</strong>
              <small>{row.city}</small>
            </div>
            <span className="xp-num">{row.weeklyXp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
