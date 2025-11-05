"use client";
import React, { useState } from "react";
import { ImHtmlFive2 } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript, IoLogoReact } from "react-icons/io5";
import { SiTypescript, SiGooglegemini } from "react-icons/si";
import { RiNextjsFill, RiOpenaiFill } from "react-icons/ri";
import { FaGit, FaGithub } from "react-icons/fa";
import { FaNode } from "react-icons/fa";

const Stack = () => {
  // store index of the active icon
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const icons = [
    ImHtmlFive2,
    DiCss3,
    SiTailwindcss,
    IoLogoJavascript,
    SiTypescript,
    RiNextjsFill,
    IoLogoReact,
    FaGit,
    FaGithub,
    SiGooglegemini,
    RiOpenaiFill,
    FaNode,
  ];

  return (
    <div
      data-aos="fade-up"
      className="relative w-full mt-[7rem] md:mt-[9rem] lg:mt-[10rem] 2xl:mt-[9rem] flex flex-col justify-center items-center"
    >
      {/* background text */}
      <p className="absolute z-0 font-[Bungee_Inline] text-center text-8xl md:text-9xl opacity-20 select-none">
        My <br /> stack
      </p>

      {/* icons */}
      <div className="z-10 backdrop-blur-sm bg-[#6c628f33] shadow-md shadow-gray-400 rounded-xl p-4 grid grid-cols-3 gap-4">
        {icons.map((Icon, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)} // set clicked icon
            className={`cursor-pointer rounded-lg px-6 py-3 shadow-md transition-colors duration-300 flex justify-center items-center
              ${
                activeIndex === i
                  ? "bg-blue-200 text-gray-600 shadow-gray-500" // active look
                  : "bg-white text-black shadow-gray-300 hover:bg-blue-200 hover:text-gray-600 hover:shadow-gray-500"
              }`}
          >
            <Icon
              className={`text-2xl ${Icon === RiOpenaiFill ? "scale-90" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stack;
