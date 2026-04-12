"use client";
import SectionHeading from '@/components/Helper/SectionHeading';
import React, { useEffect, useRef } from 'react';
import TestimonialSlider from './TestimonialSlider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(sliderRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <div ref={headingRef} className='text-center mb-16'>
          <SectionHeading heading='What Clients Say' />
          <p className="body mt-4">
            Feedback from people I've worked with
          </p>
        </div>
        
        <div ref={sliderRef} className='flex justify-center'>
          <TestimonialSlider />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
