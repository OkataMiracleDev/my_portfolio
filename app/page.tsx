import Home from '@/components/Home/Home'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Projects | Okata Miracle - Front-End Developer",
  description: "Explore Okata Miracle’s latest projects built with Next.js, React, and TailwindCSS.",
};


const HomePage = () => {
  return (
    <div className=''>
      <Home />
    </div>
  )
}

export default HomePage