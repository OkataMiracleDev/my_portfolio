import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  devProjects,
  motionProjects,
  resources,
  testimonials,
  posts,
  experienceEntries,
  funFactCards,
  animateCredentials,
} from "@/lib/db/schema";
import type { ResourceContent, TestimonialContent, MotionProjectContent } from "@/types/content";
import { slugifyTag } from "@/lib/utils/slugify-tag";

// Dev projects: consolidates data/data.ts's three overlapping arrays
// (projectsData, homeprojectsData, projectsSliderData). Callers that
// previously used homeprojectsData filter with getFeaturedDevProjects();
// projectsSliderData's fields were already a subset of projectsData's, so
// callers that used it just consume getDevProjects() directly.
export async function getDevProjects() {
  return db.select().from(devProjects).orderBy(asc(devProjects.sortOrder));
}

export async function getFeaturedDevProjects() {
  const rows = await getDevProjects();
  return rows.filter((project) => project.featuredOnHome);
}

export async function getDevProjectBySlug(slug: string) {
  const [row] = await db.select().from(devProjects).where(eq(devProjects.slug, slug));
  return row ?? null;
}

export async function getMotionProjects(): Promise<MotionProjectContent[]> {
  const rows = await db.select().from(motionProjects).orderBy(asc(motionProjects.sortOrder));
  return rows.map((row) => ({
    ...row,
    href: `/animate/projects/${row.slug}`,
    videoEmbedUrl: row.videoEmbedUrl ?? undefined,
  }));
}

export async function getMotionProjectBySlug(slug: string): Promise<MotionProjectContent | null> {
  const rows = await getMotionProjects();
  return rows.find((row) => row.slug === slug) ?? null;
}

export async function getFeaturedMotionProjects(): Promise<MotionProjectContent[]> {
  const rows = await getMotionProjects();
  return rows.filter((row) => row.featuredOnHome);
}

export async function getResources(): Promise<ResourceContent[]> {
  const rows = await db.select().from(resources).orderBy(asc(resources.sortOrder));
  return rows.map((row) => ({
    ...row,
    fileUrl: row.fileUrl ?? undefined,
    externalUrl: row.externalUrl ?? undefined,
    publishedAt: row.publishedAt.toISOString(),
  }));
}

export async function getResourceBySlug(slug: string): Promise<ResourceContent | null> {
  const rows = await getResources();
  return rows.find((row) => row.slug === slug) ?? null;
}

// role is coerced from nullable (schema — build-side testimonials have no
// role, see Task 2) to "" so this satisfies TestimonialContent's required
// `role: string`; the build TestimonialSlider never renders role anyway.
export async function getTestimonials(route: "build" | "animate"): Promise<TestimonialContent[]> {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.route, route))
    .orderBy(asc(testimonials.sortOrder));
  return rows.map((row) => ({ ...row, role: row.role ?? "" }));
}

export async function getPublishedPosts(routes?: Array<"build" | "animate" | "general">) {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt));
  return routes ? rows.filter((row) => routes.includes(row.route)) : rows;
}

export async function getPostBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)));
  return row ?? null;
}

export async function getExperienceEntries() {
  return db.select().from(experienceEntries).orderBy(asc(experienceEntries.sortOrder));
}

export async function getFunFactCards() {
  return db.select().from(funFactCards).orderBy(asc(funFactCards.sortOrder));
}

export async function getAnimateCredentials() {
  return db.select().from(animateCredentials).orderBy(asc(animateCredentials.sortOrder));
}

// Tags are free text entered per-project/resource in the admin, so the same
// concept ("Next.js", "next.js", "Next js") could technically be typed
// differently across entries. Grouping by slugifyTag(tag) means those still
// collapse onto one archive page; the first-seen original casing is kept as
// the display label.
export async function getAllTags() {
  const [devRows, motionRows, resourceRows] = await Promise.all([
    getDevProjects(),
    getMotionProjects(),
    getResources(),
  ]);

  const counts = new Map<string, { label: string; count: number }>();
  const addTag = (tag: string) => {
    const slug = slugifyTag(tag);
    if (!slug) return;
    const existing = counts.get(slug);
    if (existing) existing.count += 1;
    else counts.set(slug, { label: tag, count: 1 });
  };

  devRows.forEach((p) => p.technology.forEach(addTag));
  motionRows.forEach((p) => {
    p.tags.forEach(addTag);
    p.tools.forEach(addTag);
  });
  resourceRows.forEach((r) => r.tags.forEach(addTag));

  return Array.from(counts.entries())
    .map(([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function getContentByTagSlug(tagSlug: string) {
  const [devRows, motionRows, resourceRows] = await Promise.all([
    getDevProjects(),
    getMotionProjects(),
    getResources(),
  ]);

  const matches = (tags: string[]) => tags.some((t) => slugifyTag(t) === tagSlug);

  const devMatches = devRows.filter((p) => matches(p.technology));
  const motionMatches = motionRows.filter((p) => matches(p.tags) || matches(p.tools));
  const resourceMatches = resourceRows.filter((r) => matches(r.tags));

  const label =
    devMatches[0]?.technology.find((t) => slugifyTag(t) === tagSlug) ??
    motionMatches[0]?.tags.find((t) => slugifyTag(t) === tagSlug) ??
    motionMatches[0]?.tools.find((t) => slugifyTag(t) === tagSlug) ??
    resourceMatches[0]?.tags.find((t) => slugifyTag(t) === tagSlug) ??
    tagSlug;

  return { label, devMatches, motionMatches, resourceMatches };
}
