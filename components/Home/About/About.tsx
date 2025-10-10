import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'

const About = () => {
  return (
    <div className='absolute top-[170vh] translate-y-[-50%] lg:w-[40%]'>
        <SectionHeading heading='About mimi' />
        <div className='md:mt-6 space-y-6 '>
            <p className='text-base font-medium text-gray-600'>I craft intuitive, creative, and responsive user-friendly experiences that deliver measurable business results.</p>
            <p className='text-base font-normal text-gray-500'>I&apos;m a <span className='text-gray-600 font-medium'>Front-End Developer</span> with over 8 months of intensive experience building modern, performance-driven web applications. My core expertise lies in responsive design and implementing simple back-end integrations, allowing me to own a project from the design concept through to deployment.</p>
            <p className='text-base font-normal text-gray-500'>My technical stack is robust and modern, centered on: <span className='text-gray-600 font-medium'>React, Next.js, JavaScript, TypeScript, and Tailwind CSS.</span></p>
            <p className='text-gray-600 font-medium'>Proven Impact</p>
            <p className='text-base font-normal text-gray-500'>My work is defined by solving real-world challenges and achieving significant wins for my clients:</p>
            <div className='space-y-4'>
                <li className='ml-6'>
                    <p className='text-base font-normal text-gray-500'><span className='text-gray-600 font-medium'>Traffic & Conversion:</span> I rescued and rebuilt a critical, non-functional waitlist for <span className='text-gray-600 font-medium'>Synapse Academy</span>. By optimizing the back-end and implementing strong SEO practices, I drove a massive increase in daily visits, escalating traffic from <span className='text-gray-600 font-medium'>1-10 visits to 1,000–3,000 per day.</span></p>
                </li>

                <li className='ml-6'>
                    <p className='text-base font-normal text-gray-500'><span className='text-gray-600 font-medium'>Seamless User Experience:</span> For <span className='text-gray-600 font-medium'>Nkechi Evangelical Ministry</span>, I engineered a system that allowed global followers to stream live services directly on the site, eliminating the need for third-party software and providing an integrated, friction-less experience.</p>
                </li>
            </div>
            
        </div>
    </div>
  )
}

export default About