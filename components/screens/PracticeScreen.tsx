"use client";

import { useMemo, useState } from "react";
import { getExercise } from "@/content/catalog";
import { playCorrect, playWrong } from "@/lib/audio";
import { checkAnswer, expectedAnswer } from "@/lib/scoring";
import { seededShuffle } from "@/lib/shuffle";
import { useProgress } from "@/lib/store";
import type { Exercise, MistakeRef, Submission } from "@/lib/types";
import { ExerciseCard } from "@/components/Exercises";
import { Pip } from "@/components/Pip";

type Card = { ref: MistakeRef; exercise: Exercise };

export function PracticeScreen() {
  const { state, dispatch } = useProgress();
  const deck = useMemo(() => {
    const items = state.mistakes
      .map((ref) => {
        const found = getExercise(ref.unitId, ref.lessonId, ref.exerciseId);
        return found ? { ref, exercise: found.exercise } : null;
      })
      .filter((item): item is Card => Boolean(item));
    return seededShuffle(items, `practice-${items.map((i) => i.ref.exerciseId).join(",")}`);
  }, [state.mistakes]);

  const [cursor, setCursor] = useState(0);
  const [active, setActive] = useState<Card | null>(null);
  const current = active ?? deck[cursor % Math.max(deck.length, 1)] ?? null;
  const [value, setValue] = useState<Submission | null>(null);
  const [phase, setPhase] = useState<"answer" | "feedback">("answer");
  const [ok, setOk] = useState(false);

  if (deck.length === 0 && phase !== "feedback") {
    return (
      <div className="screen empty">
        <Pip mood="cheer" size={120} />
        <h1>No slips to review</h1>
        <p className="lede">
          Missed questions land here. Clear a lesson with a mistake — or stay flawless and let Pip nap.
        </p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="screen empty">
        <Pip mood="cheer" size={120} />
        <h1>No slips to review</h1>
      </div>
    );
  }

  function check() {
    if (!value || !current) return;
    const correct = checkAnswer(current.exercise, value);
    setActive(current);
    setOk(correct);
    setPhase("feedback");
    if (state.sound) {
      if (correct) playCorrect();
      else playWrong();
    }
    if (correct) dispatch({ type: "CLEAR_MISTAKE", ref: current.ref });
  }

  function cont() {
    setActive(null);
    setValue(null);
    setPhase("answer");
    setCursor((n) => n + 1);
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Practice</p>
        <h1>Missed bites</h1>
        <p className="lede">{deck.length} in the pile. Get one right and it drops off.</p>
      </header>
      <p className="eyebrow">{current.exercise.prompt}</p>
      <ExerciseCard
        key={`${current.ref.exerciseId}-${cursor}`}
        exercise={current.exercise}
        value={value}
        onChange={setValue}
        locked={phase === "feedback"}
      />
      {phase === "answer" ? (
        <button className="btn primary" disabled={!value} onClick={check}>
          Check
        </button>
      ) : (
        <div className={`feedback ${ok ? "good" : "bad"}`}>
          <div>
            <strong>{ok ? "Cleared" : "Still slippery"}</strong>
            <p>
              {ok
                ? current.exercise.explanation
                : `Answer: ${expectedAnswer(current.exercise)}. ${current.exercise.explanation}`}
            </p>
          </div>
          <button className="btn primary" onClick={cont}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
