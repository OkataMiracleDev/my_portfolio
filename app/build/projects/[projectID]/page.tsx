import Footer from '@/components/Home/Footer/Footer';
import ExpandableText from '@/components/Shared/ExpandableText';
import JsonLd from '@/components/Shared/JsonLd';
import { getDevProjectBySlug } from '@/lib/data/public'
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { IoLinkOutline } from "react-icons/io5";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    projectID: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getDevProjectBySlug(resolvedParams.projectID);

  if (!project) {
    return { title: "Project not found | Okata Miracle" };
  }

  const title = `${project.name} | Okata Miracle`;
  const description = project.subhead || project.description;
  const url = `https://www.okata-miracle.site/build/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: project.technology,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: project.image }],
    },
    alternates: { canonical: url },
  };
}

const ProjectDisplayPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const project = await getDevProjectBySlug(resolvedParams.projectID);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Project not found
        </h1>
      </div>
    );
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.subhead || project.description,
    image: project.image,
    keywords: project.technology.join(", "),
    creator: { "@type": "Person", name: "Okata Miracle", url: "https://www.okata-miracle.site" },
    url: `https://www.okata-miracle.site/build/projects/${project.slug}`,
  };

  return (
    <div className='min-h-screen pt-32 pb-20 px-6'>
      <JsonLd data={projectJsonLd} />
      <div className='max-w-5xl mx-auto'>
        <div className='rounded-card bg-base-raised p-8 md:p-12 mb-12'>
          <h1 className='mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink'>
            {project.name}
          </h1>
          <p className='mb-8 text-lg text-ink/70'>
            {project.subhead}
          </p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
            <div>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Date
              </p>
              <p className='font-semibold text-ink'>{project.date}</p>
            </div>
            <div>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Type
              </p>
              <p className='font-semibold text-ink'>{project.type}</p>
            </div>
            <div className='col-span-2'>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Client
              </p>
              <p className='font-semibold text-ink'>{project.client}</p>
            </div>
          </div>

          <div className='mb-8'>
            <p className='mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technology.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-pill bg-accent-build/15 px-4 py-2 text-sm font-[family-name:var(--font-jetbrains-mono)] font-medium text-accent-build"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className='mb-8'>
            <p className='mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
              Description
            </p>
            <ExpandableText
              text={project.description}
              className="leading-relaxed text-ink/70"
              linkClassName="text-accent-build"
            />
          </div>

          <div className='flex flex-wrap gap-4'>
            <Link
              href={project.link ?? "#"}
              className="inline-flex items-center gap-2 rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
              target="_blank"
            >
              <span>Visit Project</span>
              <IoLinkOutline className='text-xl' />
            </Link>
            <Link
              href="/build/projects"
              className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
            >
              <span>←</span>
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {[project.image, project.image2, project.image3].filter((img): img is string => Boolean(img)).map((img, index) => (
            <div key={index} className="overflow-hidden rounded-card bg-base-raised p-6">
              <div className="relative h-64 md:h-96 overflow-hidden rounded-card">
                <Image
                  src={img}
                  alt={`${project.name} screenshot ${index + 1}`}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
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
