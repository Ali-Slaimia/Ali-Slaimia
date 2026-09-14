"use client";

import { IconBolt, IconFlame, IconGem } from "@/components/Icons";
import { SkillTree } from "@/components/SkillTree";
import { useProgress } from "@/lib/store";

export function HomeScreen() {
  const { state } = useProgress();
  const goalPct = Math.min(100, Math.round((state.dailyXp / state.dailyGoal) * 100));

  return (
    <div className="screen">
      <header className="topbar">
        <div className="brand">
          <span className="logo-mark sm">Bt</span>
          <div>
            <p className="eyebrow">ByteTrail</p>
            <strong>{state.displayName}</strong>
          </div>
        </div>
        <div className="pills">
          <span className="pill fire">
            <IconFlame /> {state.streak}
          </span>
          <span className="pill xp">
            <IconBolt /> {state.xp}
          </span>
          <span className="pill gem">
            <IconGem /> {state.bits}
          </span>
        </div>
      </header>

      <section className="goal-strip">
        <div className="goal-copy">
          <p className="eyebrow">Daily goal</p>
          <strong>
            {state.dailyXp} / {state.dailyGoal} XP
          </strong>
        </div>
        <div className="goal-bar" aria-label="Daily XP progress">
          <span style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      <SkillTree />
    </div>
  );
}
