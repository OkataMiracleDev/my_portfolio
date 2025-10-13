import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='relative rotate-18 lg:rotate-25 hover:rotate-18 hover:scale-115 left-19 top-15 md:left-52 lg:left-30 md:top-7 lg:top-22 transition-all duration-400 w-fit h-fit'>
      <div className='flex flex-col items-center w-[12rem] h-[17rem] md:w-[16rem] md:h-[23rem] lg:w-[20rem] lg:h-[28rem] p-3 bg-white shadow-md shadow-gray-400'>
        <Image src={"/images/3.JPG"} width={2500} height={2500} alt="1"  className='w-full  h-full object-cover rounded-lg drop-shadow-md drop-shadow-gray-300 cursor-pointer lg:hover:scale-103 block transition-all duration-700' />
        <p className='text-gray-700 text-base md:text-lg'>@mimi_codes</p>
      </div>
    </div>
  )
}

export default PhotoCollage