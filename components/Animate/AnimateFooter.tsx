import Link from "next/link";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";

const COLUMNS = [
  {
    heading: "Animate",
    links: [
      { label: "Index", href: "/animate" },
      { label: "Work", href: "/animate/projects" },
      { label: "Resources", href: "/animate/resources" },
      { label: "Rate card", href: "/animate/rates" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "All modes", href: "/" },
      { label: "Dev work", href: "/build" },
      { label: "Leave a testimonial", href: "/animate/testimonial" },
    ],
  },
];

const SOCIALS = [
  { label: "X / Twitter", href: "https://x.com/mimi_codes" },
  { label: "GitHub", href: "https://github.com/OkataMiracleDev" },
];

export default function AnimateFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 px-6 pb-10 pt-16 md:px-12 md:pt-20">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <OkataRing
                className="h-8 w-8 shrink-0"
              />
              <span className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold tracking-tight text-ink">
                Okata<span className="text-accent-animate">studios</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/45">
              Motion design and frontend, out of Lagos. Built on intention, not
              decoration.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="md:col-span-2">
              <Meta className="mb-5 block text-ink/30">{column.heading}</Meta>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/60 transition-colors duration-200 ease-out hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-3">
            <Meta className="mb-5 block text-ink/30">Find me</Meta>
            <ul className="space-y-3">
              {SOCIALS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors duration-200 ease-out hover:text-ink"
                  >
                    <span>{social.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-ink/25 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px"
                    >
                      &#8599;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* End slate. */}
        <div className="mt-16 flex flex-col gap-4 border-t border-ink/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <Meta className="text-ink/30">
            &copy; {year} Okata Studios &mdash; all rights reserved
          </Meta>
          <Meta className="text-ink/20">End of reel</Meta>
        </div>
      </div>
    </footer>
  );
}
