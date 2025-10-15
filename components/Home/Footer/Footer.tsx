import { footLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full flex justify-center items-center mt-[7rem] md:mt-[9rem] lg:mt-[10rem] 2xl:mt-[9rem] transition-all duration-400 '>
        <div className='w-[80%] md:w-[40%] flex flex-col justify-center items-center border-t border-gray-400 pt-10'>
            <p className='text-sm text-gray-600 font-light'>Copyright © 2025 Okata Miracle.</p>
            <div className='mt-4 flex space-x-5 px-2 md:px-1 md:py-0.5 md:space-x-10 h-full'>
              {footLinks.map((link)=>{
                return <Link href={link.url} key={link.id}>
                  <p className='text-gray-600 hover:text-gray-800'>{link.label}</p>
                </Link>
              })}
            </div>
        </div>
    </div>
  )
}

export default Footer