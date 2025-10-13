import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'
import TestimonialSlider from './TestimonialSlider'

const Testimonials = () => {
  return (
    <div className='mt-20 md:mt-25 flex flex-col items-center justify-center w-full rounded-3xl'>
        <div className=' w-[90%] lg:w-[70%] md:mx-auto grid items-center justify-center grid-cols-1 gap-8 '>
            {/* Text Content */}
                <div className=''>
                    <SectionHeading heading='Testimonials' />
                </div>
                {/* Slider */}
                <div  style={{
     backgroundImage: `
       linear-gradient(to right, #f0f0f0 1px, transparent 1px),
       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
       radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
       radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
     `,
     backgroundSize: `
       96px 64px,    
       96px 64px,    
       100% 100%,    
       100% 100%  
     `,
   }}
    className='w-full flex justify-center items-center py-8 rounded-2xl shadow-md shadow-gray-500'>
                    <div className='md:w-full w-[80%]'>
                        <TestimonialSlider />
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Testimonials