import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='absolute rotate-[68deg] md:rotate-[66deg] -bottom-[33%] right-[38%] md:-bottom-[60%] lg:-bottom-[125%] md:right-0 md:left-[47%] md:-translate-x-[50%] '>
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='bg-gray-100 w-[6rem] h-[18rem] md:w-[10rem] md:h-[30rem] lg:w-[20rem] lg:h-[60rem] md:hover:w-[23rem] md:hover:h-[69rem] grid grid-rows-3 px-2 py-2 gap-2 md:gap-4 shadow-md shadow-gray-300 transition-all duration-300'>
                <Image src={"/images/1.jpg"} width={4000} height={4000} alt="1"  className='w-full  h-full object-cover rounded-lg drop-shadow-md drop-shadow-gray-300 cursor-alias' />
                <Image src={"/images/2.jpg"} width={4000} height={4000} alt="2" className='w-full  h-full object-cover rounded-lg drop-shadow-md drop-shadow-gray-300 cursor-cell' />
                <Image src={"/images/3.jpg"} width={4000} height={4000} alt="3" className='w-full  h-full object-cover rounded-lg drop-shadow-md drop-shadow-gray-300 cursor-pointer' />
            </div>
            <p className='text-sm md:text-base text-gray-500 text-shadow-sm text-shadow-gray-400'>@mimi_codes</p>
        </div>
    </div>
  )
}

export default PhotoCollage