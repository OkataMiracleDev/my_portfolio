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
        <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className='md:w-[450px] h-[300px] md:h-[350px] w-[90%] ' >
            {testimonialData.map((data)=>{
                return (
                    <SwiperSlide key={data.id} className='bg-white rounded-3xl block '>
                        <div className='w-full flex flex-col items-center justify-center'>
                            <div className='bg-blue w-[20px] h-[20px] shadow-md shadow-gray-500 '>
                                <Image src={data.image} width={100} height={100} alt='client' className='rounded-full h-full w-full object-center object-cover' />
                            </div>
                            <h1>{data.name}</h1>
                            <p>{data.review}</p>
                        </div>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    </div>
  )
}

export default TestimonialSlider