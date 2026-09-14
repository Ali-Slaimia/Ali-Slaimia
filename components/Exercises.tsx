"use client";

import { useMemo } from "react";
import type { BlankExercise, BugExercise, Exercise, McqExercise, OrderExercise, OutputExercise, Submission } from "@/lib/types";
import { seededShuffle } from "@/lib/shuffle";

type Props = {
  exercise: Exercise;
  value: Submission | null;
  onChange: (value: Submission) => void;
  locked: boolean;
};

export function ExerciseCard({ exercise, value, onChange, locked }: Props) {
  switch (exercise.type) {
    case "mcq":
    case "output":
      return <ChoiceList exercise={exercise} value={value} onChange={onChange} locked={locked} />;
    case "order":
      return <OrderBank exercise={exercise} value={value} onChange={onChange} locked={locked} />;
    case "blank":
      return <BlankPick exercise={exercise} value={value} onChange={onChange} locked={locked} />;
    case "bug":
      return <BugLines exercise={exercise} value={value} onChange={onChange} locked={locked} />;
  }
}

function ChoiceList({
  exercise,
  value,
  onChange,
  locked,
}: {
  exercise: McqExercise | OutputExercise;
  value: Submission | null;
  onChange: (value: Submission) => void;
  locked: boolean;
}) {
  const selected = value?.kind === "index" ? value.index : -1;
  return (
    <div className="choices">
      {exercise.code ? <CodeBlock code={exercise.code} /> : null}
      {exercise.choices.map((choice, index) => (
        <button
          key={`${index}-${choice}`}
          className={selected === index ? "choice selected" : "choice"}
          disabled={locked}
          onClick={() => onChange({ kind: "index", index })}
        >
          <span className="choice-key">{index + 1}</span>
          <span>{choice}</span>
        </button>
      ))}
    </div>
  );
}

function OrderBank({
  exercise,
  value,
  onChange,
  locked,
}: {
  exercise: OrderExercise;
  value: Submission | null;
  onChange: (value: Submission) => void;
  locked: boolean;
}) {
  const shuffled = useMemo(
    () => seededShuffle(exercise.tokens.map((token, i) => ({ token, i })), exercise.id),
    [exercise.id, exercise.tokens],
  );
  const placed = value?.kind === "tokens" ? value.tokens : [];
  const used = new Map<string, number>();
  for (const token of placed) used.set(token, (used.get(token) ?? 0) + 1);

  const remaining = shuffled.filter(({ token }) => {
    const count = used.get(token) ?? 0;
    if (count <= 0) return true;
    used.set(token, count - 1);
    return false;
  });

  return (
    <div>
      {exercise.code ? <CodeBlock code={exercise.code} /> : null}
      <div className="answer-tray" aria-label="Your answer">
        {placed.length === 0 ? <span className="tray-hint">Tap tiles to build the line</span> : null}
        {placed.map((token, index) => (
          <button
            key={`${token}-${index}`}
            className="chip on"
            disabled={locked}
            onClick={() => onChange({ kind: "tokens", tokens: placed.filter((_, i) => i !== index) })}
          >
            {token}
          </button>
        ))}
      </div>
      <div className="bank">
        {remaining.map(({ token, i }) => (
          <button
            key={`${token}-${i}`}
            className="chip"
            disabled={locked}
            onClick={() => onChange({ kind: "tokens", tokens: [...placed, token] })}
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlankPick({
  exercise,
  value,
  onChange,
  locked,
}: {
  exercise: BlankExercise;
  value: Submission | null;
  onChange: (value: Submission) => void;
  locked: boolean;
}) {
  const selected = value?.kind === "text" ? value.value : "";
  const filled = exercise.code
    ? exercise.code.replace("___", selected || "____")
    : selected || "____";
  return (
    <div>
      {exercise.code ? <CodeBlock code={filled} highlight={selected || "____"} /> : null}
      <div className="bank">
        {exercise.choices.map((choice) => (
          <button
            key={choice}
            className={selected === choice ? "chip on" : "chip"}
            disabled={locked}
            onClick={() => onChange({ kind: "text", value: choice })}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

function BugLines({
  exercise,
  value,
  onChange,
  locked,
}: {
  exercise: BugExercise;
  value: Submission | null;
  onChange: (value: Submission) => void;
  locked: boolean;
}) {
  const selected = value?.kind === "index" ? value.index : -1;
  return (
    <div className="bug-list">
      {exercise.lines.map((line, index) => (
        <button
          key={`${index}-${line}`}
          className={selected === index ? "bug-line selected" : "bug-line"}
          disabled={locked}
          onClick={() => onChange({ kind: "index", index })}
        >
          <span className="ln">{index + 1}</span>
          <code>{line}</code>
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ code, highlight }: { code: string; highlight?: string }) {
  const escaped = escapeHtml(code);
  const mark = highlight ? escapeHtml(highlight) : "";
  const html = mark ? escaped.replaceAll(mark, `<mark>${mark}</mark>`) : escaped;
  return <pre className="code" dangerouslySetInnerHTML={{ __html: html.replaceAll("\n", "<br/>") }} />;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

