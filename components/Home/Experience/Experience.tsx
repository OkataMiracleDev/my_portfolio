import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'
import { FaRegPlayCircle } from "react-icons/fa";

const Experience = () => {
  return (
    <div className=' mt-[8rem] pt-8 pb-10 ml-[4%] md:ml-[4%] lg:ml-[14%] w-full flex flex-col gap-6 border-b border-t border-gray-400 '>
        <div>
            <SectionHeading heading='Work Experience' />
        </div>
        <div style={{gridTemplateColumns: '0.5fr 1fr'}} className='w-full grid items-center'>
            <div className='flex flex-col gap-9 p-2 bg-purple-100 md:bg-none rounded-md w-fit md:gap-4'>
                <p className='font-semibold text-gray-500 text-sm md:text-base'>Aug 2025 - Present</p>
                <p className='font-semibold text-gray-500 text-sm md:text-base'>Sept 2025 - Present</p>
            </div>
            <div className=' md:w-[80%] lg:w-[60%] flex flex-col gap-5 md:gap-1'>
                <div className='flex flex-col md:flex-row items-center gap-2 justify-end'>
                    <p className='font-semibold text-gray-700 text-sm md:text-base'>Snr. Front End Developer</p>
                    <button className='px-1 md:px-2 py-0.5 md:py-1 bg-purple-100 font-medium text-sm md:text-base text-purple-400 rounded-md'> <FaRegPlayCircle className='inline-block mr-1 text-sm' /> Synapse Academy</button>
                </div>
                <div className='flex flex-col md:flex-row items-center gap-2 justify-end'>
                    <p className='font-semibold text-gray-700 text-sm md:text-base'>Founder</p>
                    <button className='px-1 md:px-2 py-0.5 bg-purple-100 font-medium text-sm md:text-base text-purple-400 rounded-md'> <FaRegPlayCircle className='inline-block mr-1 text-sm' /> UniHub ent.</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Experience