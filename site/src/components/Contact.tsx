import { site } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export function Contact() {
  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="contact"
          label="Contact"
          title="Get in touch"
          description="Open to junior and mid-level engineering roles in Europe and Tunisia."
        />

        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-8 sm:p-12">
          <p className="max-w-xl text-xl text-zinc-300">
            Based in Bizerte, Tunisia — currently on exchange in Germany. Reach
            out for opportunities, collaborations, or a conversation about your
            team.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex rounded-full bg-emerald-500 px-6 py-3.5 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Email me
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex rounded-full border border-zinc-700 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:border-zinc-500"
            >
              {site.phone}
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-zinc-700 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:border-zinc-500"
            >
              LinkedIn
            </a>
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-zinc-700 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:border-zinc-500"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
