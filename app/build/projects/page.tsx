import type { Metadata } from "next";
import Link from "next/link";
import WorkCard from "@/components/Shared/WorkCard";
import Footer from "@/components/Home/Footer/Footer";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta, Tally } from "@/components/Shared/brand/Hud";
import { getDevProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dev Projects | Okata Studios — React & Next.js Portfolio",
  description:
    "Frontend development case studies by Okata Studios — real client and product work built with React, Next.js, TypeScript, and Tailwind CSS.",
  openGraph: {
    title: "Dev Projects | Okata Studios",
    description:
      "Frontend development case studies built with React, Next.js, TypeScript, and Tailwind CSS.",
    url: "https://www.okata-miracle.site/build/projects",
    siteName: "Okata Studios",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/build/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getDevProjects();

  return (
    <>
      <header className="okata-stage relative overflow-hidden px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
        <OkataRing className="okata-ring-drift pointer-events-none absolute -right-40 -top-24 h-[30rem] w-[30rem] opacity-[0.06]" />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex items-center gap-3 text-ink/40">
            <span>Archive</span>
            <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
            <span>{String(projects.length).padStart(2, "0")} builds</span>
          </Meta>

          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.86] tracking-[-0.035em] text-ink">
            <span className="okata-line">
              <span>Everything</span>
            </span>
            <span className="okata-line">
              <span style={{ animationDelay: "90ms" }}>
                shipped<span className="text-signal">.</span>
              </span>
            </span>
          </h1>

          <p
            className="okata-rise mt-8 max-w-lg text-lg leading-relaxed text-ink/55"
            style={{ animationDelay: "380ms" }}
          >
            Client and product work. Each one opens into what it was, what it
            was built with, and what it actually does.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24 md:px-12 md:pb-36">
        <div className="mx-auto max-w-[84rem]">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-24 text-center">
              <OkataRing className="h-14 w-14 opacity-60" />
              <p className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink">
                Nothing published yet
              </p>
              <Link
                href="/build#contact"
                className="mt-2 rounded-pill bg-accent-build px-6 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                Get in touch
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <li key={project.id}>
                  <WorkCard
                    href={`/build/projects/${project.slug}`}
                    image={project.image}
                    title={project.name}
                    description={project.description}
                    index={i}
                    eyebrow={project.type ?? "Case study"}
                    tags={project.technology}
                    accent="build"
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-16 flex flex-col items-center gap-6 border-t border-ink/10 pt-12 sm:flex-row sm:justify-between">
            <Tally tone="accent" className="text-ink/45">
              Open for work
            </Tally>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/build"
                className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
              >
                Back to index
              </Link>
              <Link
                href="/build#contact"
                className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
