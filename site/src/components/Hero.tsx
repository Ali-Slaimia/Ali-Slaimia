import { site } from "@/data/portfolio";

export function Hero() {
  const initials = site.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <GridBackground />
      <GlowOverlay />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-5 py-2 text-base text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {site.availability}
        </div>

        <h1 className="animate-fade-up animate-delay-1 max-w-3xl text-5xl font-semibold tracking-tight text-zinc-50 sm:text-7xl sm:leading-[1.1]">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
            {site.name}
          </span>
          <span className="mt-2 block text-3xl text-zinc-400 sm:text-4xl">
            {site.title}
          </span>
          <span className="mt-1 block text-xl font-normal text-zinc-500 sm:text-2xl">
            {site.subtitle}
          </span>
        </h1>

        <p className="animate-fade-up animate-delay-2 mt-6 max-w-2xl text-xl leading-relaxed text-zinc-400 sm:text-2xl">
          {site.tagline}
        </p>

        <div className="animate-fade-up animate-delay-3 mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://ali-slaimia.github.io/Ali-Slaimia/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Play Looply
            <ArrowIcon />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            View projects
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Get in touch
          </a>
        </div>

        <ProfileRow initials={initials} />
      </div>
    </section>
  );
}

function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid-bg opacity-40"
      aria-hidden
    />
  );
}

function GlowOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 glow opacity-60"
      aria-hidden
    />
  );
}

function ProfileRow({ initials }: { initials: string }) {
  return (
    <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-end gap-6">
        <Avatar initials={initials} />
        <div>
          <p className="text-base text-zinc-500">{site.location}</p>
          <div className="mt-2 flex flex-wrap gap-4">
            <SocialLink href={site.social.github} label="GitHub" />
            <SocialLink href={site.social.linkedin} label="LinkedIn" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-base text-zinc-400 sm:text-right">
        <a
          href={`mailto:${site.email}`}
          className="transition hover:text-emerald-400"
        >
          {site.email}
        </a>
        <a href={site.phoneHref} className="transition hover:text-emerald-400">
          {site.phone}
        </a>
      </div>
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 font-mono text-2xl font-semibold text-emerald-400"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-base text-zinc-400 underline-offset-4 transition hover:text-emerald-400 hover:underline"
    >
      {label}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
