"use client";

import { AppShell } from "@/components/AppShell";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Mascot } from "@/components/Mascot";
import { flattenExercises } from "@/lib/curriculum";
import { useGame } from "@/lib/store";
import { Pressable } from "@/components/Pressable";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function PracticePage() {
  const { state } = useGame();
  const [started, setStarted] = useState(false);
  const lesson = useMemo(() => {
    const catalog = flattenExercises();
    const picked = state.mistakeBank
      .map((mistake) => catalog.find((item) => item.exercise.id === mistake.exerciseId)?.exercise)
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 5);
    if (picked.length === 0) return null;
    return {
      id: "practice",
      title: "Review",
      xp: 10,
      exercises: picked,
    };
  }, [state.mistakeBank]);

  if (started && lesson) {
    return <LessonPlayer lesson={lesson} practice />;
  }

  return (
    <AppShell>
      <div className="flex flex-col items-center text-center">
        <Mascot mood={lesson ? "think" : "happy"} look={state.mascot} className="h-32 w-32" />
        <h1 className="text-3xl font-black">Practice</h1>
        <p className="mt-2 max-w-sm font-semibold text-muted">
          Missed questions land here. Review is heart-free — a safe compile before you go back to the path.
        </p>
        {lesson ? (
          <>
            <p className="mt-4 font-extrabold">{lesson.exercises.length} waiting in the queue</p>
            <Pressable className="mt-4 w-full" onClick={() => setStarted(true)}>
              Review misses
            </Pressable>
          </>
        ) : (
          <>
            <p className="mt-4 font-extrabold text-mint-dark">Queue is empty. Clean compile.</p>
            <Link href="/" className="mt-4 font-extrabold text-sky">
              Back to learn
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}
