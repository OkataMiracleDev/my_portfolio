import type { Metadata } from "next";
import Link from "next/link";
import MotionProjectCard from "@/components/Animate/MotionProjectCard";
import AnimateFooter from "@/components/Animate/AnimateFooter";
import OkataRing from "@/components/Animate/brand/OkataRing";
import { Meta, Tally } from "@/components/Animate/brand/Hud";
import { getMotionProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motion Projects | Okata Studios — Motion Design Case Studies",
  description:
    "Motion design case studies — brand animation, UI micro-interactions, and short-form video.",
  openGraph: {
    title: "Motion Projects | Okata Studios",
    description:
      "Motion design case studies — brand animation, UI micro-interactions, and short-form video.",
    url: "https://www.okata-miracle.site/animate/projects",
    siteName: "Okata Studios",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate/projects",
  },
};

export default async function AnimateProjectsPage() {
  const motionProjects = await getMotionProjects();

  return (
    <>
      <header className="okata-stage relative overflow-hidden px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
        <OkataRing
          className="okata-ring-drift pointer-events-none absolute -right-40 -top-24 h-[30rem] w-[30rem] opacity-[0.06]"
          ringColor="var(--color-ink)"
          strokeWidth={7}
        />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex items-center gap-3 text-ink/40">
            <span>Archive</span>
            <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
            <span>{String(motionProjects.length).padStart(2, "0")} takes</span>
          </Meta>

          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.86] tracking-[-0.035em] text-ink">
            <span className="okata-line">
              <span>Every frame</span>
            </span>
            <span className="okata-line">
              <span style={{ animationDelay: "90ms" }}>
                so far<span className="text-signal">.</span>
              </span>
            </span>
          </h1>

          <p
            className="okata-rise mt-8 max-w-lg text-lg leading-relaxed text-ink/55"
            style={{ animationDelay: "380ms" }}
          >
            Brand, product, and social work. Each one opens into how it was
            actually built &mdash; the brief, the process, the tools.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24 md:px-12 md:pb-36">
        <div className="mx-auto max-w-[84rem]">
          {motionProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-24 text-center">
              <OkataRing
                className="h-14 w-14 opacity-60"
                ringColor="var(--color-ink)"
                strokeWidth={9}
              />
              <p className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink">
                Nothing published yet
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-ink/45">
                Case studies land here as they clear. In the meantime, the
                fastest way to see the work is to ask.
              </p>
              <Link
                href="/animate#contact"
                className="mt-2 rounded-pill bg-accent-animate px-6 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                Get in touch
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {motionProjects.map((project, i) => (
                <li key={project.id}>
                  <MotionProjectCard project={project} index={i} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-16 flex flex-col items-center gap-6 border-t border-ink/10 pt-12 sm:flex-row sm:justify-between">
            <Tally className="text-ink/45">Open for work</Tally>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/animate"
                className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
              >
                Back to index
              </Link>
              <Link
                href="/animate#contact"
                className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AnimateFooter />
    </>
  );
}
