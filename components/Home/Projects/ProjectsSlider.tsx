"use client";
import { projectsSliderData } from "@/data/data";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const ProjectsSlider = () => {
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={4000}
      keyBoardControl={true}
      containerClass="pb-12"
      itemClass="px-4"
    >
      {projectsSliderData.map((data, index) => {
        return (
          <a
            key={data.id}
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-card bg-base-raised transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <div className="absolute top-6 left-6 z-10 rounded-pill bg-accent-build px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative h-72 overflow-hidden">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
                  {data.name}
                </h3>
                <p className="mb-6 flex-1 text-sm text-ink/70 line-clamp-3">
                  {data.description}
                </p>
                <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build">
                  <span>View Project</span>
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-2">→</span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </Carousel>
  );
};

export default ProjectsSlider;
