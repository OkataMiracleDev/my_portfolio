// next-sitemap's config is loaded by plain Node (not Next's own build
// pipeline), which can't resolve this project's "@/..." TS path aliases or
// reliably transpile TypeScript across Node versions. So these slugs are
// duplicated here rather than imported from data/motion-projects.ts and
// data/resources.ts — keep both lists in sync when adding/removing entries.
const motionProjectSlugs = [
  "brand-launch-reel",
  "ui-microinteractions",
  "social-explainer",
];

const resourceSlugs = [
  "starter-lut-pack",
  "breaking-down-a-brand-reel",
  "tools-i-use",
];

module.exports = {
  siteUrl: 'https://www.okata-miracle.site',
  generateRobotsTxt: true,
  additionalPaths: async () => [
    ...motionProjectSlugs.map((slug) => ({
      loc: `/animate/projects/${slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })),
    ...resourceSlugs.map((slug) => ({
      loc: `/animate/resources/${slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ],
};
