type SectionHeadingProps = {
  id: string;
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  id,
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header id={id} className="mb-12 max-w-2xl">
      <p className="mb-2 font-mono text-base tracking-widest text-emerald-400 uppercase">
        {label}
      </p>
      <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-xl leading-relaxed text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}
