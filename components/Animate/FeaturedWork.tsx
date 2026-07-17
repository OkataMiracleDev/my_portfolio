import Link from "next/link";
import ProjectCard from "@/components/Shared/ProjectCard";
import { motionProjectsData } from "@/data/motion-projects";

export default function FeaturedWork() {
  const featured = motionProjectsData.slice(0, 3);

  return (
    <section className="section bg-band-dark px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-base">
            Featured work
          </h2>
          <Link
            href="/animate/projects"
            className="text-sm font-medium text-base/70 transition-colors duration-200 ease-out hover:text-base"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} accent="animate" project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
