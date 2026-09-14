"use client";

import { useState } from "react";
import { TRACKS } from "@/lib/curriculum";
import type { DailyGoal } from "@/lib/types";
import { useGame } from "@/lib/store";
import { Mascot } from "./Mascot";
import { Pressable } from "./Pressable";

const GOALS: DailyGoal[] = [10, 20, 30];

export function Onboarding() {
  const { dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Ali");
  const [trackId, setTrackId] = useState("javascript");
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(20);

  return (
    <div className="phone-shell mx-auto flex min-h-dvh w-full max-w-[430px] flex-col rounded-[28px] px-6 py-8 sm:my-6 sm:min-h-[min(100dvh,920px)]">
      <div className="mb-4 flex justify-center gap-1.5 pt-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={`h-2.5 rounded-full ${item === step ? "w-7 bg-mint" : "w-2.5 bg-line"}`}
          />
        ))}
      </div>
      <Mascot mood={step === 4 ? "celebrate" : "happy"} className="mx-auto h-40 w-40" />
      {step === 0 && (
        <Copy
          title="I'm Loopy."
          body="Daily coding drills, the way language apps drill vocabulary — except the vocabulary is syntax, APIs, and interview gotchas."
        />
      )}
      {step === 1 && (
        <>
          <Copy title="Pick a path." body="You can switch tracks later. JavaScript is the best on-ramp." />
          <div className="mt-4 grid gap-3">
            {TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setTrackId(track.id)}
                className={`rounded-2xl border-[3px] border-b-4 px-4 py-3 text-left ${
                  trackId === track.id ? "border-[#14342c] bg-[#e8fff8]" : "border-line bg-white"
                }`}
              >
                <p className="font-black">
                  {track.icon} {track.title}
                </p>
                <p className="text-sm text-muted">{track.tagline}</p>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <Copy title="Daily XP goal." body="Small and daily beats heroic and never. You can change this on your profile." />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setDailyGoal(goal)}
                className={`rounded-2xl border-[3px] border-b-4 py-6 font-black ${
                  dailyGoal === goal ? "border-[#c48512] bg-[#fff6d9]" : "border-line bg-white"
                }`}
              >
                {goal}
                <span className="block text-[10px] uppercase text-muted">XP</span>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <Copy title="What should I call you?" body="This shows up on the weekly league board." />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-4 rounded-2xl border-[3px] border-b-4 border-line bg-white px-4 py-3 text-lg font-bold outline-none focus:border-mint"
          />
        </>
      )}
      {step === 4 && (
        <Copy
          title={`${name.trim() || "Loopster"}, your streak starts now.`}
          body="Hearts refill every day. Miss a day and a freeze can save the streak. Let's ship the first lesson."
        />
      )}
      <Pressable
        className="shine mt-auto"
        onClick={() => {
          if (step < 4) {
            setStep((current) => current + 1);
            return;
          }
          dispatch({
            type: "ONBOARD",
            name,
            trackId,
            dailyGoal,
            now: Date.now(),
          });
        }}
      >
        {step === 4 ? "Start learning" : "Continue"}
      </Pressable>
    </div>
  );
}

function Copy({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-2">
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="mt-3 text-base font-semibold leading-relaxed text-muted">{body}</p>
    </div>
  );
}
