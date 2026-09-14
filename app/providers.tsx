"use client";

import { AppShell } from "@/components/AppShell";
import { ProgressProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <AppShell>{children}</AppShell>
    </ProgressProvider>
  );
}
