"use client";

import Hero from "./Hero/Hero";
import Projects from "./Projects/Projects";
import HomeProjects from "./HomeProjects/HomeProjects";
import Stack from "./Stack/Stack";
import Experience from "./Experience/Experience";
import About from "./About/About";
import Testimonials from "./Testimonials/Testimonials";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import type { devProjects, experienceEntries } from "@/lib/db/schema";
import type { TestimonialContent } from "@/types/content";
import type { StackVersion } from "@/lib/stack-versions";

type DevProject = typeof devProjects.$inferSelect;
type ExperienceEntry = typeof experienceEntries.$inferSelect;

interface HomeProps {
  allDevProjects: DevProject[];
  featuredDevProjects: DevProject[];
  experienceEntries: ExperienceEntry[];
  testimonials: TestimonialContent[];
  stack: StackVersion[];
}

/**
 * Section order mirrors /animate: open, show the work, show the toolchain and
 * the track record, then the person, then proof, then the ask. About moved
 * below the work deliberately -- nobody cares who you are until they have seen
 * what you made.
 */
export default function Home({
  allDevProjects,
  featuredDevProjects,
  experienceEntries,
  testimonials,
  stack,
}: HomeProps) {
  return (
    <div className="overflow-x-hidden">
      <Hero stack={stack} />
      <Projects projects={allDevProjects} />
      <HomeProjects projects={featuredDevProjects} />
      <Stack />
      <Experience entries={experienceEntries} />
      <About />
      <Testimonials testimonials={testimonials} />
      <Contact />
      <Footer />
    </div>
  );
}
