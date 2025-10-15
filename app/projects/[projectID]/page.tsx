import Footer from '@/components/Home/Footer/Footer';
import { projectsData } from '@/data/data'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { IoLinkOutline } from "react-icons/io5";

type Props = {
  params: Promise<{
    projectID: string
  }>
}

const ProjectDisplayPage = async ({ params }: Props) => {
  const resolvedParams = await params; // ✅ await the params
  const project = projectsData.find(
    (p) => p.projectID === resolvedParams.projectID
  );

  if (!project) {
    return (
      <div className="pt-[8rem] text-center">
        <h1 className="text-2xl font-bold text-gray-700">Project not found</h1>
      </div>
    );
  }


  return (
    <div data-aos="fade-up" className='overflow-hidden pt-[8rem] pb-10 px-[1.5rem] md:px-[3rem] w-full lg:w-[68%] lg:border-l-1 lg:border-r-1 border-gray-300'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <h1 className='text-left text-lg md:text-3xl font-semibold font-[poppins] text-gray-800'>{project.name}</h1>
          <p className='text-sm md:text-base text-medium text-gray-600'>{project.subhead}</p>
        </div>
        <div className='flex flex-col gap-3 bg-gray-200 border border-gray-300 p-5 rounded-2xl'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-left text-base md:text-lg font-semibold font-[poppins] text-gray-800'>Description</h2>
            <p className='text-sm md:text-base' >{project.description}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-left text-base md:text-lg font-semibold font-[poppins] text-gray-800'>Technologies</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.technology.map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-gray-300 text-black font-medium text-sm rounded-2xl shadow-sm hover:bg-gray-700 hover:text-white transition-all duration-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-left text-base md:text-lg font-semibold font-[poppins] text-gray-800'>Date</h2>
            <span className='text-black text-sm md:text-base'>{project.date}</span>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-left text-base md:text-lg font-semibold font-[poppins] text-gray-800'>Type</h2>
            <span className='text-black text-sm md:text-base'>{project.type}</span>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-left text-base md:text-lg font-semibold font-[poppins] text-gray-800'>Client</h2>
            <span className='text-black text-sm md:text-base'>{project.client}</span>
          </div>          
        </div>
        <div className='flex flex-col justify-center items-center'>
          <Link
            href={project.link} className="mt-[2rem] flex items-center gap-[1rem] w-fit transition-all duration-500 text-gray-300 hover:text-gray-800 font-bold text-base bg-gray-800 hover:bg-gray-300 py-3 px-8 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200">
            <p>Visit Project</p>
            <IoLinkOutline className='text-xl md:text-2xl' />      
          </Link>    
          <Link href="/projects" className="mt-[1.5rem] w-fit transition-all duration-500 text-gray-900 font-bold text-base bg-gray-300 hover:bg-gray-400 py-3 px-8 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200"> 
            <p>&larr; Back </p>
          </Link>   
        </div>

        <div className="mt-[2rem] flex flex-col justify-center items-center px-8 py-8 rounded-2xl bg-gray-100 border border-gray-300 shadow-md">
          {/* Image */}
          <div className="w-full h-[200px] md:h-[400px] rounded-2xl overflow-hidden shadow-md shadow-gray-500">
            <Image
              src={project.image}
              alt={project.name}
              width={600}
              height={400}
              className="h-full w-full object-center object-cover rounded-2xl transition-all duration-300 ease-in-out lg:hover:scale-110"
            />
          </div>  
        </div>
        <div className="mt-[2rem] flex flex-col justify-center items-center px-8 py-8 rounded-2xl bg-gray-100 border border-gray-300 shadow-md">
          {/* Image */}
          <div className="w-full h-[200px] md:h-[400px] rounded-2xl overflow-hidden shadow-md shadow-gray-500">
            <Image
              src={project.image2}
              alt={project.name}
              width={600}
              height={400}
              className="h-full w-full object-center object-cover rounded-2xl transition-all duration-300 ease-in-out lg:hover:scale-110"
            />
          </div>  
        </div>
        <div className="mt-[2rem] flex flex-col justify-center items-center px-8 py-8 rounded-2xl bg-gray-100 border border-gray-300 shadow-md">
          {/* Image */}
          <div className="w-full h-[200px] md:h-[400px] rounded-2xl overflow-hidden shadow-md shadow-gray-500">
            <Image
              src={project.image3}
              alt={project.name}
              width={600}
              height={400}
              className="h-full w-full object-center object-cover rounded-2xl transition-all duration-300 ease-in-out lg:hover:scale-110"
            />
          </div>  
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProjectDisplayPage
