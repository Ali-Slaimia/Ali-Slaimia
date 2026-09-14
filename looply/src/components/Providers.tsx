"use client";

import { GameProvider, useGame } from "@/lib/store";
import { Mascot } from "./Mascot";
import type { ReactNode } from "react";

function HydrateGate({ children }: { children: ReactNode }) {
  const { hydrated } = useGame();
  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-sheet px-6 py-8 text-center">
        <Mascot mood="happy" className="h-32 w-32" />
        <p className="mt-4 text-lg font-black">Looking for your save…</p>
        <p className="mt-2 text-sm font-semibold text-muted">Checking this network and this browser.</p>
      </div>
    );
  }
  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      <HydrateGate>{children}</HydrateGate>
    </GameProvider>
  );
}
