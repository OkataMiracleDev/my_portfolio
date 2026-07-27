import type { MotionProjectContent } from "@/types/content";

// Placeholder case studies — swap in real reels before launch. Thumbnails
// use the codebase's existing /images/null-project.jpg placeholder
// convention (see data/data.ts) rather than any real client's imagery.
// videoEmbedUrl is left undefined until a real reel is embedded; the case
// study page shows a "coming soon" state instead of a broken player.
export const motionProjectsData: MotionProjectContent[] = [
  {
    id: "1",
    slug: "brand-launch-reel",
    title: "Brand Launch Reel",
    description: "Placeholder case study — swap in a real brand animation reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["Brand Animation", "After Effects"],
    href: "/animate/projects/brand-launch-reel",
    tools: ["After Effects", "Illustrator"],
  },
  {
    id: "2",
    slug: "ui-microinteractions",
    title: "UI Micro-interactions",
    description: "Placeholder case study — swap in a real interface motion reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["UI Motion", "Figma", "GSAP"],
    href: "/animate/projects/ui-microinteractions",
    tools: ["Figma", "GSAP", "Principle"],
  },
  {
    id: "3",
    slug: "social-explainer",
    title: "Social Explainer",
    description: "Placeholder case study — swap in a real short-form explainer reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["Explainer", "Premiere Pro"],
    href: "/animate/projects/social-explainer",
    tools: ["Premiere Pro", "After Effects"],
  },
];
