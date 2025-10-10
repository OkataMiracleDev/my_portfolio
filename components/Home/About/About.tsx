import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'
import PhotoCollage from './PhotoCollage'

const About = () => {
  return (
    <div id='about' className='absolute top-[215vh] md:top-[180vh] lg:top-[190vh] left-4 md:left-auto translate-y-[-50%] lg:w-[40%]'>
        <div className='relative z-50'>
            <SectionHeading heading='About mimi' />
            <div className='mt-4 mr-1 md:mr-15 lg:mr-0 md:mt-6 space-y-4 md:space-y-6'>
                <p className='text-base font-medium text-gray-600'>I craft intuitive, creative, and responsive user-friendly experiences that deliver measurable business results.</p>
                <p className='text-base font-normal text-gray-500'>I&apos;m a <span className='text-gray-600 font-medium'>Front-End Developer</span> with over 8 months of intensive experience building modern, performance-driven web applications. My core expertise lies in responsive design and implementing simple back-end integrations, allowing me to own a project from the design concept through to deployment.</p>
                <p className='text-base font-normal text-gray-500'>My technical stack is robust and modern, centered on: <span className='text-gray-600 font-medium'>React, Next.js, JavaScript, TypeScript, and Tailwind CSS.</span></p>
                <p className='text-gray-600 font-medium'>Proven Impact</p>
                <p className='text-base font-normal text-gray-500'>My work is defined by solving real-world challenges and achieving significant wins for my clients:</p>
                <div className='space-y-2 md:space-y-4'>
                    <li className='ml-6'>
                        <p className='text-base font-normal text-gray-500'><span className='text-gray-600 font-medium'>Traffic & Conversion:</span> I rescued and rebuilt a critical, non-functional waitlist for <span className='text-gray-600 font-medium'>Synapse Academy</span>. By optimizing the back-end and implementing strong SEO practices, I drove a massive increase in daily visits, escalating traffic from <span className='text-gray-600 font-medium'>1-10 visits to 1,000–3,000 per day.</span></p>
                    </li>

                    <li className='ml-6'>
                        <p className='text-base font-normal text-gray-500'><span className='text-gray-600 font-medium'>Seamless User Experience:</span> For <span className='text-gray-600 font-medium'>Nkechi Evangelical Ministry</span>, I engineered a system that allowed global followers to stream live services directly on the site, eliminating the need for third-party software and providing an integrated, friction-less experience.</p>
                    </li>
                </div>

                <p className='text-gray-600 font-medium'>My Approach</p>
                <p className='text-base font-normal text-gray-500'>I excel because of my unique blend of soft skills. I am a highly <span className='text-gray-600 font-medium'>creative</span> and <span className='text-gray-600 font-medium'>efficient</span> problem-solver who actively seeks challenges outside my comfort zone to deliver solutions in <span className='text-gray-600 font-medium'>record time</span>. My <span className='text-gray-600 font-medium'>impeccable communication</span> skills ensure I can translate complex technical details into clear project progress.</p>
                <p className='text-base font-normal text-gray-500'>Looking ahead, I am eager to focus on <span className='text-gray-600 font-medium'>AI integration, mobile-first application development, and advanced web development</span> to continue building the innovative products of tomorrow.</p>
                
            </div>
        </div>
        {/* PhotoCollage */}
        <PhotoCollage />
    </div>
  )
}

export default About