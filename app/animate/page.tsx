import type { Metadata } from "next";
import AnimateHero from "@/components/Animate/AnimateHero";
import { PlaygroundRevealProvider } from "@/components/Animate/Playground/PlaygroundRevealContext";
import CapabilitiesStrip from "@/components/Animate/CapabilitiesStrip";
import FeaturedWork from "@/components/Animate/FeaturedWork";
import AnimateTestimonials from "@/components/Animate/AnimateTestimonials";
import ResourcesTeaser from "@/components/Animate/ResourcesTeaser";
import Contact from "@/components/Home/Contact/Contact";
import AnimateFooter from "@/components/Animate/AnimateFooter";
import { getFeaturedMotionProjects, getTestimonials, getResources } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Okata Miracle | Motion Designer",
  description:
    "Motion design by Okata Miracle — brand animation, UI micro-interactions, short-form video, plus free resources for the motion design community.",
  openGraph: {
    title: "Okata Miracle | Motion Designer",
    description: "Brand animation, UI micro-interactions, and free motion design resources.",
    url: "https://www.okata-miracle.site/animate",
    siteName: "Okata Miracle",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate",
  },
};

export default async function AnimatePage() {
  const [featuredMotionProjects, testimonials, resources] = await Promise.all([
    getFeaturedMotionProjects(),
    getTestimonials("animate"),
    getResources(),
  ]);

  return (
    <PlaygroundRevealProvider>
      <AnimateHero />
      <CapabilitiesStrip />
      <FeaturedWork projects={featuredMotionProjects} />
      <AnimateTestimonials testimonials={testimonials} />
      <ResourcesTeaser resources={resources} />
      <Contact mode="animate" />
      <AnimateFooter />
    </PlaygroundRevealProvider>
  );
}
