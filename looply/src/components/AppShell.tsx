"use client";

import { BottomNav } from "./BottomNav";
import { TopStats } from "./TopStats";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell mx-auto flex min-h-dvh w-full max-w-[430px] flex-col rounded-[28px] sm:min-h-[min(100dvh,920px)] sm:my-6">
      <TopStats />
      <main className="flex-1 px-4 pb-6 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
