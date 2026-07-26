"use client"
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'
import About from './About/About'
import HomeProjects from './HomeProjects/HomeProjects'
import Stack from './Stack/Stack'
import Experience from './Experience/Experience'
import Testimonials from './Testimonials/Testimonials'
import Contact from './Contact/Contact'
import Footer from './Footer/Footer'
import type { devProjects, experienceEntries } from '@/lib/db/schema'
import type { TestimonialContent } from '@/types/content'

type DevProject = typeof devProjects.$inferSelect
type ExperienceEntry = typeof experienceEntries.$inferSelect
type Testimonial = TestimonialContent

interface HomeProps {
  allDevProjects: DevProject[]
  featuredDevProjects: DevProject[]
  experienceEntries: ExperienceEntry[]
  testimonials: Testimonial[]
}

const Home = ({ allDevProjects, featuredDevProjects, experienceEntries, testimonials }: HomeProps) => {
  return (
    <>
      <div className='min-h-screen overflow-x-hidden md:overflow-x-auto'>
        <Hero />
        <Projects projects={allDevProjects} />
        <About />
        <HomeProjects projects={featuredDevProjects} />
        <Stack />
        <Experience entries={experienceEntries} />
        <Testimonials testimonials={testimonials} />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default Home
