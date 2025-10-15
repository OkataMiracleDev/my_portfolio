import React from "react";
import { projectsData } from "@/data/data";
import ProjectsCard from "@/components/Home/HomeProjects/ProjectsCard";
import SectionHeading from "@/components/Helper/SectionHeading";
import Link from "next/link";

export function generateStaticParams() {
  return projectsData.map((project) => ({
    projectID: project.projectID,
  }));
}

const ProjectsPage = () => {
  return (
    <div className="relative w-full mt-[6rem] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
      {/* Section Heading */}
      <SectionHeading heading="All My Projects" />

      {/* Projects Grid */}
      <div
        className="
          mx-auto mt-10 w-full
          grid grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-6 sm:gap-8 lg:gap-10 
          justify-items-center
        "
      >
        {projectsData.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.projectID}`}
            className="w-full max-w-[380px] sm:max-w-[350px] lg:max-w-[400px]"
          >
            <ProjectsCard projects={project} />
          </Link>
        ))}
      </div>

      {/* Back Home Button */}
      <Link
        href="/"
        className="mt-14 inline-block transition-all duration-500 text-gray-900 hover:text-gray-300 font-bold text-base bg-gray-300 hover:bg-gray-900 py-3 px-8 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200"
      >
        ← Back to Home
      </Link>
    </div>
  );
};

export default ProjectsPage;
