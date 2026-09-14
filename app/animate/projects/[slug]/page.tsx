import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ExpandableText from "@/components/Shared/ExpandableText";
import StoryboardGallery from "@/components/Animate/StoryboardGallery";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import AnimateFooter from "@/components/Animate/AnimateFooter";
import JsonLd from "@/components/Shared/JsonLd";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { FrameTicks, Meta, Tally } from "@/components/Shared/brand/Hud";
import { getMotionProjectBySlug, getMotionProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getMotionProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found | Okata Studios" };
  }

  const title = `${project.title} | Okata Studios`;
  const url = `https://www.okata-miracle.site${project.href}`;

  return {
    title,
    description: project.description,
    keywords: [...project.tags, ...project.tools],
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
      images: [{ url: project.thumbnail }],
    },
    alternates: { canonical: url },
  };
}

export default async function AnimateProjectPage({ params }: Props) {
  const { slug } = await params;
  // One query for the whole list: it resolves the project itself and the two
  // neighbours the footer navigation needs, instead of three separate reads.
  const projects = await getMotionProjects();
  const index = projects.findIndex((entry) => entry.slug === slug);
  const project = index === -1 ? null : projects[index];

  if (!project) {
    return (
      <>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-32 text-center">
          <OkataRing
            className="h-16 w-16 opacity-60"
          />
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold tracking-tight text-ink">
            No such take
          </h1>
          <p className="max-w-sm text-ink/50">
            That project either moved or never shipped.
          </p>
          <Link
            href="/animate/projects"
            className="rounded-pill bg-accent-animate px-6 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
          >
            See every project
          </Link>
        </div>
        <AnimateFooter />
      </>
    );
  }

  // Wraps at both ends, so the two links are never dead.
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const hasNeighbours = projects.length > 1;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.thumbnail,
    keywords: [...project.tags, ...project.tools].join(", "),
    creator: {
      "@type": "Person",
      name: "Okata Miracle",
      url: "https://www.okata-miracle.site",
    },
    url: `https://www.okata-miracle.site${project.href}`,
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />

      <header className="okata-stage relative overflow-hidden px-6 pb-14 pt-36 md:px-12 md:pb-20 md:pt-48">
        <OkataRing
          className="okata-ring-drift pointer-events-none absolute -right-48 -top-32 h-[34rem] w-[34rem] opacity-[0.055]"
        />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/40">
            <Link
              href="/animate/projects"
              className="transition-colors duration-200 ease-out hover:text-ink"
            >
              Archive
            </Link>
            <span aria-hidden="true" className="text-ink/20">
              /
            </span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </Meta>

          <h1 className="max-w-[18ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.86] tracking-[-0.035em] text-ink">
            <span className="okata-line">
              <span>{project.title}</span>
            </span>
          </h1>

          <div
            className="okata-rise mt-10 grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-12"
            style={{ animationDelay: "320ms" }}
          >
            <div className="md:col-span-6">
              <Meta className="mb-3 block text-ink/35">The brief</Meta>
              <ExpandableText
                text={project.description}
                className="text-lg leading-relaxed text-ink/60"
                linkClassName="text-accent-animate"
              />
            </div>

            <dl className="grid grid-cols-2 gap-6 md:col-span-6 md:grid-cols-2 md:pl-8">
              <div>
                <dt>
                  <Meta className="text-ink/35">Discipline</Meta>
                </dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill border border-ink/10 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-ink/50"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>
                  <Meta className="text-ink/35">Built with</Meta>
                </dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-pill border border-accent-animate/25 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-accent-animate"
                    >
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <main>
        {/* The take itself, full width. Same double-bezel frame as the home
            page reel so the two read as one system. */}
        <section className="px-4 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-[96rem]">
            <div className="rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 md:p-2">
              <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:rounded-[calc(2rem-0.5rem)]">
                <div className="relative aspect-[16/9] w-full">
                  {project.videoEmbedUrl ? (
                    <VideoEmbed
                      embedUrl={project.videoEmbedUrl}
                      title={project.title}
                      poster={project.thumbnail}
                    />
                  ) : (
                    <>
                      <Image
                        src={project.thumbnail}
                        alt=""
                        fill
                        sizes="100vw"
                        quality={75}
                        priority
                        className="scale-105 object-cover opacity-30 blur-[2px]"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/70 to-stage/40" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
                        <OkataRing
                          className="okata-ring-drift h-14 w-14 opacity-70"
                        />
                        <p className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold tracking-tight text-ink md:text-3xl">
                          Reel coming soon
                        </p>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 md:px-7 md:py-5">
                        <Tally className="text-signal">Rec</Tally>
                        <Meta className="text-ink/35">16 : 9</Meta>
                      </div>
                      <FrameTicks className="m-5" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {project.processSteps && project.processSteps.length > 0 && (
          <section className="px-6 pb-20 md:px-12 md:pb-28">
            <div className="mx-auto max-w-[84rem]">
              <Meta className="mb-8 block text-ink/35">Process</Meta>
              <h2 className="mb-12 font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
                How it got made<span className="text-signal">.</span>
              </h2>

              <ol className="border-t border-ink/10">
                {project.processSteps.map((step, i) => (
                  <li
                    key={`${step.title}-${i}`}
                    className="grid grid-cols-1 gap-4 border-b border-ink/10 py-9 md:grid-cols-12 md:gap-8 md:py-12"
                  >
                    <Meta className="text-accent-animate md:col-span-2">
                      {`00:00:0${Math.min(i + 1, 9)}:00`}
                    </Meta>
                    <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:col-span-4 md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="max-w-xl leading-relaxed text-ink/55 md:col-span-6">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {project.storyboardImages && project.storyboardImages.length > 0 && (
          <section className="px-6 pb-20 md:px-12 md:pb-28">
            <div className="mx-auto max-w-[84rem]">
              <Meta className="mb-8 block text-ink/35">Storyboard</Meta>
              <StoryboardGallery images={project.storyboardImages} altPrefix={project.title} />
            </div>
          </section>
        )}

        {/* Next / previous. A case study that dead-ends is a case study nobody
            reads two of. */}
        {hasNeighbours && (
          <nav
            aria-label="More projects"
            className="border-t border-ink/10 px-6 py-14 md:px-12 md:py-20"
          >
            <div className="mx-auto grid max-w-[84rem] gap-4 md:grid-cols-2">
              {[
                { project: previous, label: "Previous", align: "" },
                { project: next, label: "Next", align: "md:text-right md:items-end" },
              ].map(({ project: neighbour, label, align }) => (
                <Link
                  key={label}
                  href={neighbour.href}
                  className={`group flex flex-col gap-2 rounded-[1.5rem] border border-ink/10 bg-frame/40 p-7 transition-colors duration-300 ease-out hover:border-ink/25 ${align}`}
                >
                  <Meta className="text-ink/35">{label}</Meta>
                  <span className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink transition-colors duration-200 ease-out group-hover:text-ink/75 md:text-3xl">
                    {neighbour.title}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        )}

        <section className="px-6 pb-24 md:px-12 md:pb-32">
          <div className="mx-auto flex max-w-[84rem] flex-col items-center gap-6 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-14 text-center">
            <Tally className="text-ink/45">Open for work</Tally>
            <p className="max-w-lg font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[0.95] tracking-tight text-ink">
              Want something like this, for yours?
            </p>
            <Link
              href="/animate#contact"
              className="group inline-flex items-center gap-2 rounded-pill bg-accent-animate py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
            >
              <span>Start a project</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </main>

      <AnimateFooter />
    </>
  );
}
