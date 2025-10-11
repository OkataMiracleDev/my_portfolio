import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'

const HomeProjects = () => {
  return (
    <div className='relative top-[215vh] md:top-[155vh] lg:top-[200vh] xl:top-[272vh] w-full flex flex-col justify-center items-center text-center'>
      <SectionHeading heading='Here&apos;s A Bit of What I&apos;ve Worked On!' />
      <div className='bg-black mx-auto mt-6 w-[90%] md:w-[110%] lg:w-[100%] h-[300px] '>
        {/* Projects Card */}
      </div>
    </div>
  )
}

export default HomeProjects