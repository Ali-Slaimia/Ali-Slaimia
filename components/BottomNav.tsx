"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDumbbell, IconHome, IconMedal, IconUser } from "./Icons";

const items = [
  { href: "/", label: "Learn", icon: IconHome, match: (p: string) => p === "/" },
  { href: "/practice/", label: "Practice", icon: IconDumbbell, match: (p: string) => p.startsWith("/practice") },
  { href: "/leagues/", label: "Leagues", icon: IconMedal, match: (p: string) => p.startsWith("/leagues") },
  { href: "/profile/", label: "Profile", icon: IconUser, match: (p: string) => p.startsWith("/profile") },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={active ? "nav-item active" : "nav-item"}>
            <Icon active={active} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
