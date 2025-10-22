"use client"
import { projectsSliderData } from '@/data/data';
import Image from 'next/image';
import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const ProjectsSlider = () => {
  return (
    <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={1500} keyBoardControl={true}>
        {projectsSliderData.map((data)=>{
            return(
                <div key={data.id} className='m-5 hover:m-3 block transition-all duration-300'>
                    <a href={data.link} target="_blank" rel="noopener noreferrer" className='block w-full h-full'>
                        <div className='flex flex-col items-center  bg-gray-300 py-6 md:px-4 md:py-8 rounded-2xl shadow-md shadow-gray-400'>

                            <div className='md:flex hidden flex-row gap-1 absolute top-[9%] left-[90%] translate-x-[-50%]'>
                                <div className='w-[8px] h-[8px] bg-blue-400 border border-gray-200 rounded-full'></div>
                                <div className='w-[8px] h-[8px] bg-purple-400 border border-gray-200 rounded-full'></div>
                                <div className='w-[8px] h-[8px] bg-red-400 border border-gray-200 rounded-full'></div>
                            </div>

                            <div className='flex md:hidden flex-row gap-1 absolute w-full h-full translate-x-[-50%]'>
                                <div className='w-[12px] h-[12px] bg-blue-400 border-2 border-gray-200 rounded-full absolute -top-[2%] -left-[42%]'></div>
                                <div className='w-[12px] h-[12px] bg-purple-400 border-2 border-gray-200 rounded-full absolute top-[79%] -left-[42%]'></div>
                                <div className='w-[12px] h-[12px] bg-red-400 border-2 border-gray-200 rounded-full absolute -top-[2%] left-[39%]'></div>
                            </div>


                            <div className='flex flex-col items-center justify-center'>
                                <div className='w-[300px] h-[250px] md:w-[370px] md:h-[180px]'>
                                    <Image src={data.image} alt={data.name} width={1500} height={1500} className='h-full w-full object-center object-cover rounded-lg drop-shadow-md drop-shadow-gray-400 ' />
                                </div>
                                <h1 className='grav font-bold mt-4 text-center'>{data.name}</h1>
                            </div>

                        </div>
                    </a>
                </div>
            )
        })}
    </Carousel>
  )
}

export default ProjectsSlider