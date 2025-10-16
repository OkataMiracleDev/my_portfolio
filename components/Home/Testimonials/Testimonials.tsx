import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'
import TestimonialSlider from './TestimonialSlider'

const Testimonials = () => {
  return (
    <div className='mt-20 md:mt-25 flex flex-col items-center justify-center w-full rounded-3xl'>
        <div className=' w-[90%] lg:w-[70%] md:mx-auto grid items-center justify-center grid-cols-1 gap-8 '>
            {/* Text Content */}
                <div data-aos="fade-up" className=''>
                    <SectionHeading heading='Testimonials' />
                </div>
                {/* Slider */}
                <div className='w-full flex justify-center items-center py-8 rounded-2xl shadow-sm shadow-gray-200'>
                    <div className='md:w-full w-[80%]'>
                        <TestimonialSlider />
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Testimonials

