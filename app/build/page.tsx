import Home from '@/components/Home/Home'
import { Metadata } from 'next';
import React from 'react'
import { getDevProjects, getFeaturedDevProjects, getExperienceEntries, getTestimonials } from '@/lib/data/public'
import { getStackVersions } from '@/lib/stack-versions'
import { getClipProReleases } from '@/lib/clippro'
import { absoluteUrl } from "@/lib/site";
import JsonLd from "@/components/Shared/JsonLd";
import { breadcrumbNode, graph, personNode, studioNode, websiteNode } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frontend Developer in Nigeria | Okata Studios",
  description:
    "Frontend developer in Port Harcourt, Nigeria building fast, accessible React, Next.js and TypeScript interfaces for teams across Africa and worldwide.",
  openGraph: {
    title: "Frontend Developer in Nigeria | Okata Studios",
    description:
      "React, Next.js and TypeScript interfaces — built in Port Harcourt for teams across Africa and worldwide.",
    url: absoluteUrl("/build"),
    siteName: "Okata Studios",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Developer in Nigeria | Okata Studios",
    description: "React, Next.js, TypeScript and Tailwind CSS developer in Port Harcourt, Nigeria.",
  },
  alternates: {
    canonical: absoluteUrl("/build"),
  },
};

const HomePage = async () => {
  const [allDevProjects, featuredDevProjects, experienceEntries, testimonials, clipPro] = await Promise.all([
    getDevProjects(),
    getFeaturedDevProjects(),
    getExperienceEntries(),
    getTestimonials("build"),
    getClipProReleases(),
  ]);

  // Read on the server so package.json never reaches the client bundle.
  const stack = getStackVersions()

  return (
    <>
      <JsonLd
        data={graph(
          studioNode(),
          personNode(),
          websiteNode(),
          breadcrumbNode([
            { name: "Okata Studios", path: "/" },
            { name: "Frontend development", path: "/build" },
          ])
        )}
      />
      <Home
        allDevProjects={allDevProjects}
        featuredDevProjects={featuredDevProjects}
        experienceEntries={experienceEntries}
        testimonials={testimonials}
        stack={stack}
        clipPro={clipPro.latest}
      />
    </>
  )
}

export default HomePage
