"use client";

import { useState } from "react";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import ImageGallery from "@/components/Shared/ImageGallery";
import { Meta } from "@/components/Shared/brand/Hud";
import PhaseTrack, { PhaseBadge } from "@/components/Shared/PhaseTrack";
import {
  RETAINER_PHASE_LABELS,
  TERMINAL_PHASE,
  type RetainerPhase,
} from "@/lib/constants/retainer-phases";

export interface PortalUpdate {
  id: string;
  phase: string;
  title: string;
  body: string | null;
  images: string[];
  videoEmbedUrl: string | null;
  createdAt: Date;
}

export interface PortalProject {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  updatedAt: Date;
  updates: PortalUpdate[];
}

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Newest activity on a project: its latest update, or failing that its own
 *  last edit. Used to decide which one opens by default. */
function lastActivity(project: PortalProject): number {
  const newestUpdate = project.updates.reduce((latest, update) => {
    const time = new Date(update.createdAt).getTime();
    return time > latest ? time : latest;
  }, 0);
  return Math.max(newestUpdate, new Date(project.updatedAt).getTime());
}

/**
 * The client's project list, collapsed by default.
 *
 * A retainer with six live projects was rendering six full timelines stacked
 * on one page -- every storyboard, every frame grab, all at once. Finding the
 * one you care about meant scrolling past everything you did not.
 *
 * So: everything starts closed except the most recently active project, which
 * is almost always the reason the client opened the link. The collapsed header
 * still carries the name, the phase and the progress track, so the summary
 * never costs a click; only the heavy media is behind one.
 */
export default function RetainerProjectAccordion({
  projects,
  muted = false,
}: {
  projects: PortalProject[];
  muted?: boolean;
}) {
  const mostRecentId = projects.length
    ? projects.reduce((a, b) => (lastActivity(b) > lastActivity(a) ? b : a)).id
    : null;

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    // Delivered work is reference material, not news -- it opens on request.
    if (muted || !mostRecentId) return new Set();
    return new Set([mostRecentId]);
  });

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allOpen = openIds.size === projects.length;

  return (
    <div>
      {projects.length > 1 && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setOpenIds(allOpen ? new Set() : new Set(projects.map((project) => project.id)))
            }
            className="rounded-pill border border-ink/12 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45 transition-colors duration-200 ease-out hover:border-ink/30 hover:text-ink"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project) => {
          const open = openIds.has(project.id);
          const panelId = `project-panel-${project.id}`;
          const count = project.updates.length;

          return (
            <article
              key={project.id}
              className={`overflow-hidden rounded-[1.75rem] border border-ink/10 bg-frame transition-colors duration-300 ease-out ${
                muted ? "opacity-70" : ""
              }`}
            >
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(project.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full items-start gap-4 p-6 text-left transition-colors duration-200 ease-out hover:bg-ink/[0.02] md:p-8"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
                        {project.name}
                      </span>
                      <PhaseBadge phase={project.phase} />
                    </span>

                    {project.description && (
                      <span className="mt-2 block max-w-lg text-sm leading-relaxed text-ink/45">
                        {project.description}
                      </span>
                    )}

                    {/* The summary a collapsed row has to earn its place with:
                        where it is, and how much there is to read. */}
                    <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <PhaseTrack phase={project.phase} compact />
                      <Meta className="text-ink/30">
                        {count === 0
                          ? "No updates yet"
                          : `${count} ${count === 1 ? "update" : "updates"}`}
                      </Meta>
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink/45 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
              </h2>

              {/* grid-template-rows 0fr -> 1fr is the one way to transition to
                  a height nobody has measured. Kept mounted so the panel can
                  animate shut as well as open, and inert while closed so its
                  links stay out of the tab order. */}
              <div
                id={panelId}
                inert={!open}
                className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <div className="border-t border-ink/10 px-6 pb-8 pt-7 md:px-8">
                    <Meta className="mb-5 block text-ink/30">Pipeline</Meta>
                    <PhaseTrack phase={project.phase} />

                    {count > 0 && (
                      <div className="mt-9 border-t border-ink/10 pt-7">
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
                                  {RETAINER_PHASE_LABELS[update.phase as RetainerPhase] ??
                                    update.phase}
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
                                <div className="mt-4">
                                  <ImageGallery
                                    images={update.images}
                                    altPrefix={`${update.title} — image`}
                                    // Boards and frame grabs are wide. A square
                                    // crop threw away the sides of every frame
                                    // and magnified what was left, which is what
                                    // made these read as low quality.
                                    fit="contain"
                                    aspect="video"
                                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 33vw, 50vw"
                                    allowOriginal
                                  />
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {count === 0 && (
                      <p className="mt-8 text-sm text-ink/35">
                        {project.phase === TERMINAL_PHASE
                          ? "Delivered."
                          : "No updates posted on this one yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
