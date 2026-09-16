// Plain runtime constants, not a "use server" module: these are imported by
// the Drizzle schema, by client components, and by the public portal, and a
// "use server" file may only export async functions.

/**
 * The production pipeline a retainer project moves through.
 *
 * Ordered, and the order is load-bearing -- the portal renders it as a track
 * and works out how far along a project is from the index of its current
 * phase. Adding a phase in the middle re-grades every project's progress, so
 * append rather than insert unless that is what you mean.
 *
 * "delivered" is the terminal state. It is not a production phase Miracle
 * works in; it exists so a finished project has somewhere to land, rather
 * than sitting on "rendering" forever.
 */
export const RETAINER_PHASES = [
  "scripting",
  "storyboarding",
  "editing",
  "compositing",
  "sfx_voiceover",
  "color",
  "rendering",
  "delivered",
] as const;

export type RetainerPhase = (typeof RETAINER_PHASES)[number];

export const RETAINER_PHASE_LABELS: Record<RetainerPhase, string> = {
  scripting: "Scripting",
  storyboarding: "Storyboarding",
  editing: "Editing",
  compositing: "Compositing",
  sfx_voiceover: "SFX & voiceover",
  color: "Color correcting",
  rendering: "Rendering",
  delivered: "Delivered",
};

/** Phases that mean work is finished, used to style the track's end. */
export const TERMINAL_PHASE: RetainerPhase = "delivered";

export function phaseIndex(phase: string): number {
  const index = RETAINER_PHASES.indexOf(phase as RetainerPhase);
  return index === -1 ? 0 : index;
}

/** 0-1, for progress bars. "delivered" is 1; "scripting" is not 0, because a
 *  project that has started is not zero progress. */
export function phaseProgress(phase: string): number {
  return (phaseIndex(phase) + 1) / RETAINER_PHASES.length;
}

export const RETAINER_STATUSES = ["active", "paused", "ended"] as const;
export type RetainerStatus = (typeof RETAINER_STATUSES)[number];

export const RETAINER_STATUS_LABELS: Record<RetainerStatus, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};
