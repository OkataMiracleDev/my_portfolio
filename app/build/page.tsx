import Home from '@/components/Home/Home'
import { Metadata } from 'next';
import React from 'react'
import { getDevProjects, getFeaturedDevProjects, getExperienceEntries, getTestimonials } from '@/lib/data/public'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Okata Miracle - Front-End Developer",
  description: "Explore Okata Miracle’s latest projects built with Next.js, React, and TailwindCSS.",
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
