"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/", label: "Learn", icon: "🗺️" },
  { href: "/practice", label: "Practice", icon: "🎯" },
  { href: "/leaderboard", label: "League", icon: "🏆" },
  { href: "/shop", label: "Shop", icon: "💎" },
  { href: "/profile", label: "Profile", icon: "🧍" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white/95 px-1 py-2 backdrop-blur">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-extrabold uppercase",
              active ? "text-mint-dark" : "text-muted",
            )}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
