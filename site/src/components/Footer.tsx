import { site } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/80 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-base text-zinc-500 sm:flex-row">
        <p>
          © {year} {site.name}. Built with Next.js & Tailwind.
        </p>
        <a
          href="#"
          className="transition hover:text-zinc-300"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
