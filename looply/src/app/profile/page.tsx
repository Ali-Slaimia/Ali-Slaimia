"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { Pressable } from "@/components/Pressable";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { allLessons, TRACKS } from "@/lib/curriculum";
import { formatSaveCode } from "@/lib/save";
import { useGame } from "@/lib/store";

const SOURCE_URL = "https://github.com/Ali-Slaimia/Ali-Slaimia/tree/main/looply";

export default function ProfilePage() {
  const { state, dispatch, cloudStatus, saveCode, restoreWithCode } = useGame();
  const [codeInput, setCodeInput] = useState("");
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const completed = Object.keys(state.completedLessons).length;
  const total = TRACKS.reduce((sum, track) => sum + allLessons(track).length, 0);
  const prettyCode = saveCode ? formatSaveCode(saveCode) : "LOOP-————";
  const statusLabel =
    cloudStatus === "checking"
      ? "Checking this network…"
      : cloudStatus === "synced"
        ? "Saved on this network"
        : cloudStatus === "error"
          ? "Cloud save failed — this browser is still kept"
          : "Saved in this browser";

  return (
    <AppShell>
      <div className="flex flex-col items-center text-center">
        <Mascot look={state.mascot} mood="happy" className="h-32 w-32" />
        <h1 className="text-3xl font-black">{state.displayName || "Loopster"}</h1>
        <p className="font-bold text-muted">
          {state.xp} XP · {state.streak} day streak · {completed}/{total} lessons
        </p>
      </div>

      <section className="mt-6 rounded-3xl border-2 border-line bg-white p-4 text-left">
        <h2 className="text-lg font-black">Cloud save</h2>
        <p className="mt-1 text-sm font-semibold text-muted">{statusLabel}</p>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
          Progress syncs to a hash of this network&apos;s IP — we never store the raw address. Same Wi‑Fi, new browser:
          your path comes back. Campus or café Wi‑Fi is shared, so keep the save code for home vs school.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#e8fff8] px-4 py-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-mint-dark">Save code</p>
            <p className="font-mono text-xl font-black tracking-wide">{prettyCode}</p>
          </div>
          <Pressable
            tone="snow"
            className="shrink-0 px-3 py-2 text-xs"
            type="button"
            onClick={() => {
              if (!saveCode) return;
              void navigator.clipboard.writeText(prettyCode);
              setRestoreMessage("Copied save code");
            }}
          >
            Copy
          </Pressable>
        </div>
        <label className="mt-4 block">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted">Load another code</span>
          <input
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value)}
            placeholder="LOOP-AB2DEF"
            autoCapitalize="characters"
            className="mt-1 w-full rounded-2xl border-2 border-line px-4 py-3 font-mono text-base font-bold uppercase tracking-wide outline-none focus:border-mint"
          />
        </label>
        <Pressable
          tone="sky"
          className="mt-3 w-full"
          type="button"
          disabled={busy || codeInput.trim().length < 6}
          onClick={() => {
            setBusy(true);
            setRestoreMessage(null);
            void restoreWithCode(codeInput).then((ok) => {
              setBusy(false);
              setRestoreMessage(ok ? "Progress restored" : "No save found for that code");
              if (ok) setCodeInput("");
            });
          }}
        >
          {busy ? "Loading…" : "Restore"}
        </Pressable>
        {restoreMessage ? <p className="mt-2 text-sm font-bold text-mint-dark">{restoreMessage}</p> : null}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-black">Achievements</h2>
        <div className="grid gap-2">
          {ACHIEVEMENTS.map((item) => {
            const unlocked = state.achievements.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
                  unlocked ? "border-mint bg-[#e8fff8]" : "border-line bg-white opacity-70"
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-sm font-semibold text-muted">{item.hint}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-2 border-line bg-white p-4">
        <h2 className="text-lg font-black">Source</h2>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-muted">
          Looply is a folder inside Ali&apos;s profile README repo, so GitHub lists it as{" "}
          <span className="font-black text-ink">Ali-Slaimia</span> — not a separate repo named looply. Open that
          repository, then the <span className="font-mono text-sm">looply/</span> folder.
        </p>
        <a
          href={SOURCE_URL}
          className="mt-3 inline-flex font-extrabold text-sky underline decoration-2 underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          Open looply source
        </a>
        <a
          href="https://ali-slaimia.github.io/Ali-Slaimia/portfolio/"
          className="mt-2 inline-flex font-extrabold text-sky underline decoration-2 underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          Ali&apos;s GitHub portfolio
        </a>
      </section>

      <Pressable
        tone="snow"
        className="mt-8 w-full"
        onClick={() => {
          if (window.confirm("Reset Looply on this device and unlink this network? Your old save code can still restore it.")) {
            dispatch({ type: "RESET" });
          }
        }}
      >
        Reset progress
      </Pressable>
    </AppShell>
  );
}
