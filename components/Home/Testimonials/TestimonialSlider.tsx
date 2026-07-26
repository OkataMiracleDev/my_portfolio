"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from "swiper/modules"
import Image from 'next/image';
import type { TestimonialContent } from '@/types/content';

type Testimonial = TestimonialContent;

const TestimonialSlider = ({ testimonials }: { testimonials: Testimonial[] }) => {
  return (
    <div className='w-full max-w-xl'>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className='w-full h-[450px] md:h-[400px]'
      >
        {testimonials.map((data, index) => {
          return (
            <SwiperSlide
              key={data.id}
              className='rounded-card bg-base-raised'
            >
              <div className='h-full py-10 px-8 flex flex-col items-center justify-center text-center relative'>
                <div className='relative w-24 h-24 mb-6'>
                  <div className='absolute inset-0 rounded-full bg-accent-build opacity-30 blur-xl' />
                  <Image
                    src={data.avatar}
                    width={96}
                    height={96}
                    alt={data.name}
                    className='relative rounded-full w-full h-full object-cover border-[3px] border-accent-build'
                  />
                </div>

                <h3 className='font-bold text-lg text-ink mb-6'>
                  {data.name}
                </h3>

                <p className='text-sm leading-relaxed text-ink/70'>
                  &quot;{data.quote}&quot;
                </p>

                <div className='absolute top-6 right-6 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink opacity-30'>
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
