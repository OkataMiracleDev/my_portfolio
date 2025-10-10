import React from 'react'
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'
import About from './About/About'

const Home = () => {
  return (
    <div className='overflow-hidden lg:px-32 h-[600vh] lg:border-l-1 lg:border-r-1 border-gray-300'>
      <Hero />
      <Projects />
      <About />
    </div>
  )
}

export default Home