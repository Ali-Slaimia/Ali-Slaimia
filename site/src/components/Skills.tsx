import { skills } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export function Skills() {
  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="skills"
          label="Skills"
          title="Technical skills"
          description="Full-stack, mobile, and AI integration — aligned with my CV."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <h3 className="mb-4 font-mono text-base tracking-wide text-emerald-400 uppercase">
                {group.category}
              </h3>
              <ul className="space-y-2 text-lg">
                {group.items.map((item) => (
                  <li key={item} className="text-zinc-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
