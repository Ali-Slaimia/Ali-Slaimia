import { about } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export function About() {
  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="about"
          label="About"
          title={about.heading}
          description={about.description}
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-4 text-xl leading-relaxed text-zinc-400">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {about.highlights.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <p className="font-mono text-3xl font-semibold text-emerald-400">
                  {item.value}
                </p>
                <p className="mt-1 text-base text-zinc-500">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
