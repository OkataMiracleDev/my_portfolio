import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='relative rotate-25 hover:rotate-18 hover:scale-115 left-15 top-15 md:left-28 md:top-22 transition-all duration-400 w-fit h-fit'>
      <div className='flex flex-col items-center w-[10rem] h-[14rem] md:w-[20rem] md:h-[28rem] p-3 bg-white shadow-md shadow-gray-400'>
        <Image src={"/images/3.jpg"} width={3000} height={3000} alt="1"  className='w-full  h-full object-cover rounded-lg drop-shadow-md drop-shadow-gray-300 cursor-pointer hover:scale-103 block transition-all duration-700' />
        <p className='text-gray-700 text-base md:text-lg'>@mimi_codes</p>
      </div>
    </div>
  )
}

export default PhotoCollage