import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ExpandableText from "@/components/Shared/ExpandableText";
import JsonLd from "@/components/Shared/JsonLd";
import Footer from "@/components/Home/Footer/Footer";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { FrameTicks, Meta, Tally } from "@/components/Shared/brand/Hud";
import { getDevProjectBySlug, getDevProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ projectID: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectID } = await params;
  const project = await getDevProjectBySlug(projectID);

  if (!project) {
    return { title: "Project not found | Okata Studios" };
  }

  const title = `${project.name} | Okata Studios`;
  const description = project.subhead || project.description;
  const url = `https://www.okata-miracle.site/build/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: project.technology,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: project.image }],
    },
    alternates: { canonical: url },
  };
}

export default async function ProjectDisplayPage({ params }: Props) {
  const { projectID } = await params;
  // One query resolves the project and the two neighbours the footer
  // navigation needs, rather than three separate reads.
  const projects = await getDevProjects();
  const index = projects.findIndex((entry) => entry.slug === projectID);
  const project = index === -1 ? null : projects[index];

  if (!project) {
    return (
      <>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-32 text-center">
          <OkataRing className="h-16 w-16 opacity-60" />
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold tracking-tight text-ink">
            No such build
          </h1>
          <p className="max-w-sm text-ink/50">
            That project either moved or never shipped.
          </p>
          <Link
            href="/build/projects"
            className="rounded-pill bg-accent-build px-6 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
          >
            See every project
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Wraps at both ends, so neither link is ever dead.
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const hasNeighbours = projects.length > 1;

  const shots = [project.image, project.image2, project.image3].filter(
    (img): img is string => Boolean(img)
  );

  const facts = [
    { label: "Client", value: project.client },
    { label: "Type", value: project.type },
    { label: "Date", value: project.date },
  ].filter((fact) => Boolean(fact.value));

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.subhead || project.description,
    image: project.image,
    keywords: project.technology.join(", "),
    creator: {
      "@type": "Person",
      name: "Okata Miracle",
      url: "https://www.okata-miracle.site",
    },
    url: `https://www.okata-miracle.site/build/projects/${project.slug}`,
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />

      <header className="okata-stage relative overflow-hidden px-6 pb-14 pt-36 md:px-12 md:pb-20 md:pt-48">
        <OkataRing className="okata-ring-drift pointer-events-none absolute -right-48 -top-32 h-[34rem] w-[34rem] opacity-[0.055]" />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/40">
            <Link
              href="/build/projects"
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
              <span>{project.name}</span>
            </span>
          </h1>

          {project.subhead && (
            <p
              className="okata-rise mt-7 max-w-2xl text-lg leading-relaxed text-ink/60"
              style={{ animationDelay: "300ms" }}
            >
              {project.subhead}
            </p>
          )}

          <div
            className="okata-rise mt-10 grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-12"
            style={{ animationDelay: "360ms" }}
          >
            <dl className="grid grid-cols-2 gap-6 md:col-span-6 md:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>
                    <Meta className="text-ink/35">{fact.label}</Meta>
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="md:col-span-6 md:pl-8">
              <Meta className="text-ink/35">Built with</Meta>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.technology.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-pill border border-accent-build/25 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-accent-build"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {project.link && (
            <div className="okata-rise mt-10" style={{ animationDelay: "420ms" }}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-pill bg-accent-build py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                <span>Visit the live site</span>
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
              </a>
            </div>
          )}
        </div>
      </header>

      <main>
        {shots.length > 0 && (
          <section className="px-4 pb-20 md:px-8 md:pb-28">
            <div className="mx-auto max-w-[96rem] space-y-5">
              {shots.map((shot, i) => (
                <div
                  key={`${shot}-${i}`}
                  className="rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 md:p-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:aspect-[16/9] md:rounded-[calc(2rem-0.5rem)]">
                    <Image
                      src={shot}
                      alt={`${project.name} screenshot ${i + 1}`}
                      fill
                      sizes="100vw"
                      quality={75}
                      priority={i === 0}
                      className="object-cover"
                    />
                    <FrameTicks className="m-5" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 md:px-7 md:py-5">
                      <Meta className="text-ink/35">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(shots.length).padStart(2, "0")}
                      </Meta>
                      <Meta className="text-ink/35">Screen</Meta>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-6 pb-20 md:px-12 md:pb-28">
          <div className="mx-auto max-w-[84rem]">
            <Meta className="mb-8 block text-ink/35">The build</Meta>
            <div className="max-w-3xl">
              <ExpandableText
                text={project.description}
                className="text-lg leading-relaxed text-ink/60"
                linkClassName="text-accent-build"
              />
            </div>
          </div>
        </section>

        {hasNeighbours && (
          <nav
            aria-label="More projects"
            className="border-t border-ink/10 px-6 py-14 md:px-12 md:py-20"
          >
            <div className="mx-auto grid max-w-[84rem] gap-4 md:grid-cols-2">
              {[
                { entry: previous, label: "Previous", align: "" },
                { entry: next, label: "Next", align: "md:items-end md:text-right" },
              ].map(({ entry, label, align }) => (
                <Link
                  key={label}
                  href={`/build/projects/${entry.slug}`}
                  className={`group flex flex-col gap-2 rounded-[1.5rem] border border-ink/10 bg-frame/40 p-7 transition-colors duration-300 ease-out hover:border-ink/25 ${align}`}
                >
                  <Meta className="text-ink/35">{label}</Meta>
                  <span className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink transition-colors duration-200 ease-out group-hover:text-ink/75 md:text-3xl">
                    {entry.name}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        )}

        <section className="px-6 pb-24 md:px-12 md:pb-32">
          <div className="mx-auto flex max-w-[84rem] flex-col items-center gap-6 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-14 text-center">
            <Tally tone="accent" className="text-ink/45">
              Open for work
            </Tally>
            <p className="max-w-lg font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[0.95] tracking-tight text-ink">
              Want something like this, for yours?
            </p>
            <Link
              href="/build#contact"
              className="group inline-flex items-center gap-2 rounded-pill bg-accent-build py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
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

      <Footer />
    </>
  );
}
