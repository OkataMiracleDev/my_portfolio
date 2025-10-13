import Image from 'next/image';
import React from 'react'

type Props = {
projects: {
    id: number;
    image: string;
    name: string;
    description: string;
    link: string;
}
}

const ProjectsCard = ({projects}: Props) => {
  return (
    <div className="flex flex-col lg:mx-10 w-full lg:w-[400px] min-h-[390px] md:min-h-[400px] px-8 py-8 rounded-2xl border border-gray-300 shadow-md">
        {/* Image */}
        <div className="w-full h-[160px] rounded-2xl overflow-hidden shadow-md shadow-gray-500">
            <Image
            src={projects.image}
            alt={projects.name}
            width={600}
            height={400}
            className="h-full w-full object-center object-cover rounded-2xl transition-all duration-300 ease-in-out lg:hover:scale-110"
            />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-between flex-grow text-left pt-4 gap-3">
            <div className='flex flex-col gap-2'>
                <h1 className="text-lg font-bold text-gray-700">{projects.name}</h1>
                <p className="text-sm md:text-base text-gray-500 max-w-full break-words line-clamp-2">
                    {projects.description}
                </p>
            </div>

            <a href={projects.link} target="_blank" rel="noopener noreferrer">
                <button className="transition-all duration-400 ease-in-out text-gray-900 hover:text-gray-300 font-bold text-base bg-gray-300 hover:bg-gray-900 py-3 px-4 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200">
                    View Project &rarr;
                </button>
            </a>
        </div>
    </div>
  )
}

export default ProjectsCard