import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='relative group w-full max-w-md'>
      <div className='rounded-card bg-base-raised p-6 transform rotate-2 transition-all duration-500 ease-out group-hover:rotate-0 hover:scale-105'>
        <div className='relative aspect-[3/4] w-full'>
          <Image
            src={"/images/3.jpg"}
            fill
            alt="mimi_codes"
            className='object-cover rounded-xl'
          />
        </div>
        <p className='text-center mt-6 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-build'>
          @mimi_codes
        </p>
      </div>

      <div className='absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-accent-build opacity-30 blur-3xl -z-10' />
      <div className='absolute -top-6 -left-6 w-40 h-40 rounded-full bg-accent-build opacity-20 blur-3xl -z-10' />
    </div>
  )
}

export default PhotoCollage
