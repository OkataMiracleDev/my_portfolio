"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/effect-cards';

import { EffectCards } from "swiper/modules"

const TestimonialSlider = () => {
  return (
    <div>
        <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className='md:w-[450px] h-[300px] md:h-[350px] w-[90%] ' >
            {testimonialData.map((data)=>{
                return (
                    <SwiperSlide key={data.id} className='bg-white rounded-3xl block '>

                    </SwiperSlide>
                )
            })}
        </Swiper>
    </div>
  )
}

export default TestimonialSlider