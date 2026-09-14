"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { answersMatch, lessonXp } from "@/lib/game";
import type { Lesson, Mistake } from "@/lib/types";
import { useGame } from "@/lib/store";
import { Mascot } from "./Mascot";
import { Pressable } from "./Pressable";
import { QuestionCard } from "./QuestionCard";

export function LessonPlayer({ lesson, practice = false }: { lesson: Lesson; practice?: boolean }) {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [index, setIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboMax, setComboMax] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; explanation: string } | null>(null);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const exercise = lesson.exercises[index];
  const total = lesson.exercises.length;
  const progress = ((index + (feedback ? 1 : 0)) / total) * 100;
  const seed = useMemo(() => `${lesson.id}-${exercise?.id ?? "x"}`, [lesson.id, exercise?.id]);

  if (!practice && state.hearts <= 0 && !done && !feedback) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center gap-4 bg-sheet px-6 text-center">
        <Mascot mood="sad" look={state.mascot} className="h-36 w-36" />
        <h1 className="text-3xl font-black">Out of hearts</h1>
        <p className="font-semibold text-muted">They refill tomorrow. A shop pack gets you back in today.</p>
        <Pressable className="w-full" onClick={() => router.push("/shop")}>
          Go to shop
        </Pressable>
      </div>
    );
  }

  if (!exercise && !done) return null;

  function finish() {
    const perfect = wrong === 0;
    const earned = lessonXp(lesson.xp, comboMax, perfect, state.doubleXpLessons > 0 && !practice);
    if (!practice) {
      dispatch({
        type: "COMPLETE_LESSON",
        lessonId: lesson.id,
        perfect,
        earnedXp: earned,
        mistakes,
        now: Date.now(),
      });
    }
    setDone(true);
  }

  function onSubmit(value: string | string[]) {
    if (!exercise || feedback) return;
    const ok = answersMatch(exercise.answer, value, exercise.type);
    if (ok) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setComboMax((current) => Math.max(current, nextCombo));
      if (practice) dispatch({ type: "CLEAR_MISTAKE", exerciseId: exercise.id });
      setFeedback({ ok: true, explanation: exercise.explanation });
    } else {
      setCombo(0);
      setWrong((count) => count + 1);
      setMistakes((current) =>
        current.some((item) => item.exerciseId === exercise.id)
          ? current
          : [...current, { exerciseId: exercise.id, lessonId: lesson.id }],
      );
      if (!practice) {
        dispatch({
          type: "LOSE_HEART",
          mistake: { exerciseId: exercise.id, lessonId: lesson.id },
        });
      }
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setFeedback({ ok: false, explanation: exercise.explanation });
    }
  }

  function continueLesson() {
    const heartsLeft = practice ? 1 : state.hearts;
    if (!feedback?.ok && !practice && heartsLeft <= 0) {
      router.push("/shop");
      return;
    }
    if (index + 1 >= total) {
      finish();
      return;
    }
    setFeedback(null);
    setIndex((current) => current + 1);
  }

  const earnedPreview = lessonXp(lesson.xp, comboMax, wrong === 0, state.doubleXpLessons > 0 && !practice);

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <Mascot mood="celebrate" look={state.mascot} className="h-40 w-40" />
        <p className="text-sm font-extrabold uppercase tracking-widest text-mint-dark">Lesson complete</p>
        <h1 className="text-4xl font-black">{wrong === 0 ? "Flawless!" : "Shipped."}</h1>
        <p className="text-lg font-bold text-muted">
          {practice ? "Those misses are cleared from the review pile." : `+${earnedPreview} XP${wrong === 0 ? " · perfect bonus" : ""}`}
        </p>
        <div className="flex gap-2 text-2xl" aria-hidden>
          {["✨", "🔥", "💎"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <Pressable className="mt-4 w-full max-w-xs" onClick={() => router.push("/")}>
          Continue
        </Pressable>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-sheet px-4 pb-6 pt-3">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/" className="grid h-10 w-10 place-items-center rounded-full text-xl text-muted" aria-label="Close lesson">
          ✕
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-extrabold text-heart">❤️ {practice ? "∞" : state.hearts}</span>
      </div>
      <div className={shake ? "shake" : undefined}>
        <Mascot mood={feedback ? (feedback.ok ? "happy" : "sad") : "think"} look={state.mascot} className="mx-auto h-24 w-24" />
      </div>
      <QuestionCard key={exercise.id} exercise={exercise!} seed={seed} disabled={Boolean(feedback)} onSubmit={onSubmit} />

      {feedback && (
        <div
          className={`pop-in mt-4 rounded-3xl p-4 ${feedback.ok ? "bg-[#d9fff0] text-[#0c6b54]" : "bg-[#ffe4ea] text-[#9f1239]"}`}
        >
          <p className="font-black">{feedback.ok ? "Nice!" : "Not quite."}</p>
          <p className="mt-1 text-sm font-semibold">{feedback.explanation}</p>
          <Pressable tone={feedback.ok ? "mint" : "rose"} className="mt-3 w-full" onClick={continueLesson}>
            {state.hearts <= 0 && !feedback.ok && !practice ? "Get hearts" : "Continue"}
          </Pressable>
        </div>
      )}
    </div>
  );
}
