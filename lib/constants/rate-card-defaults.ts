/**
 * The /animate/rates content as it was hardcoded before the page became
 * database-backed, kept verbatim.
 *
 * Two jobs:
 *
 * 1. Seed source for `scripts/seed-rate-page.ts`, so a fresh database starts
 *    with the page that was already live rather than nothing.
 * 2. Per-section fallback in `lib/data/public.ts`. Each section falls back
 *    independently, so emptying (say) the add-ons table in admin does not
 *    take the retainer tiers down with it — and a section that has never been
 *    seeded still renders. The trade-off is that a section cannot be
 *    deliberately emptied to hide it; deleting every row shows these again.
 *    Hiding a whole section is a layout change, not a content change, so it
 *    stays a code edit.
 */

export type RetainerTierDefault = {
  code: string;
  name: string;
  tagline: string;
  monthly: number;
  features: string[];
  featured: boolean;
};

export type ServiceDefault = {
  timecode: string;
  title: string;
  description: string;
  price: string;
  unit: string;
};

export type AddonDefault = { name: string; value: string };

export const DEFAULT_RETAINER_TIERS: RetainerTierDefault[] = [
  {
    code: "R01",
    name: "Starter",
    tagline: "For brands shipping a handful of things each month.",
    monthly: 800,
    featured: false,
    features: [
      "2–3 short deliverables per month",
      "2 revision rounds per deliverable",
      "5–10 business-day turnaround",
      "Email support, next-day replies",
    ],
  },
  {
    code: "R02",
    name: "Growth",
    tagline: "The steady-stream setup most teams settle on.",
    monthly: 1500,
    featured: true,
    features: [
      "4–6 deliverables per month",
      "3 revision rounds per deliverable",
      "Priority 3–5 day turnaround",
      "Shared Slack channel",
      "Editable source files included",
    ],
  },
  {
    code: "R03",
    name: "Studio",
    tagline: "Reserved capacity — effectively an in-house motion team.",
    monthly: 2500,
    featured: false,
    features: [
      "Reserved weekly capacity",
      "Unlimited revision rounds",
      "48–72 hour turnaround",
      "Direct line + weekly sync call",
      "Source files + motion-system docs",
    ],
  },
];

export const DEFAULT_SERVICES: ServiceDefault[] = [
  {
    timecode: "00:00:01:00",
    title: "Brand Animation",
    description: "Logo reveals, brand intros/outros, motion identity systems.",
    price: "$300 – $800",
    unit: "Per deliverable",
  },
  {
    timecode: "00:00:02:00",
    title: "UI Micro-interactions",
    description: "Button states, transitions, loading sequences — priced per interaction set.",
    price: "$250 – $600",
    unit: "Per interaction set",
  },
  {
    timecode: "00:00:03:00",
    title: "Social & Explainer",
    description: "Short-form video and explainer content, kinetic typography, up to 60–90 sec.",
    price: "$400 – $1,000",
    unit: "Per video",
  },
];

export const DEFAULT_ADDONS: AddonDefault[] = [
  { name: "Rush delivery (under 5 business days)", value: "+25%" },
  { name: "Extra revision round (beyond included)", value: "$150 / round" },
  { name: "Source file handoff (.aep, raw assets)", value: "$100" },
  { name: "Voiceover / TTS integration", value: "$150" },
];

export const DEFAULT_TERMS: string[] = [
  "50% deposit to start, balance due on final delivery.",
  "2 rounds of revisions included per project — additional rounds billed as add-ons.",
  "Project timelines confirmed after the scoping call, typically 5–10 business days depending on scope.",
  "Retainer clients get priority scheduling over new project inquiries.",
  "Usage rights: final files are for the agreed use case (social, web, ads, etc.) — broader licensing available on request.",
];
