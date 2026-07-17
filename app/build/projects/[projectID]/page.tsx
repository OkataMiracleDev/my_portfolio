import Footer from '@/components/Home/Footer/Footer';
import { projectsData } from '@/data/data'
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { IoLinkOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Projects | Okata Miracle - Frontend Developer",
  description: "Explore Okata Miracle's latest projects built with Next.js, React, and TailwindCSS.",
};

type Props = {
  params: Promise<{
    projectID: string
  }>
}

const ProjectDisplayPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const project = projectsData.find(
    (p) => p.projectID === resolvedParams.projectID
  );

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="heading-2" style={{ color: 'var(--color-text-primary)' }}>
          Project not found
        </h1>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 pb-20 px-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='card p-8 md:p-12 mb-12'>
          <h1 className='heading-1 mb-6' style={{ color: 'var(--color-text-primary)' }}>
            {project.name}
          </h1>
          <p className='body-large mb-8'>
            {project.subhead}
          </p>

          {/* Meta Info Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
            <div>
              <p className='text-sm font-mono mb-2' style={{ color: 'var(--color-accent-bright)' }}>
                Date
              </p>
              <p className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
                {project.date}
              </p>
            </div>
            <div>
              <p className='text-sm font-mono mb-2' style={{ color: 'var(--color-accent-bright)' }}>
                Type
              </p>
              <p className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
                {project.type}
              </p>
            </div>
            <div className='col-span-2'>
              <p className='text-sm font-mono mb-2' style={{ color: 'var(--color-accent-bright)' }}>
                Client
              </p>
              <p className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
                {project.client}
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className='mb-8'>
            <p className='text-sm font-mono mb-3' style={{ color: 'var(--color-accent-bright)' }}>
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technology.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 rounded-full text-sm font-mono font-medium"
                  style={{
                    background: 'oklch(0.65 0.25 285 / 0.2)',
                    color: 'var(--color-accent-bright)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className='mb-8'>
            <p className='text-sm font-mono mb-3' style={{ color: 'var(--color-accent-bright)' }}>
              Description
            </p>
            <p className='body leading-relaxed'>{project.description}</p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4'>
            <Link
              href={project.link}
              className="btn-primary inline-flex items-center gap-2"
              target="_blank"
            >
              <span>Visit Project</span>
              <IoLinkOutline className='text-xl' />
            </Link>
            <Link href="/build/projects" className="btn-secondary inline-flex items-center gap-2">
              <span>←</span>
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>

        {/* Project Images */}
        <div className="space-y-8">
          {[project.image, project.image2, project.image3].map((img, index) => (
            <div key={index} className="card p-6 overflow-hidden">
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image
                  src={img}
                  alt={`${project.name} screenshot ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default ProjectDisplayPage
