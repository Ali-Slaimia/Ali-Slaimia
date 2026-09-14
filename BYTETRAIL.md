# ByteTrail

**Duolingo for developers.** Short lessons, a skill tree, hearts, XP, streaks, leagues, and a mistake pile — for JavaScript, Python, TypeScript, SQL, Git, and React.

Pip (the fox) keeps it moving. Progress lives in the browser (`localStorage`). No account, no backend, no API keys.

## Run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

```bash
npm test
npm run lint
npm run build
```

## What it demonstrates

- Product UX: onboarding, daily goal, locked/unlocked path, lesson loop, retry, practice queue
- Typed domain model: exercises, submissions, progress reducer, badge rules
- Deterministic helpers: local-date streaks (not UTC), seeded shuffles, weekly league board
- Static export (`next build` → `out/`) so it can ship on GitHub Pages or Netlify

## Flow

1. Set a name + daily XP goal
2. Walk the trail (first lesson of every unit is open; later lessons unlock in order)
3. Answer with tap-tiles, multiple choice, fill-in, or “spot the buggy line”
4. Hearts drop on misses; a flawless clear grants a **bit**
5. Review slips under **Practice**; climb **Leagues**; collect **Profile** badges

Keyboard: `1–4` pick a choice, `Enter` checks / continues.

## Stack

Next.js (App Router) · TypeScript · React · Tailwind CSS v4 · Vitest

## Architecture

| Path | Role |
| --- | --- |
| `content/` | Lesson catalog (data, not UI) |
| `lib/scoring.ts` | Answer checking + XP |
| `lib/progress.ts` | Reducer for XP, streaks, mistakes, badges |
| `lib/streak.ts` | Local calendar dates |
| `components/LessonPlayer.tsx` | Lesson state machine |
| `lib/store.tsx` | Persistence |

## CV blurb

**ByteTrail** — Duolingo-style coding trainer: skill-tree lessons, streaks/XP, and a typed answer engine for JS, Python, TypeScript, SQL, Git, and React (Next.js, local progress, Vitest).

## Author

**[Ali Slaimia](https://github.com/Ali-Slaimia)** — sole author and maintainer.
