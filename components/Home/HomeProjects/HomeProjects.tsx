import SectionHeading from '@/components/Helper/SectionHeading'
import { projectsData } from '@/data/data'
import React from 'react'
import ProjectsCard from './ProjectsCard'

const HomeProjects = () => {
  return (
    <div className='relative top-[200vh] md:top-[155vh] lg:top-[180vh] xl:top-[260vh] w-full flex flex-col justify-center items-center text-center'>
      <SectionHeading heading='Here&apos;s A Bit of What I&apos;ve Worked On!' />
      <div className='mx-auto mt-6 w-[90%] lg:w-[100%] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-1'>
        {/* Projects Card */}
        {projectsData.map((data)=>{
          return <div key={data.id}>
            <ProjectsCard projects={data} />
          </div>
        })}
      </div>
    </div>
  )
}

export default HomeProjects