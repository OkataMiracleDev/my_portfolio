import React from "react";
import { projectsData } from "@/data/data";
import ProjectsCard from "@/components/Home/HomeProjects/ProjectsCard";
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
          <p className="body-large mt-4">
            A collection of my recent work and client projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projectsData.map((project, index) => (
            <Link
              key={project.id}
              href={`/build/projects/${project.projectID}`}
            >
              <ProjectsCard projects={project} index={index} />
            </Link>
          ))}
        </div>

        {/* Back Home Button */}
        <div className="flex justify-center">
          <Link href="/build" className="btn-secondary group inline-flex items-center gap-3">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
