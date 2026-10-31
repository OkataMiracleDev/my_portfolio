import type { MetadataRoute } from "next";
import {
  getDevProjects,
  getMotionProjects,
  getResources,
  getPublishedPosts,
  getAllTags,
  getStudioPlugins,
} from "@/lib/data/public";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [devProjects, motionProjects, resources, posts, tags, plugins] = await Promise.all([
    getDevProjects(),
    getMotionProjects(),
    getResources(),
    getPublishedPosts(),
    getAllTags(),
    getStudioPlugins(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/build`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/build/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/build/clippro`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/build/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/animate`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/animate/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/animate/rates`, changeFrequency: "monthly", priority: 0.8 },
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
    ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Published plugins only — getStudioPlugins already filters drafts out.
  const pluginRoutes: MetadataRoute.Sitemap = plugins.map((plugin) => ({
    url: `${BASE_URL}/animate/resources/plugins/${plugin.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
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

  return [
    ...staticRoutes,
    ...devRoutes,
    ...motionRoutes,
    ...resourceRoutes,
    ...pluginRoutes,
    ...postRoutes,
    ...tagRoutes,
  ];
}
