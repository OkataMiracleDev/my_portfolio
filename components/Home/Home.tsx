import React from 'react'
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'

const Home = () => {
  return (
    <div className='overflow-hidden lg:px-32 lg:border-l-1 lg:border-r-1 border-gray-400'>
      <Hero />
      <Projects />
    </div>
  )
}

export default Home