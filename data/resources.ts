import type { ResourceContent } from "@/types/content";

// Placeholder resources — replace with real downloads/tutorials/tool links
// before launch. Downloads are free and instant (no email gate). Entries
// with no fileUrl/externalUrl render a "coming soon" state rather than a
// dead link.
export const resourcesData: ResourceContent[] = [
  {
    id: "1",
    slug: "starter-lut-pack",
    type: "download",
    title: "Starter LUT Pack",
    description: "A small set of color-grading LUTs. Placeholder — real download file not uploaded yet.",
    tags: ["LUTs", "Color Grading"],
    publishedAt: "2026-07-13",
  },
  {
    id: "2",
    slug: "breaking-down-a-brand-reel",
    type: "tutorial",
    title: "Breaking Down a Brand Reel",
    description: "A short process writeup. Placeholder — replace with real tutorial content.",
    tags: ["Process", "Brand Animation"],
    publishedAt: "2026-07-13",
  },
  {
    id: "3",
    slug: "tools-i-use",
    type: "tool-link",
    title: "Tools I Use",
    description: "A curated list of plugins and tools. Placeholder — replace with real recommendations.",
    externalUrl: "https://www.aescripts.com/",
    tags: ["Tools"],
    publishedAt: "2026-07-13",
  },
];
