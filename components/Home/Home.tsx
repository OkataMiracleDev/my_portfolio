import React from 'react'
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'
import About from './About/About'
import HomeProjects from './HomeProjects/HomeProjects'

const Home = () => {
  return (
    <div className='overflow-hidden flex flex-col h-[600vh] lg:border-l-1 lg:border-r-1 border-gray-300'>
      <Hero />
      <Projects />
      <About />
      <HomeProjects />
    </div>
  )
}

export default Home