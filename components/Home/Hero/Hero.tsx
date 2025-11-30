"use client";
import Modal from "@/components/Helper/Modal";
import Image from "next/image";
import React, { useState } from "react";
import Contact from "../Contact/Contact";

const Hero = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="relative h-[50vh] top-[10rem]" id="home">
      <div className="relative w-full h-full text-[#22025a] font-[poppins] font-bold text-3xl md:text-6xl gap-4 md:gap-7 flex flex-col justify-center items-center">
        <div className="bg-green-300 border-2 border-green-400 w-5 h-5 md:w-8 md:h-8 rounded-full absolute top-[52%] left-[65%] md:top-[46%] md:left-[57%] xl:top-[40%] xl:left-[57.4%] "></div>
        <Image
          src="/images/Miracle_Okata.jpg"
          alt="character"
          width={200}
          height={200}
          className="rounded-full"
        />
        <h1 data-aos="fade-up">Hi. I&apos;m mimi</h1>
        <h1 data-aos="fade-up">FrontEnd Developer</h1>
      </div>

      <button
        onClick={() => setOpenModal(true)}
        className="hire-me-btn font-[poppins] font-medium text-white backdrop-blur-sm bg-[#5a3b5e4b] shadow-md shadow-gray-500 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 flex absolute top-[20%] md:left-[60%] left-[70%] lg:left-[60%] xl:top-[18%] xl:left-[59%] translate-x-[-50%]"
      >
        Hire Me!
      </button>

      {/* Modal Section */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <Contact />
      </Modal>
    </div>
  );
};

export default Hero;
