"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";
import { useProgress } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready, state } = useProgress();
  const lesson = pathname.startsWith("/learn");

  if (!ready) {
    return (
      <div className="splash">
        <div className="logo-mark">Bt</div>
        <p>ByteTrail</p>
      </div>
    );
  }

  return (
    <div className={lesson ? "shell lesson-shell" : "shell"}>
      {!state.onboarded && !lesson ? <Onboarding /> : null}
      <div className="stage">{children}</div>
      {!lesson ? <BottomNav /> : null}
    </div>
  );
}
