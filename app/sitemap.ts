import type { MetadataRoute } from "next";
import { getDevProjects, getMotionProjects, getResources, getPublishedPosts, getAllTags } from "@/lib/data/public";

const BASE_URL = "https://www.okata-miracle.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [devProjects, motionProjects, resources, posts, tags] = await Promise.all([
    getDevProjects(),
    getMotionProjects(),
    getResources(),
    getPublishedPosts(),
    getAllTags(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/build`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/build/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/build/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/animate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/animate/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/animate/resources`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tags`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const devRoutes: MetadataRoute.Sitemap = devProjects.map((p) => ({
    url: `${BASE_URL}/build/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const motionRoutes: MetadataRoute.Sitemap = motionProjects.map((p) => ({
    url: `${BASE_URL}${p.href}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/animate/resources/${r.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/build/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${BASE_URL}/tags/${t.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...devRoutes, ...motionRoutes, ...resourceRoutes, ...postRoutes, ...tagRoutes];
}
