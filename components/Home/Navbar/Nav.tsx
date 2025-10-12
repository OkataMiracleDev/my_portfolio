"use client";
import { navLinks } from '@/constant/constant'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Nav = () => {

    const [navBg,setNavBg] = useState(false);

    useEffect(()=>{
        const handler =()=>{
          if(window.scrollY>=70) setNavBg(true);
          if(window.scrollY<70) setNavBg(false);
          };
          window.addEventListener('scroll', handler);
          return ()=> window.removeEventListener('scroll', handler);
    },[])

  return (
    <div className='fixed flex items-center justify-center w-full h-[16vh] md:h-[12vh] z-[10000]'>
        <div className={`${navBg?'backdrop-blur-sm bg-[#6c628f33] shadow-md shadow-gray-400' :  ' bg-black'} transition-all duration-300flex flex-col items-center justify-between w-fit px-4 md:px-6 py-3 md:py-2 rounded-full md:rounded-3xl`}>
            {/* NavLinks */}
            <div className='flex items-center space-x-4 md:space-x-16 h-full'>
              {navLinks.map((link)=>{
                return <Link href={link.url} key={link.id}>
                  <p className='grav text-lg md:text-xl text-white hover:text-gray-600 font-medium md:font-normal hover:font-medium w-fit hover:px-4 hover:py-2 hover:bg-blue-200 shadow-2xl hover:drop-shadow-md shadow-amber-200 drop-shadow-white rounded-2xl flex items-center justify-center transition-all duration-400 ease-in-out'>{link.label}</p>
                </Link>
              })}
              {/* Blog btn */}
              <a href="#">
                <button className='flex font-[poppins] font-medium md:font-normal text-base md:text-lg liquid-glass-2 text-white px-4 py-3 md:py-2 rounded-2xl items-center hover:px-8 justify-center transition-all duration-400 ease-in-out'>Blog</button>
              </a>
            </div>
            
        </div>
    </div>
  )
}

export default Nav