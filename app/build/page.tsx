import Home from '@/components/Home/Home'
import { Metadata } from 'next';
import React from 'react'
import { getDevProjects, getFeaturedDevProjects, getExperienceEntries, getTestimonials } from '@/lib/data/public'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mimi Studios | Frontend Developer — React, Next.js, TypeScript",
  description:
    "Mimi Studios is a frontend development & motion design studio building fast, accessible interfaces with React, Next.js, TypeScript, and Tailwind CSS. Explore projects, experience, and client work.",
  openGraph: {
    title: "Mimi Studios | Frontend Developer — React, Next.js, TypeScript",
    description:
      "Frontend developer building fast, accessible interfaces with React, Next.js, TypeScript, and Tailwind CSS.",
    url: "https://www.okata-miracle.site/build",
    siteName: "Mimi Studios",
    images: [{ url: "https://www.okata-miracle.site/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimi Studios | Frontend Developer",
    description: "React, Next.js, TypeScript, and Tailwind CSS developer.",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/build",
  },
};

const HomePage = async () => {
  const [allDevProjects, featuredDevProjects, experienceEntries, testimonials] = await Promise.all([
    getDevProjects(),
    getFeaturedDevProjects(),
    getExperienceEntries(),
    getTestimonials("build"),
  ]);

  return (
    <div className=''>
      <Home
        allDevProjects={allDevProjects}
        featuredDevProjects={featuredDevProjects}
        experienceEntries={experienceEntries}
        testimonials={testimonials}
      />
    </div>
  )
}

export default HomePage
