"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { shuffle, cn } from "@/lib/cn";
import { Pressable } from "./Pressable";

export function QuestionCard({
  exercise,
  seed,
  disabled,
  onSubmit,
}: {
  exercise: Exercise;
  seed: string;
  disabled?: boolean;
  onSubmit: (value: string | string[]) => void;
}) {
  const shuffledOptions = useMemo(
    () => (exercise.options ? shuffle(exercise.options, seed) : []),
    [exercise.options, seed],
  );
  const shuffledPieces = useMemo(
    () => (exercise.pieces ? shuffle(exercise.pieces, seed) : []),
    [exercise.pieces, seed],
  );
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const leftover = shuffledPieces.filter((piece) => !order.includes(piece));

  function submitCurrent() {
    if (exercise.type === "type") onSubmit(typed);
    else if (exercise.type === "order") onSubmit(order);
    else onSubmit(selected);
  }

  const canCheck =
    exercise.type === "type"
      ? typed.trim().length > 0
      : exercise.type === "order"
        ? order.length === (exercise.pieces?.length ?? 0)
        : selected.length > 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-black leading-tight">{exercise.prompt}</h1>
      {exercise.code && (
        <pre className="overflow-x-auto rounded-2xl bg-[#163027] p-4 text-sm leading-6 text-[#d7fff2]">
          <code>{exercise.code}</code>
        </pre>
      )}

      {(exercise.type === "mcq" || exercise.type === "output" || exercise.type === "fill") && (
        <div className="grid gap-3">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(option)}
              className={cn(
                "rounded-2xl border-[3px] border-b-4 px-4 py-3 text-left font-bold",
                selected === option ? "border-sky bg-[#ebf3ff] text-sky" : "border-line bg-white",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {exercise.type === "type" && (
        <input
          value={typed}
          disabled={disabled}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canCheck) submitCurrent();
          }}
          placeholder="Type the answer"
          className="rounded-2xl border-2 border-b-4 border-line bg-white px-4 py-3 font-mono text-lg outline-none focus:border-sky"
        />
      )}

      {exercise.type === "order" && (
        <div className="grid gap-3">
          <div className="min-h-[88px] rounded-2xl border-2 border-dashed border-line bg-white p-3">
            {order.length === 0 && <p className="text-sm font-bold text-muted">Tap blocks in the right order.</p>}
            <div className="flex flex-wrap gap-2">
              {order.map((piece, index) => (
                <button
                  key={`${piece}-${index}`}
                  type="button"
                  className="rounded-xl bg-[#163027] px-3 py-2 font-mono text-xs text-[#d7fff2]"
                  onClick={() => setOrder((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  {piece}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {leftover.map((piece) => (
              <button
                key={piece}
                type="button"
                disabled={disabled}
                onClick={() => setOrder((current) => [...current, piece])}
                className="rounded-xl border-2 border-b-4 border-line bg-white px-3 py-2 font-mono text-xs font-bold"
              >
                {piece}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <Pressable tone="sky" className="w-full" disabled={!canCheck || disabled} onClick={submitCurrent}>
          Check
        </Pressable>
      </div>
    </div>
  );
}
