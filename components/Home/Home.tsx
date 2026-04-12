"use client"
import React, { useEffect } from 'react'
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'
import About from './About/About'
import HomeProjects from './HomeProjects/HomeProjects'
import Stack from './Stack/Stack'
import Experience from './Experience/Experience'
import Testimonials from './Testimonials/Testimonials'
import Contact from './Contact/Contact'
import Footer from './Footer/Footer'
import SplashScreen from '../SplashScreen'
import AOS from 'aos';
import 'aos/dist/aos.css'; 

const Home = () => {
  useEffect(()=>{
    const initAOS = async()=>{
      await import('aos');
      AOS.init({
        duration:600,
        easing:'ease-out',
        once:true,
        anchorPlacement: "top-bottom",
      });
    }
    initAOS();
  }, [])
  
  return (
    <>
      <SplashScreen />
      <div className='min-h-screen overflow-x-hidden md:overflow-x-auto'>
        <Hero />
        <Projects />
        <About />
        <HomeProjects />
        <Stack />
        <Experience />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default Home
