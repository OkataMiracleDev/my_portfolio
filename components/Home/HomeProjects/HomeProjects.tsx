import SectionHeading from '@/components/Helper/SectionHeading'
import { projectsData } from '@/data/data'
import React from 'react'
import ProjectsCard from './ProjectsCard'

const HomeProjects = () => {
  return (
    <div className='relative w-full mt-[105rem] md:mt-[100rem] lg:mt-[123rem] 2xl:mt-[109rem] flex flex-col justify-center items-center text-center'>
      <SectionHeading heading='Here&apos;s A Bit of What I&apos;ve Worked On!' />
      <div className='mx-auto mt-6 w-[90%] lg:w-[100%] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-1'>
        {/* Projects Card */}
        {projectsData.map((data)=>{
          return <div key={data.id}>
            <ProjectsCard projects={data} />
          </div>
        })}
      </div>
      <a href="#" target="_blank" rel="noopener noreferrer" className='mt-[4rem]'>
          <button className="transition-all duration-500 ease text-gray-900 hover:text-gray-300 font-bold text-base flex flex-row justify-center gap-1 hover:gap-3 bg-gray-300 hover:bg-gray-900 py-3 px-4 md:px-8 lg:px-4 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200">
              <p>View All</p>
              <p>&rarr;</p>
          </button>
      </a>

    </div>
  )
}

export default HomeProjects