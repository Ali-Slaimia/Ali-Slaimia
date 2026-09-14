import {
  certifications,
  education,
  languages,
} from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export function Education() {
  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          id="education"
          label="Education"
          title="Education & credentials"
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 font-mono text-base tracking-wide text-emerald-400 uppercase">
              Degrees
            </h3>
            <ul className="space-y-8">
              {education.map((item) => (
                <li
                  key={`${item.school}-${item.period}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-lg font-semibold text-zinc-100">
                      {item.degree}
                    </h4>
                    <span className="font-mono text-base text-zinc-500">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-emerald-400/90">{item.school}</p>
                  <p className="mt-0.5 text-base text-zinc-500">{item.location}</p>
                  {item.details ? (
                    <p className="mt-3 text-base leading-relaxed text-zinc-400">
                      {item.details}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-mono text-base tracking-wide text-emerald-400 uppercase">
                Certifications
              </h3>
              <ul className="space-y-4">
                {certifications.map((cert) => (
                  <li
                    key={cert.credentialId}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4"
                  >
                    <p className="text-lg font-medium text-zinc-100">{cert.name}</p>
                    <p className="mt-0.5 text-base text-zinc-500">{cert.issuer}</p>
                    <p className="mt-1 font-mono text-sm text-zinc-600">
                      ID: {cert.credentialId}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-base tracking-wide text-emerald-400 uppercase">
                Languages
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-center"
                  >
                    <span className="text-lg font-medium text-zinc-200">
                      {lang.name}
                    </span>
                    <span className="mt-1.5 text-base leading-snug text-zinc-500">
                      {lang.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
