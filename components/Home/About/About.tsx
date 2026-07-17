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
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        x: -50, opacity: 0, duration: 1, ease: "power4.out",
      });
      gsap.from(imageRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        x: 50, opacity: 0, duration: 1, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id='about' ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
          <div ref={contentRef} className='space-y-8'>
            <SectionHeading heading='About mimi' />

            <div className='space-y-6'>
              <p className='text-lg text-ink/70'>
                I&apos;m a <span className="font-semibold text-accent-build">Frontend Developer</span> specializing in creating <span className="font-semibold text-accent-build">intuitive, creative, and responsive user-friendly experiences.</span> With over <span className="font-semibold text-accent-build">2 years of intensive experience</span>, my focus is on full project ownership, from concept through deployment.
              </p>

              <div className='space-y-4'>
                <h3 className='font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink'>
                  Proven Impact
                </h3>

                <div className='space-y-4 rounded-card bg-base-raised p-6'>
                  <div className='flex items-start gap-4'>
                    <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-build' />
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Traffic &amp; Conversion</h4>
                      <p className='text-sm text-ink/70'>
                        Rescued and rebuilt a critical waitlist for <span className="font-semibold text-accent-build">Synapse Academy</span>, driving traffic from <span className="font-semibold text-accent-build">1-10 visits to 1,000–3,000 per day</span> through SEO optimization and backend improvements.
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row items-start gap-4'>
                    <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-build' />
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Seamless UX</h4>
                      <p className='text-sm text-ink/70'>
                        Engineered a live-streaming system for <span className="font-semibold text-accent-build">Nkechi Evangelical Ministry</span>, enabling global followers to watch services directly on-site without third-party software.
                      </p>
                    </div>
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Full Stack Development</h4>
                      <p className='text-sm text-ink/70'>
                        I built <span className="font-semibold text-accent-build">UniHub</span>. UniHub is the ultimate platform for university students to discover, create, and manage campus events. Join communities, buy tickets, and never miss out on what&apos;s happening on campus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink'>
                  My Approach
                </h3>
                <p className='text-base text-ink/70'>
                  I excel through <span className="font-semibold text-accent-build">creative problem-solving</span> and <span className="font-semibold text-accent-build">efficient delivery</span>. My technical stack includes React, Next.js, TypeScript, and GSAP. My ambition is to focus on <span className="font-semibold text-accent-build">AI integration and mobile-first application development.</span>
                </p>
              </div>
            </div>
          </div>

          <div ref={imageRef} className='flex justify-center lg:justify-end'>
            <PhotoCollage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
