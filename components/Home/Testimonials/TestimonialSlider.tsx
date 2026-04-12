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
    <div className='w-full max-w-xl'>
      <Swiper 
        effect={'cards'} 
        grabCursor={true} 
        modules={[EffectCards]} 
        className='w-full h-[450px] md:h-[400px]'
      >
        {testimonialData.map((data, index) => {
          return (
            <SwiperSlide 
              key={data.id} 
              className='card'
            >
              <div className='h-full py-10 px-8 flex flex-col items-center justify-center text-center'>
                {/* Client image */}
                <div className='relative w-24 h-24 mb-6'>
                  <div 
                    className='absolute inset-0 rounded-full blur-xl opacity-50'
                    style={{ background: 'oklch(0.65 0.25 285)' }}
                  />
                  <Image 
                    src={data.image} 
                    width={96} 
                    height={96} 
                    alt={data.name}
                    className='relative rounded-full w-full h-full object-cover'
                    style={{ border: '3px solid oklch(0.65 0.25 285)' }}
                  />
                </div>

                {/* Client name */}
                <h3 
                  className='font-bold text-lg mb-6'
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {data.name}
                </h3>

                {/* Review */}
                <p className='body text-sm leading-relaxed'>
                  &quot;{data.review}&quot;
                </p>

                {/* Card number indicator */}
                <div 
                  className='absolute top-6 right-6 font-mono text-sm font-bold opacity-30'
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default TestimonialSlider
