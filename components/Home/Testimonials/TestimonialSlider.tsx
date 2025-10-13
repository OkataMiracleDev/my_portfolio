"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from "swiper/modules"
import Image from 'next/image';
import { testimonialData } from '@/data/data';

const TestimonialSlider = () => {
  return (
    <div>
        <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className='md:w-[450px] md:h-[350px] h-[400px] w-[95%] ' >
            {testimonialData.map((data)=>{
                return (
                    <SwiperSlide key={data.id} className='backdrop-blur-sm bg-[#9084be56] shadow-md shadow-gray-400 rounded-3xl block '>
                        <div className='py-7 px-5 w-full flex flex-col items-center justify-center'>
                            <div className='bg-blue w-[4rem] h-[4rem] rounded-full shadow-md shadow-gray-500 '>
                                <Image src={data.image} width={100} height={100} alt='client' className='rounded-full h-full  w-full object-center object-cover' />
                            </div>
                            <h1 className='mt-4 font-[poppins] font-bold '>{data.name}</h1>
                            <p className='text-center mt-4'>&quot;{data.review}&quot;</p>
                        </div>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    </div>
  )
}

export default TestimonialSlider
