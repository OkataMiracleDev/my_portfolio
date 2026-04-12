"use client";
import React, { useEffect, useRef } from 'react';
import ProjectsSlider from './ProjectsSlider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <h2 
          ref={headingRef}
          className="heading-2 text-center mb-16"
        >
          Featured Work
        </h2>
        <ProjectsSlider />
      </div>
    </section>
  );
};

export default Projects;
