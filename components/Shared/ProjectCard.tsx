import Image from "next/image";
import Link from "next/link";
import type { ProjectContent } from "@/types/content";

interface ProjectCardProps {
  project: ProjectContent;
  accent: "build" | "animate";
}

export default function ProjectCard({ project, accent }: ProjectCardProps) {
  const accentOutline =
    accent === "build"
      ? "focus-visible:outline-accent-build"
      : "focus-visible:outline-accent-animate";

  return (
    <Link
      href={project.href}
      data-testid="project-card"
      data-accent={accent}
      className={`group block overflow-hidden rounded-card bg-base-raised transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 ${accentOutline}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          quality={90}
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink/70">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill bg-ink/5 px-3 py-1 text-xs text-ink/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
