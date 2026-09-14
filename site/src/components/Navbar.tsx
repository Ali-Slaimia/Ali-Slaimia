"use client";

import { useState } from "react";
import { navLinks, site } from "@/data/portfolio";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-mono text-base font-medium text-zinc-100 transition hover:text-emerald-400"
        >
          {site.brand.split(".")[0]}
          <span className="text-emerald-400">.</span>
          {site.brand.split(".")[1]}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-base text-zinc-400 transition hover:text-zinc-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/Ali-Slaimia/"
          className="hidden rounded-full border border-emerald-500/40 px-4 py-2.5 text-base font-medium text-emerald-300 transition hover:bg-emerald-500/10 md:inline-flex"
        >
          Play Looply
        </a>
        <a
          href="#contact"
          className="hidden rounded-full bg-emerald-500 px-4 py-2.5 text-base font-medium text-zinc-950 transition hover:bg-emerald-400 md:inline-flex"
        >
          Contact
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open ? (
        <MobileMenu onNavigate={() => setOpen(false)} />
      ) : null}
    </header>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 md:hidden">
      <ul className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-lg text-zinc-300"
              onClick={onNavigate}
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="/Ali-Slaimia/"
            className="text-lg text-emerald-300"
            onClick={onNavigate}
          >
            Play Looply
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950"
            onClick={onNavigate}
          >
            Contact
          </a>
        </li>
      </ul>
    </div>
  );
}
