import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRetainerByShareToken } from "@/lib/actions/retainers";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import PhaseTrack, { PhaseBadge } from "@/components/Shared/PhaseTrack";
import {
  RETAINER_PHASE_LABELS,
  RETAINER_STATUS_LABELS,
  TERMINAL_PHASE,
  type RetainerPhase,
  type RetainerStatus,
} from "@/lib/constants/retainer-phases";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retainer portal | Okata Studios",
  // Unguessable token, but that is not a reason to let a crawler index it.
  robots: { index: false, follow: false },
};

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function RetainerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getRetainerByShareToken(token);

  if (!data) notFound();
  const { client, projects } = data;

  const live = projects.filter((project) => project.phase !== TERMINAL_PHASE);
  const delivered = projects.filter((project) => project.phase === TERMINAL_PHASE);

  return (
    <div className="okata-grain min-h-screen bg-base px-6 pb-28 pt-12 font-[family-name:var(--font-general-sans)] text-ink md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-ink/10 pb-10">
          <div className="mb-12 flex items-center gap-2.5">
            <OkataRing className="h-7 w-7 shrink-0" />
            <span className="font-[family-name:var(--font-cabinet-grotesk)] text-[1rem] font-bold leading-none tracking-tight text-ink">
              Okata<span className="text-accent-animate">studios</span>
            </span>
          </div>

          <Meta className="mb-4 block text-ink/35">
            Retainer &mdash; {RETAINER_STATUS_LABELS[client.status as RetainerStatus]}
          </Meta>
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[0.92] tracking-[-0.03em] text-ink">
            {client.name}
          </h1>
          {client.company && <p className="mt-3 text-ink/50">{client.company}</p>}

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/45">
            Everything currently in production, and where each piece has got to. This page updates
            as the work moves &mdash; no need to ask.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="mt-16 text-ink/40">
            Nothing in production yet. This page will fill up as projects start.
          </p>
        ) : (
          <>
            <ProjectList projects={live} heading="In production" />
            {delivered.length > 0 && (
              <ProjectList projects={delivered} heading="Delivered" muted />
            )}
          </>
        )}

        <footer className="mt-24 border-t border-ink/10 pt-8">
          <Meta className="text-ink/25">
            Okata Studios &middot; {new Date().getFullYear()} &middot; private link
          </Meta>
        </footer>
      </div>
    </div>
  );
}

// The action returns `... | null`, so the null has to be stripped before
// indexing into it -- a bare conditional against the union collapses to never.
type PortalData = NonNullable<Awaited<ReturnType<typeof getRetainerByShareToken>>>;
type PortalProject = PortalData["projects"][number];

function ProjectList({
  projects,
  heading,
  muted = false,
}: {
  projects: PortalProject[];
  heading: string;
  muted?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="mt-16">
      <Meta className="mb-6 flex items-center gap-3 text-ink/35">
        <span>{heading}</span>
        <span aria-hidden="true" className="h-px w-10 bg-ink/15" />
        <span>{String(projects.length).padStart(2, "0")}</span>
      </Meta>

      <div className="space-y-5">
        {projects.map((project) => (
          <article
            key={project.id}
            className={`rounded-[1.75rem] border border-ink/10 bg-frame p-6 md:p-8 ${
              muted ? "opacity-70" : ""
            }`}
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/45">
                    {project.description}
                  </p>
                )}
              </div>
              <PhaseBadge phase={project.phase} />
            </div>

            <PhaseTrack phase={project.phase} />

            {project.updates.length > 0 && (
              <div className="mt-8 border-t border-ink/10 pt-7">
                <Meta className="mb-6 block text-ink/30">Progress</Meta>

                <ol className="space-y-9 border-l border-ink/10 pl-7">
                  {project.updates.map((update) => (
                    <li key={update.id} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[2.05rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-animate ring-4 ring-frame"
                      />

                      <div className="mb-2 flex flex-wrap items-center gap-2.5">
                        <Meta className="text-accent-animate">
                          {RETAINER_PHASE_LABELS[update.phase as RetainerPhase] ?? update.phase}
                        </Meta>
                        <Meta className="text-ink/25">{formatDate(update.createdAt)}</Meta>
                      </div>

                      <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold leading-tight text-ink">
                        {update.title}
                      </h3>

                      {update.body && (
                        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-ink/55">
                          {update.body}
                        </p>
                      )}

                      {update.videoEmbedUrl && (
                        <div
                          className="relative mt-4 w-full overflow-hidden rounded-xl bg-stage"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <VideoEmbed
                            embedUrl={update.videoEmbedUrl}
                            title={update.title}
                            poster={update.images[0]}
                          />
                        </div>
                      )}

                      {update.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {update.images.map((url, i) => (
                            <div
                              key={`${url}-${i}`}
                              className="relative aspect-square overflow-hidden rounded-xl bg-stage"
                            >
                              <Image
                                src={url}
                                alt=""
                                fill
                                sizes="(min-width: 640px) 200px, 45vw"
                                quality={75}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
