import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'
import PhotoCollage from './PhotoCollage'

const About = () => {
  return (
    <div id='about' className='absolute top-[200vh] md:top-[160vh] lg:top-[140vh] xl:top-[200vh] left-4 md:left-auto translate-y-[-50%] lg:w-[40%]'>
        <div className='relative z-50'>
            <SectionHeading heading='About mimi' />
            <div className='mt-4 mr-1 md:mr-15 lg:mr-0 md:mt-6 space-y-4 md:space-y-6'>
                <p className='text-base font-medium text-gray-600'>I&apos;m a <span className='text-gray-600 font-medium'>Front-End Developer</span> specializing in creating <span className='text-gray-600 font-medium'>intuitive, creative, and responsive user-friendly experiences.</span> With over <span className='text-gray-600 font-medium'>8 months of intensive experience</span>, my focus is on full project ownership, from concept through simple back-end integration and deployment. My technical stack is <span className='text-gray-600 font-medium'>React, Next.js, JavaScript, TypeScript, and Tailwind CSS.</span></p>
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
                <p className='text-base font-normal text-gray-500'>I excel because of my unique blend of soft skills. I am a highly <span className='text-gray-600 font-medium'>creative</span> and <span className='text-gray-600 font-medium'>efficient</span> problem-solver who delivers solutions in record time. My ambition is to focus on <span className='text-gray-600 font-medium'>AI integration and mobile-first application development.</span></p>
                
            </div>
        </div>
        {/* PhotoCollage */}
        <PhotoCollage />
    </div>
  )
}

export default About