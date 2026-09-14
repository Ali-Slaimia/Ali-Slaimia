import { experience } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export function Experience() {
  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="experience"
          label="Experience"
          title="Work experience"
          description="Internships across AI product development, mobile, and full-stack web."
        />

        <ol className="relative space-y-10 border-l border-zinc-800 pl-8">
          {experience.map((job) => (
            <li key={`${job.company}-${job.period}`} className="relative">
              <span
                className="absolute top-1.5 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-zinc-950"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-semibold text-zinc-100">
                  {job.role}
                </h3>
                <span className="font-mono text-base text-zinc-500">
                  {job.period}
                </span>
              </div>
              <p className="mt-0.5 text-emerald-400/90">{job.company}</p>
              <p className="mt-0.5 text-base text-zinc-500">{job.location}</p>
              <ul className="mt-4 space-y-2 text-lg text-zinc-400">
                {job.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 32)} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
