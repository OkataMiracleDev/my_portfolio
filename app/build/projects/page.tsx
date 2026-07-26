import React from "react";
import SectionHeading from "@/components/Helper/SectionHeading";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getDevProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Okata Miracle - Frontend Developer",
  description: "Explore Okata Miracle's latest projects built with Next.js, React, and TailwindCSS.",
};

// Groups projects into pairs so they read as "spreads" (two facing pages
// split by a spine), matching the picture-book layout used on the homepage
// preview. A trailing odd project out just renders alone, undivided.
function toSpreads<T>(items: T[]): T[][] {
  const spreads: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    spreads.push(items.slice(i, i + 2));
  }
  return spreads;
}

const ProjectsPage = async () => {
  const projects = await getDevProjects();
  const spreads = toSpreads(projects);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionHeading heading="All Projects" />
          <p className="mt-3 text-lg text-ink/70">
            A collection of my recent work and client projects
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {spreads.map((spread, spreadIndex) => (
            <div
              key={spreadIndex}
              className={`grid grid-cols-1 gap-10 rounded-card bg-base-raised px-6 py-10 md:gap-0 md:px-4 md:py-12 ${
                spread.length > 1 ? "md:grid-cols-2 md:divide-x md:divide-ink/10" : "md:grid-cols-1"
              }`}
            >
              {spread.map((project, i) => {
                const index = spreadIndex * 2 + i;
                return (
                  <Link
                    key={project.id}
                    href={`/build/projects/${project.slug}`}
                    className="group flex flex-col items-center px-2 text-center md:px-10"
                  >
                    <div
                      className={`relative h-36 w-36 overflow-hidden rounded-2xl bg-base shadow-[0_8px_24px_rgb(0_0_0_/_0.08)] transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:rotate-0 md:h-44 md:w-44 ${
                        index % 2 === 0 ? "-rotate-3" : "rotate-3"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <span className="mt-5 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-build">
                      {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                      {project.name}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-ink/70 line-clamp-2">
                      {project.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap justify-center gap-2">
                      {project.technology.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-pill bg-ink/5 px-3 py-1 text-xs text-ink/70"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-build">
                      View Project
                      <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
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
