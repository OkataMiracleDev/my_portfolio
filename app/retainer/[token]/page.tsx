import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRetainerByShareToken } from "@/lib/actions/retainers";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import RetainerProjectAccordion, {
  type PortalProject,
} from "@/components/Portal/RetainerProjectAccordion";
import {
  RETAINER_STATUS_LABELS,
  TERMINAL_PHASE,
  type RetainerStatus,
} from "@/lib/constants/retainer-phases";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retainer portal | Okata Studios",
  // Unguessable token, but that is not a reason to let a crawler index it.
  robots: { index: false, follow: false },
};

export default async function RetainerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getRetainerByShareToken(token);

  if (!data) notFound();
  const { client, projects } = data;

  const live: PortalProject[] = projects.filter((project) => project.phase !== TERMINAL_PHASE);
  const delivered: PortalProject[] = projects.filter((project) => project.phase === TERMINAL_PHASE);

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
            Everything currently in production, and where each piece has got to. Open a project to
            read its progress &mdash; images open full screen. This page updates as the work moves.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="mt-16 text-ink/40">
            Nothing in production yet. This page will fill up as projects start.
          </p>
        ) : (
          <>
            {live.length > 0 && (
              <section className="mt-16">
                <SectionHeading label="In production" count={live.length} />
                <RetainerProjectAccordion projects={live} />
              </section>
            )}

            {delivered.length > 0 && (
              <section className="mt-16">
                <SectionHeading label="Delivered" count={delivered.length} />
                {/* Delivered work starts fully collapsed -- it is reference
                    material, not the reason anyone opened the link. */}
                <RetainerProjectAccordion projects={delivered} muted />
              </section>
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

function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <Meta className="mb-6 flex items-center gap-3 text-ink/35">
      <span>{label}</span>
      <span aria-hidden="true" className="h-px w-10 bg-ink/15" />
      <span>{String(count).padStart(2, "0")}</span>
    </Meta>
  );
}
