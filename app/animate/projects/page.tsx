import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/Shared/ProjectCard";
import { getMotionProjects } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motion Projects | Okata Miracle",
  description: "Motion design case studies — brand animation, UI micro-interactions, and short-form video.",
};

export default async function AnimateProjectsPage() {
  const motionProjects = await getMotionProjects();
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Motion Projects
          </h1>
          <p className="mt-4 text-lg text-ink/70">Case studies from brand, product, and social work.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {motionProjects.map((project) => (
            <ProjectCard key={project.id} accent="animate" project={project} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/animate"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Animate home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
