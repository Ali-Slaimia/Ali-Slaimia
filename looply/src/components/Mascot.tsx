import type { MascotLook } from "@/lib/types";

type Mood = "idle" | "happy" | "sad" | "think" | "celebrate";

export function Mascot({
  mood = "idle",
  look = "classic",
  className = "w-36 h-36",
}: {
  mood?: Mood;
  look?: MascotLook;
  className?: string;
}) {
  const eye = mood === "sad" ? 8 : 5;
  const smile = mood === "sad" ? "M78 108 Q92 100 106 108" : "M78 104 Q92 118 106 104";
  return (
    <svg viewBox="0 0 200 180" className={`${className} ${mood === "celebrate" ? "bob" : "bob"}`} aria-hidden>
      <ellipse cx="108" cy="158" rx="42" ry="8" fill="#1d33401a" />
      <path
        d="M128 118 C168 96 186 128 154 148 C176 132 164 92 130 108"
        fill="none"
        stroke="#0f9b7c"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <ellipse cx="108" cy="112" rx="46" ry="36" fill="#19c8a0" />
      <ellipse cx="100" cy="118" rx="28" ry="20" fill="#d9fff3" />
      <circle cx="92" cy="78" r="28" fill="#19c8a0" />
      <circle cx="82" cy="74" r="12" fill="#fff" />
      <circle cx="84" cy="76" r={eye} fill="#1d3340" />
      {mood !== "sad" && <circle cx="87" cy="73" r="3" fill="#fff" />}
      <path d={smile} fill="none" stroke="#0f9b7c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="66" cy="84" r="5" fill="#ff8aa0" />
      <path d="M70 70 C62 58 74 50 80 60" fill="none" stroke="#0f9b7c" strokeWidth="6" strokeLinecap="round" />
      <circle cx="118" cy="102" r="5" fill="#0f9b7c" />
      <circle cx="132" cy="118" r="4" fill="#0f9b7c" />
      <ellipse cx="86" cy="142" rx="8" ry="6" fill="#129478" />
      <ellipse cx="122" cy="142" rx="8" ry="6" fill="#129478" />
      {look === "shades" && (
        <g>
          <rect x="70" y="68" width="28" height="12" rx="4" fill="#1d3340" />
          <rect x="98" y="70" width="8" height="3" fill="#1d3340" />
        </g>
      )}
      {look === "crown" && (
        <path d="M74 52 L82 66 L92 52 L102 66 L110 52 L108 70 L76 70 Z" fill="#ffc83d" stroke="#d19a12" />
      )}
    </svg>
  );
}
