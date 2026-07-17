import React from "react";
import { projectsData } from "@/data/data";
import ProjectCard from "@/components/Shared/ProjectCard";
import SectionHeading from "@/components/Helper/SectionHeading";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Okata Miracle - Frontend Developer",
  description: "Explore Okata Miracle's latest projects built with Next.js, React, and TailwindCSS.",
};

export function generateStaticParams() {
  return projectsData.map((project) => ({
    projectID: project.projectID,
  }));
}

const ProjectsPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading heading="All Projects" />
          <p className="mt-4 text-lg text-ink/70">
            A collection of my recent work and client projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              accent="build"
              project={{
                id: String(project.id),
                slug: project.projectID,
                title: project.name,
                description: project.description,
                thumbnail: project.image,
                tags: project.technology,
                href: `/build/projects/${project.projectID}`,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/build"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
