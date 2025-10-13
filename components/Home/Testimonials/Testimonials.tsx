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
      background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
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

