import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: "https://www.okata-miracle.site/sitemap.xml",
    host: "https://www.okata-miracle.site",
  };
}
