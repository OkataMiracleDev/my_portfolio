"use client";
import { projectsSliderData } from "@/data/data";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
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
            <div className="card h-full flex flex-col overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
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

              {/* Project image */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={data.image}
                  alt={data.name}
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

              {/* Project info */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="heading-3 mb-4">
                  {data.name}
                </h3>
                <p className="body text-sm line-clamp-3 flex-1 mb-6">
                  {data.description}
                </p>
                <div className="flex items-center gap-2 font-mono text-sm" style={{ color: 'var(--color-accent-bright)' }}>
                  <span>View Project</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
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
