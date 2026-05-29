"use client";
import SectionHeading from '@/components/Helper/SectionHeading';
import React, { useEffect, useRef } from 'react';
import PhotoCollage from './PhotoCollage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id='about' ref={sectionRef} className='section px-6 '>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
          {/* Text Content */}
          <div ref={contentRef} className='space-y-8'>
            <SectionHeading heading='About mimi' />
            
            <div className='space-y-6'>
              <p className='body-large'>
                I&apos;m a <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>Frontend Developer</span> specializing in creating <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>intuitive, creative, and responsive user-friendly experiences.</span> With over <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>2 years of intensive experience</span>, my focus is on full project ownership, from concept through deployment.
              </p>

              {/* Impact Cards */}
              <div className='space-y-4'>
                <h3 className='heading-3'>
                  Proven Impact
                </h3>
                
                <div className='card p-6 space-y-4'>
                  <div className='flex items-start gap-4'>
                    <div 
                      className='w-2 h-2 rounded-full mt-2 flex-shrink-0'
                      style={{ background: 'var(--color-accent)' }}
                    />
                    <div>
                      <h4 className='font-bold mb-2' style={{ color: 'var(--color-text-primary)' }}>
                        Traffic & Conversion
                      </h4>
                      <p className='body text-sm'>
                        Rescued and rebuilt a critical waitlist for <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>Synapse Academy</span>, driving traffic from <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>1-10 visits to 1,000–3,000 per day</span> through SEO optimization and backend improvements.
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row items-start gap-4'>
                    <div 
                      className='w-2 h-2 rounded-full mt-2 flex-shrink-0'
                      style={{ background: 'var(--color-accent)' }}
                    />
                    <div>
                      <h4 className='font-bold mb-2' style={{ color: 'var(--color-text-primary)' }}>
                        Seamless UX
                      </h4>
                      <p className='body text-sm'>
                        Engineered a live-streaming system for <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>Nkechi Evangelical Ministry</span>, enabling global followers to watch services directly on-site without third-party software.
                      </p>
                    </div>
                    <div>
                      <h4 className='font-bold mb-2' style={{ color: 'var(--color-text-primary)' }}>
                        Full Stack Development
                      </h4>
                      <p className='body text-sm'>
                        I built <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>UniHub</span>. UniHub is the ultimate platform for university students to discover, create, and manage campus events. Join communities, buy tickets, and never miss out on what&apos;s happening on campus.                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approach */}
              <div className='space-y-4'>
                <h3 className='heading-3'>
                  My Approach
                </h3>
                <p className='body'>
                  I excel through <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>creative problem-solving</span> and <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>efficient delivery</span>. My technical stack includes React, Next.js, TypeScript, and GSAP. My ambition is to focus on <span style={{ color: 'var(--color-accent-bright)', fontWeight: 600 }}>AI integration and mobile-first application development.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Photo Collage */}
          <div ref={imageRef} className='flex justify-center lg:justify-end'>
            <PhotoCollage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
