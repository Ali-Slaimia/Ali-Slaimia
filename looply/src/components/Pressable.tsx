import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Tone = "mint" | "sky" | "snow" | "gold" | "rose" | "ink";

const tones: Record<Tone, string> = {
  mint: "bg-mint border-mint-dark text-[#07342c]",
  sky: "bg-sky border-[#1d56c4] text-white",
  snow: "bg-white border-[#cfd8e3] text-ink",
  gold: "bg-gold border-[#d19a12] text-[#3b2a00]",
  rose: "bg-heart border-[#d63a5a] text-white",
  ink: "bg-ink border-[#111827] text-white",
};

export function Pressable({
  tone = "mint",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      className={cn(
        "pressable rounded-2xl px-4 py-3.5 text-sm font-extrabold uppercase tracking-wide",
        "transition-[transform,border-width] duration-75 disabled:pointer-events-none disabled:opacity-40",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
