import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='relative group w-full max-w-md'>
      <div className='card p-6 transform rotate-2 group-hover:rotate-0 transition-all duration-500 hover:scale-105'>
        <div className='relative aspect-[3/4] w-full'>
          <Image 
            src={"/images/3.jpg"} 
            fill
            alt="mimi_codes"  
            className='object-cover rounded-xl'
          />
        </div>
        <p 
          className='text-center mt-6 font-mono text-sm font-bold'
          style={{ color: 'var(--color-accent-bright)' }}
        >
          @mimi_codes
        </p>
      </div>
      
      {/* Decorative elements */}
      <div 
        className='absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-40 -z-10'
        style={{ background: 'oklch(0.65 0.25 285)' }}
      />
      <div 
        className='absolute -top-6 -left-6 w-40 h-40 rounded-full blur-3xl opacity-30 -z-10'
        style={{ background: 'oklch(0.55 0.22 270)' }}
      />
    </div>
  )
}

export default PhotoCollage
