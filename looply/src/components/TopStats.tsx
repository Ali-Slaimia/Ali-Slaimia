"use client";

import { HEARTS_MAX } from "@/lib/constants";
import { useGame } from "@/lib/store";

export function TopStats() {
  const { state } = useGame();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
      <Stat icon="🔥" value={state.streak} label="streak" />
      <Stat icon="💎" value={state.gems} label="gems" />
      <div className="flex items-center gap-1 font-extrabold text-heart">
        <span aria-hidden>❤️</span>
        <span>
          {state.hearts}/{HEARTS_MAX}
        </span>
      </div>
    </header>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 font-extrabold text-ink" aria-label={`${value} ${label}`}>
      <span aria-hidden>{icon}</span>
      <span>{value}</span>
    </div>
  );
}
