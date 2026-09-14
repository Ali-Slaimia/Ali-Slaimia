"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getLesson, lessonKey, nextLesson } from "@/content/catalog";
import { playComplete, playCorrect, playWrong } from "@/lib/audio";
import { clock } from "@/lib/progress";
import { checkAnswer, expectedAnswer, HEARTS_PER_LESSON, lessonXp } from "@/lib/scoring";
import { nextStreak } from "@/lib/streak";
import { useProgress } from "@/lib/store";
import type { MistakeRef, Submission } from "@/lib/types";
import { ExerciseCard } from "./Exercises";
import { IconHeart } from "./Icons";
import { Pip } from "./Pip";

export function LessonPlayer({ unitId, lessonId }: { unitId: string; lessonId: string }) {
  const found = getLesson(unitId, lessonId);
  const router = useRouter();
  const { state, dispatch } = useProgress();
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(HEARTS_PER_LESSON);
  const [value, setValue] = useState<Submission | null>(null);
  const [phase, setPhase] = useState<"answer" | "feedback" | "done" | "failed">("answer");
  const [ok, setOk] = useState(false);
  const [missed, setMissed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<MistakeRef[]>([]);
  const [quitOpen, setQuitOpen] = useState(false);
  const [awarded, setAwarded] = useState<{ xp: number; bits: number; streak: number } | null>(null);

  const phaseRef = useRef(phase);
  const valueRef = useRef(value);
  const statsRef = useRef({ missed: 0, correctCount: 0, hearts, mistakes: [] as MistakeRef[], ok: false, index: 0 });

  useEffect(() => {
    phaseRef.current = phase;
    valueRef.current = value;
    statsRef.current = { missed, correctCount, hearts, mistakes, ok, index };
  }, [phase, value, missed, correctCount, hearts, mistakes, ok, index]);

  const exercise = found?.lesson.exercises[index];
  const total = found?.lesson.exercises.length ?? 0;
  const bar = total === 0 ? 0 : ((index + (phase === "feedback" ? 1 : 0)) / total) * 100;
  const upcoming = nextLesson(unitId, lessonId);

  function finishWith(finalMissed: number, finalCorrect: number, refs: MistakeRef[]) {
    if (!found) return;
    const xp = lessonXp(found.lesson.xp, finalCorrect, total, finalMissed);
    const key = lessonKey(unitId, lessonId);
    const firstPerfect = finalMissed === 0 && !state.completed[key]?.perfect;
    const tick = clock();
    dispatch({ type: "ADD_MISTAKES", refs });
    dispatch({
      type: "COMPLETE_LESSON",
      key,
      missed: finalMissed,
      xp,
      ...tick,
    });
    setAwarded({
      xp,
      bits: firstPerfect ? 1 : 0,
      streak: nextStreak(state.streak, state.lastActiveDate, tick.today, tick.yesterday).streak,
    });
    setPhase("done");
    if (state.sound) playComplete();
  }

  function check() {
    if (!exercise || !valueRef.current || phaseRef.current !== "answer") return;
    const correct = checkAnswer(exercise, valueRef.current);
    setOk(correct);
    setPhase("feedback");
    if (state.sound) {
      if (correct) playCorrect();
      else playWrong();
    }
    if (correct) {
      setCorrectCount((n) => n + 1);
      statsRef.current.correctCount += 1;
      statsRef.current.ok = true;
    } else {
      const nextHearts = statsRef.current.hearts - 1;
      setHearts(nextHearts);
      setMissed((n) => n + 1);
      const refs = [...statsRef.current.mistakes, { unitId, lessonId, exerciseId: exercise.id }];
      setMistakes(refs);
      statsRef.current = {
        ...statsRef.current,
        hearts: nextHearts,
        missed: statsRef.current.missed + 1,
        mistakes: refs,
        ok: false,
      };
    }
  }

  function cont() {
    if (!found || !exercise) return;
    const snap = statsRef.current;
    if (!snap.ok && snap.hearts <= 0) {
      setPhase("failed");
      return;
    }
    if (snap.index + 1 >= total) {
      finishWith(snap.missed, snap.correctCount, snap.mistakes);
      return;
    }
    setIndex((n) => n + 1);
    statsRef.current.index += 1;
    setValue(null);
    setPhase("answer");
  }

  function retry() {
    setIndex(0);
    setHearts(HEARTS_PER_LESSON);
    setValue(null);
    setPhase("answer");
    setOk(false);
    setMissed(0);
    setCorrectCount(0);
    setMistakes([]);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (event.key === "Enter") {
        event.preventDefault();
        if (phaseRef.current === "answer") check();
        else if (phaseRef.current === "feedback") cont();
      }
      if (phaseRef.current !== "answer" || !exercise) return;
      const num = Number(event.key);
      if (exercise.type === "mcq" || exercise.type === "output") {
        if (num >= 1 && num <= exercise.choices.length) setValue({ kind: "index", index: num - 1 });
      }
      if (exercise.type === "bug" && num >= 1 && num <= exercise.lines.length) {
        setValue({ kind: "index", index: num - 1 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listener reads refs
  }, [exercise]);

  if (!found) {
    return (
      <div className="lesson-page empty">
        <Pip mood="oops" />
        <p>This lesson wandered off the trail.</p>
        <Link href="/" className="btn primary">
          Back
        </Link>
      </div>
    );
  }

  if (phase === "done" && awarded) {
    return (
      <div className="complete">
        <div className="confetti" aria-hidden />
        <Pip mood="cheer" size={128} />
        <h1>Lesson complete</h1>
        <p className="lede">{found.lesson.title}</p>
        <div className="stat-row">
          <div className="stat-card">
            <strong>+{awarded.xp}</strong>
            <span>XP</span>
          </div>
          <div className="stat-card">
            <strong>{awarded.streak}</strong>
            <span>Streak</span>
          </div>
          <div className="stat-card">
            <strong>{awarded.bits ? `+${awarded.bits}` : "—"}</strong>
            <span>Bits</span>
          </div>
        </div>
        {missed === 0 ? (
          <p className="perfect-tag">Flawless run</p>
        ) : (
          <p className="lede">
            {missed} miss{missed === 1 ? "" : "es"} — review them in Practice.
          </p>
        )}
        <div className="complete-actions">
          {upcoming ? (
            <Link className="btn primary" href={`/learn/${upcoming.unitId}/${upcoming.lessonId}/`}>
              Next lesson
            </Link>
          ) : null}
          <button className="btn ghost" onClick={() => router.push("/")}>
            Back to trail
          </button>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="complete">
        <Pip mood="oops" size={120} />
        <h1>Out of hearts</h1>
        <p className="lede">Hearts refill at the start of every lesson. Try again while it is fresh.</p>
        <button className="btn primary" onClick={retry}>
          Retry lesson
        </button>
        <button className="btn ghost" onClick={() => router.push("/")}>
          Leave
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <header className="lesson-top">
        <button className="icon-btn" onClick={() => setQuitOpen(true)} aria-label="Close lesson">
          ×
        </button>
        <div className="xp-track" aria-label="Lesson progress">
          <span style={{ width: `${bar}%` }} />
        </div>
        <div className="hearts" aria-label={`${hearts} hearts left`}>
          {Array.from({ length: HEARTS_PER_LESSON }, (_, i) => (
            <span key={i} className={i < hearts ? "heart on" : "heart"}>
              <IconHeart />
            </span>
          ))}
        </div>
      </header>

      <div className="prompt-row">
        <Pip mood={phase === "feedback" ? (ok ? "cheer" : "oops") : "think"} size={72} />
        <div>
          <p className="eyebrow">
            {found.unit.title} · {index + 1}/{total}
          </p>
          <h1>{exercise?.prompt}</h1>
        </div>
      </div>

      {exercise ? (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          value={value}
          onChange={setValue}
          locked={phase !== "answer"}
        />
      ) : null}

      <div className="lesson-cta">
        {phase === "answer" ? (
          <button className="btn primary" disabled={!value} onClick={check}>
            Check
          </button>
        ) : (
          <div className={`feedback ${ok ? "good" : "bad"}`}>
            <div>
              <strong>{ok ? "Nice!" : "Not quite"}</strong>
              <p>
                {ok
                  ? exercise?.explanation
                  : `Answer: ${exercise ? expectedAnswer(exercise) : ""}. ${exercise?.explanation}`}
              </p>
            </div>
            <button className="btn primary" onClick={cont}>
              Continue
            </button>
          </div>
        )}
      </div>

      {quitOpen ? (
        <div className="modal" role="dialog" aria-label="Quit lesson">
          <div className="modal-card">
            <h2>Leave this lesson?</h2>
            <p>This run is not saved. Hearts refill when you come back.</p>
            <button className="btn danger" onClick={() => router.push("/")}>
              Quit
            </button>
            <button className="btn ghost" onClick={() => setQuitOpen(false)}>
              Keep going
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
