export interface FunFactCard {
  id: string;
  label: string;
  value: string;
}

// Placeholder copy — personalize before shipping. Keep it to 3-4 cards
// (spec §9): this is a teaser, not a full personality dump.
export const funFactCards: FunFactCard[] = [
  { id: "building", label: "Currently building", value: "This very site" },
  { id: "editing", label: "Currently editing", value: "A motion reel for a client brand" },
  { id: "based", label: "Based in", value: "Lagos, Nigeria" },
  { id: "status", label: "Status", value: "Open to new work" },
];

export interface RouteChoice {
  id: "build" | "animate";
  title: string;
  description: string;
  href: string;
  accent: "build" | "animate";
}

export const routeChoices: RouteChoice[] = [
  {
    id: "build",
    title: "Build",
    description:
      "Frontend development — Next.js, React, and interfaces built to convert.",
    href: "/build",
    accent: "build",
  },
  {
    id: "animate",
    title: "Animate",
    description:
      "Motion design — brand animation, UI micro-interactions, and free resources.",
    href: "/animate",
    accent: "animate",
  },
];
