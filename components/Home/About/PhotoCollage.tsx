import { PhotoCollageData } from '@/data/data'
import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <>
      {PhotoCollageData.map((data) => {
        return (
            <div key={data.id} className='absolute rotate-12 z-auto '>
                <div className='bg-white rounded-sm md:rounded-md flex flex-col items-center justify-center gap-2 w-[80px] md:w-[190px] h-[300px] md:h-[600px] py-6 px-2'>

                    <div key={data.id} className='grid grid-rows-3 gap-2 md:gap-4 justify-center items-center h-full'>
                        <Image className='w-full h-full object-cover object-center rounded-md md:rounded-lg' src={"/images/1.jpg"} alt={data.label} width={300} height={600}/>
                        <Image className='w-full h-full object-cover object-center rounded-md md:rounded-lg' src={"/images/2.jpg"} alt={data.label} width={300} height={600}/>
                        <Image className='w-full h-full object-cover object-center rounded-md md:rounded-lg' src={"/images/3.jpg"} alt={data.label} width={300} height={600}/>
                    </div>

                    <p className='text-[8px] md:text-base'>@mimi_codes</p>

                </div>
            </div>
        )
      })}
    </>
  )
}

export default PhotoCollage