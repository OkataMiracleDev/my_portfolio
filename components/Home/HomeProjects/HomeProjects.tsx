import SectionHeading from "@/components/Helper/SectionHeading";
import { homeprojectsData } from "@/data/data";
import React from "react";
import ProjectsCard from "./ProjectsCard";
import Link from "next/link";

const HomeProjects = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="relative w-full mt-[105rem] md:mt-[100rem] lg:mt-[123rem] 2xl:mt-[109rem] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10"
    >
      <SectionHeading heading="Here&apos;s A Bit of What I&apos;ve Worked On!" />

      {/* Projects Grid */}
      <div className="mx-auto mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 justify-items-center">
        {homeprojectsData.map((data) => (
          <div key={data.id} className="w-full max-w-[400px]">
            <ProjectsCard projects={data} />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <Link
        href="/projects"
        className="mt-[4rem] transition-all duration-500 ease-in-out text-gray-900 hover:text-gray-300 font-bold text-base flex flex-row justify-center gap-1 hover:gap-3 bg-gray-300 hover:bg-gray-900 py-3 px-4 md:px-8 lg:px-4 rounded-2xl shadow-md shadow-gray-400 hover:shadow-blue-200"
      >
        <p>View All</p>
        <p>&rarr;</p>
      </Link>
    </div>
  );
};

export default HomeProjects;
