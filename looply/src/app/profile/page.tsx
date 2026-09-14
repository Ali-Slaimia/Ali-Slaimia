"use client";

import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { Pressable } from "@/components/Pressable";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { allLessons, TRACKS } from "@/lib/curriculum";
import { useGame } from "@/lib/store";

export default function ProfilePage() {
  const { state, dispatch } = useGame();
  const completed = Object.keys(state.completedLessons).length;
  const total = TRACKS.reduce((sum, track) => sum + allLessons(track).length, 0);

  return (
    <AppShell>
      <div className="flex flex-col items-center text-center">
        <Mascot look={state.mascot} mood="happy" className="h-32 w-32" />
        <h1 className="text-3xl font-black">{state.displayName || "Loopster"}</h1>
        <p className="font-bold text-muted">
          {state.xp} XP · {state.streak} day streak · {completed}/{total} lessons
        </p>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-black">Achievements</h2>
        <div className="grid gap-2">
          {ACHIEVEMENTS.map((item) => {
            const unlocked = state.achievements.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
                  unlocked ? "border-mint bg-[#e8fff8]" : "border-line bg-white opacity-70"
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-sm font-semibold text-muted">{item.hint}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Pressable
        tone="snow"
        className="mt-8 w-full"
        onClick={() => {
          if (window.confirm("Reset all Looply progress on this device?")) {
            dispatch({ type: "RESET" });
          }
        }}
      >
        Reset progress
      </Pressable>
    </AppShell>
  );
}
