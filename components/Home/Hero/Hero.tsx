import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div className='relative w-full h-[90vh] text-[#22025a] font-[poppins] font-bold text-3xl md:text-6xl gap-4 md:gap-7 flex flex-col justify-center items-center'>
        <Image src="/images/Miracle_Okata.jpg" alt="character" width={200} height={200} className='rounded-full' />
        <h1>Hi. I&apos;m mimi</h1>
        <h1>FrontEnd Developer</h1>
    </div>
  )
}

export default Hero