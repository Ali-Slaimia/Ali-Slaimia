"use client";

import { BottomNav } from "./BottomNav";
import { TopStats } from "./TopStats";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-sheet shadow-[0_0_80px_rgba(16,80,60,0.18)]">
      <TopStats />
      <main className="flex-1 px-4 pb-6 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
