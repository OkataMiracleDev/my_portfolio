"use client";
import Modal from '@/components/Helper/Modal';
import Image from 'next/image'
import React, { useState } from 'react'
import Contact from '../Contact/Contact';

const Hero = () => {

  const [openModal, setOpenModal] = useState(false);


  return (
    <div id='home' >
      <div className='relative w-full h-[90vh] text-[#22025a] font-[poppins] font-bold text-3xl md:text-6xl gap-4 md:gap-7 flex flex-col justify-center items-center'>
      <div className='bg-green-300 border-2 border-green-400 w-5 h-5 md:w-8 md:h-8 rounded-full absolute top-[53%] left-[61%] md:top-[45%] md:left-[59%] xl:top-[42%] xl:left-[57.4%] '></div>
        <Image src="/images/Miracle_Okata.jpg" alt="character" width={200} height={200} className='rounded-full' />
        <h1 data-aos="fade-up">Hi. I&apos;m mimi</h1>
        <h1 data-aos="fade-up">FrontEnd Developer</h1>
      </div>

      <button 
       onClick={() => setOpenModal(true)}
      className='hire-me-btn font-[poppins] font-medium text-white backdrop-blur-sm bg-[#5a3b5e4b] shadow-md shadow-gray-500 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 flex absolute top-[28%] md:top-[26%] md:left-[62%] left-[64%] lg:left-[60%] xl:left-[57%] translate-x-[-50%]'>Hire Me!</button>

      {/* Modal Section */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <Contact />
      </Modal>

     </div>
  )
}

export default Hero