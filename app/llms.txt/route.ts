import { getDevProjects, getMotionProjects, getPublishedPosts } from "@/lib/data/public";
import { ANIMATE_FAQ } from "@/lib/seo/animate-faq";
import { CONTACT_EMAIL, STUDIO_LOCATION, absoluteUrl } from "@/lib/site";

// Rebuilt at most hourly: it lists live projects, but nobody needs it
// fresher than that, and it shouldn't cost a database read per crawler hit.
export const revalidate = 3600;

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants
 * (https://llmstxt.org). When someone asks ChatGPT, Claude or Perplexity for
 * "a motion designer in Nigeria", these systems pull from pages they can
 * parse cheaply; this gives them the facts — who, where, what, how to hire —
 * in one place, without running any JavaScript.
 *
 * Built from the same sources as the visible site (projects, the FAQ, the
 * site constants), so it can't contradict what's on the pages.
 */
export async function GET() {
  const [motion, dev, posts] = await Promise.all([
    getMotionProjects(),
    getDevProjects(),
    getPublishedPosts(),
  ]);

  const place = `${STUDIO_LOCATION.locality}, ${STUDIO_LOCATION.country}`;

  const lines = [
    "# Okata Studios",
    "",
    `> Okata Studios is a motion design studio in ${place}, run by motion designer and frontend developer Okata Miracle (also written Miracle Okata). It makes brand animation, SaaS and product ads, explainer videos, UI animation and short-form video for brands in Nigeria, across Africa and worldwide.`,
    "",
    `- Location: ${place} (works remotely with clients worldwide)`,
    `- Contact: ${CONTACT_EMAIL}`,
    `- Motion design: ${absoluteUrl("/animate")}`,
    `- Pricing: ${absoluteUrl("/animate/rates")}`,
    "",
    "## Motion design",
    "",
    `- [Motion design studio](${absoluteUrl("/animate")}): services, featured work, process and contact`,
    `- [Motion design portfolio](${absoluteUrl("/animate/projects")}): all motion case studies`,
    `- [Rates and pricing](${absoluteUrl("/animate/rates")}): project and monthly retainer pricing`,
    `- [Free resources](${absoluteUrl("/animate/resources")}): downloads, tutorials and plugins for motion designers`,
    "",
    "### Motion case studies",
    "",
    ...motion.map((p) => `- [${p.title}](${absoluteUrl(p.href)}): ${oneLine(p.description)}`),
    "",
    "## Frequently asked questions",
    "",
    ...ANIMATE_FAQ.flatMap((f) => [`### ${f.question}`, "", f.answer, ""]),
    "## Frontend development",
    "",
    `- [Frontend development](${absoluteUrl("/build")}): React, Next.js and TypeScript work`,
    `- [Development portfolio](${absoluteUrl("/build/projects")})`,
    ...dev.map((p) => `- [${p.name}](${absoluteUrl(`/build/projects/${p.slug}`)}): ${oneLine(p.subhead || p.description)}`),
    "",
    ...(posts.length
      ? [
          "## Writing",
          "",
          ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/build/blog/${p.slug}`)})${p.excerpt ? `: ${oneLine(p.excerpt)}` : ""}`),
          "",
        ]
      : []),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function oneLine(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}
