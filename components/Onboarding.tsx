"use client";

import { useState } from "react";
import { Pip } from "./Pip";
import { useProgress } from "@/lib/store";
import type { DailyGoal } from "@/lib/types";

const goals: Array<{ value: DailyGoal; label: string; hint: string }> = [
  { value: 10, label: "Casual", hint: "10 XP · ~5 min" },
  { value: 20, label: "Regular", hint: "20 XP · a coffee" },
  { value: 30, label: "Serious", hint: "30 XP · interview mode" },
];

export function Onboarding() {
  const { onboard } = useProgress();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<DailyGoal>(20);

  return (
    <div className="onboard" role="dialog" aria-label="Welcome to ByteTrail">
      <div className="onboard-card">
        {step === 0 ? (
          <>
            <Pip mood="cheer" size={120} />
            <p className="eyebrow">ByteTrail</p>
            <h1>Get fluent in code, five minutes a day.</h1>
            <p className="lede">
              Pip runs a Duolingo-style trail for JavaScript, Python, TypeScript, SQL, Git, and React.
              Short drills. Instant feedback. A streak you will not want to break.
            </p>
            <button className="btn primary" onClick={() => setStep(1)}>
              Start the trail
            </button>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Pip mood="think" size={96} />
            <h1>What should Pip call you?</h1>
            <input
              className="text-input"
              value={name}
              placeholder="Your name"
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button className="btn primary" onClick={() => setStep(2)}>
              Continue
            </button>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Pip mood="idle" size={96} />
            <h1>Daily goal</h1>
            <p className="lede">You can change this later. Recruiters never will, but you can.</p>
            <div className="goal-grid">
              {goals.map((item) => (
                <button
                  key={item.value}
                  className={goal === item.value ? "goal-card selected" : "goal-card"}
                  onClick={() => setGoal(item.value)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </button>
              ))}
            </div>
            <button className="btn primary" onClick={() => onboard(name, goal)}>
              Let&apos;s go
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
