type Mood = "idle" | "cheer" | "think" | "oops";

export function Pip({ mood = "idle", size = 88 }: { mood?: Mood; size?: number }) {
  const brow =
    mood === "oops" ? -18 : mood === "think" ? -8 : mood === "cheer" ? -4 : -6;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={mood === "cheer" ? "pip-bounce" : mood === "oops" ? "pip-shake" : ""}
    >
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <path d="M22 52 L38 18 L54 44 Z" fill="#f27a3a" />
      <path d="M98 52 L82 18 L66 44 Z" fill="#f27a3a" />
      <path d="M28 46 L38 24 L50 44 Z" fill="#ffd6bf" />
      <path d="M92 46 L82 24 L70 44 Z" fill="#ffd6bf" />
      <ellipse cx="60" cy="64" rx="36" ry="34" fill="#f27a3a" />
      <ellipse cx="60" cy="74" rx="24" ry="20" fill="#ffd6bf" />
      <ellipse cx="46" cy="58" rx="7" ry="8" fill="#1a1423" />
      <ellipse cx="74" cy="58" rx="7" ry="8" fill="#1a1423" />
      <ellipse cx="48" cy="56" rx="2.2" ry="2.4" fill="#fff" />
      <ellipse cx="76" cy="56" rx="2.2" ry="2.4" fill="#fff" />
      <path d={`M36 46 q10 ${brow} 20 0`} stroke="#1a1423" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M64 46 q10 ${brow} 20 0`} stroke="#1a1423" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="74" rx="7" ry="5" fill="#1a1423" />
      <path
        d={mood === "oops" ? "M52 88 q8 -6 16 0" : "M50 86 q10 10 20 0"}
        stroke="#1a1423"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="44" cy="78" r="5" fill="#ff8aa0" opacity="0.7" />
      <circle cx="76" cy="78" r="5" fill="#ff8aa0" opacity="0.7" />
    </svg>
  );
}
