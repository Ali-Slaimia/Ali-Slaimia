# Looply

**Duolingo for developers** — daily syntax drills, streaks, hearts, XP, and a winding skill path across JavaScript, TypeScript, Python, React, and SQL.

> Muscle memory for code. Five minutes a day, not another 40-hour course tab you’ll never reopen.

## Why this exists

Most “learn to code” products dump a video or a sandbox on you. Looply copies the thing Duolingo got right: **tiny questions, instant feedback, a reason to come back tomorrow**.

Questions are interview-shaped on purpose — `typeof null`, `===` vs `==`, React keys, SQL joins — so a recruiter can finish a lesson and actually learn something.

## Features

- Onboarding: name, daily XP goal, starting track
- Skill path with locked / current / completed nodes and unit treasure chests
- Exercise types: multiple choice, fill-the-blank, output prediction, typed answers, order-the-code
- Hearts, combo XP, perfect-lesson bonus, gems
- Daily goal + streak (with optional streak freeze)
- Weekly league board
- Heart-free practice queue built from misses
- Shop (refills, freeze, double XP, Loopy cosmetics)
- Achievements
- Progress saved in `localStorage` — no account required

## Stack

Next.js (App Router) · TypeScript · React 19 · Tailwind CSS v4 · Vitest

Game rules live in a pure reducer (`src/lib/game.ts`) so streaks, hearts, leagues, and scoring can be unit-tested without a browser.

## Run

```bash
cd looply
npm install
npm test
npm run dev
```

Open **http://localhost:3000**

```bash
npm run build
```

## Architecture

| Path | What it is |
| --- | --- |
| `src/lib/game.ts` | Pure state machine: XP, streaks, hearts, shop, achievements |
| `src/lib/curriculum/` | Track content (JS / TS / Python / React / SQL) |
| `src/lib/store.tsx` | React context + `localStorage` persistence |
| `src/components/` | Path, lesson player, mascot, 3D pressable buttons |
| `src/app/` | Routes: learn, lesson, practice, league, shop, profile |

## CV blurb

**Looply — Duolingo for code** · Personal project  
Next.js · TypeScript · React · Tailwind · Vitest

- Designed a gamified learning product with streaks, hearts, XP, leagues, and a winding skill path modeled on language-learning apps.
- Authored a typed curriculum and five exercise engines (MCQ, fill-in, output, typed answer, code ordering) across JS, TS, Python, React, and SQL.
- Isolated all progress rules in a pure reducer with Vitest coverage for streaks, freezes, weekly resets, and shop purchases.
- Persisted progress client-side so the demo runs anywhere without a backend.

## Author

**[Ali Slaimia](https://github.com/Ali-Slaimia)** — sole author and maintainer.
