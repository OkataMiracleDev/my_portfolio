import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div id='home' >
      <div className='relative w-full h-[90vh] text-[#22025a] font-[poppins] font-bold text-3xl md:text-6xl gap-4 md:gap-7 flex flex-col justify-center items-center'>
      <div className='bg-green-300 border-2 border-green-400 w-5 h-5 md:w-8 md:h-8 rounded-full absolute top-[53%] left-[61%] md:top-[45%] md:left-[59%] xl:top-[42%] xl:left-[57.4%] '></div>
        <Image src="/images/Miracle_Okata.jpg" alt="character" width={200} height={200} className='rounded-full' />
        <h1 data-aos="fade-up">Hi. I&apos;m mimi</h1>
        <h1 data-aos="fade-up">FrontEnd Developer</h1>
      </div>

      <a href='#contact' className='flex absolute top-[28%] md:top-[26%] md:left-[62%] left-[64%] lg:left-[60%] xl:left-[57%] translate-x-[-50%]'>
        <button className='hire-me-btn font-[poppins] font-medium text-white liquid-glass-2 shadow-sm shadow-gray-700 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300'>Hire Me!</button>
      </a>
      
     </div>
  )
}

export default Hero