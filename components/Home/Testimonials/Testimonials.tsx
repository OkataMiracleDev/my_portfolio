import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'

const Testimonials = () => {
  return (
    <div className='py-20 flex flex-col items-center justify-center bg-purple-600 w-full rounded-md'>
        <div className=' w-[80%] mx-auto grid items-center justify-center grid-cols-1 gap-10 '>
            {/* Text Content */}
            <div>
                <div className='text-gray-200 text-center'>
                    <SectionHeading heading='Testimonials ' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Testimonials