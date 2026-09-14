"use client";

import { Mascot } from "@/components/Mascot";
import { GameProvider, useGame } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <HydrateGate>{children}</HydrateGate>
    </GameProvider>
  );
}

function HydrateGate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useGame();
  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-sheet">
        <Mascot className="h-32 w-32" />
        <p className="text-2xl font-black">Looply</p>
        <p className="text-sm font-bold text-muted">warming the cache…</p>
      </div>
    );
  }
  return children;
}
