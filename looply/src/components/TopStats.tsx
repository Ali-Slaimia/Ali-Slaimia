"use client";

import { HEARTS_MAX } from "@/lib/constants";
import { useGame } from "@/lib/store";

export function TopStats() {
  const { state } = useGame();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-2 border-[#14342c] bg-[#e8fff4]/95 px-4 py-3 pt-5 backdrop-blur">
      <div className="stat-pill text-[#e85d04]" aria-label={`${state.streak} streak`}>
        <span aria-hidden>🔥</span>
        <span>{state.streak}</span>
      </div>
      <div className="stat-pill text-[#2f7cf6]" aria-label={`${state.gems} gems`}>
        <span aria-hidden>💎</span>
        <span>{state.gems}</span>
      </div>
      <div className="stat-pill text-heart" aria-label={`${state.hearts} hearts`}>
        <span aria-hidden>❤️</span>
        <span>
          {state.hearts}/{HEARTS_MAX}
        </span>
      </div>
    </header>
  );
}
