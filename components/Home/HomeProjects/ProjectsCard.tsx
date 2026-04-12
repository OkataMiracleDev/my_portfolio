"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  projects: {
    id: number;
    image: string;
    name: string;
    description: string;
    projectID: string;
  };
  index: number;
};

const ProjectsCard = ({ projects, index }: Props) => {
  const router = useRouter();

  return (
    <div className="card h-full flex flex-col overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
      {/* Card number badge */}
      <div 
        className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full font-mono text-sm font-bold"
        style={{
          background: 'oklch(0.65 0.25 285 / 0.9)',
          color: 'oklch(1 0 0)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Image */}
      <div className="relative h-48 md:h-72 overflow-hidden">
        <Image
          src={projects.image}
          alt={projects.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, oklch(0.18 0.04 285) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 flex flex-col flex-1">
        <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
          {projects.name}
        </h3>
        <p className="body text-xs md:text-sm line-clamp-2 md:line-clamp-3 flex-1 mb-4 md:mb-6">
          {projects.description}
        </p>

        {/* View Project Button */}
        <button
          onClick={() => router.push(`${projects.projectID}`)}
          className="btn-secondary w-full group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            <span>View Project</span>
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsCard;
