import type { Metadata } from "next";
import AnimateHero from "@/components/Animate/AnimateHero";
import PlaygroundBay from "@/components/Animate/PlaygroundBay";
import { PlaygroundRevealProvider } from "@/components/Animate/Playground/PlaygroundRevealContext";
import ReelFrame from "@/components/Animate/ReelFrame";
import ServicesBoard from "@/components/Animate/ServicesBoard";
import ReelIndex from "@/components/Animate/ReelIndex";
import SpecSheet from "@/components/Animate/SpecSheet";
import OperatorSection from "@/components/Animate/OperatorSection";
import AnimateTestimonials from "@/components/Animate/AnimateTestimonials";
import ResourcesTeaser from "@/components/Animate/ResourcesTeaser";
import AnimateContact from "@/components/Animate/AnimateContact";
import AnimateFooter from "@/components/Animate/AnimateFooter";
import {
  getFeaturedMotionProjects,
  getTestimonials,
  getResources,
  getAnimateCredentials,
  getStudioPlugins,
} from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Okata Studios | Motion Designer — Brand Animation & GSAP",
  description:
    "Motion design by Okata Studios — brand animation, UI micro-interactions, short-form video, plus free resources for the motion design community.",
  openGraph: {
    title: "Okata Studios | Motion Designer",
    description: "Brand animation, UI micro-interactions, and free motion design resources.",
    url: "https://www.okata-miracle.site/animate",
    siteName: "Okata Studios",
    images: [{ url: "https://www.okata-miracle.site/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okata Studios | Motion Designer",
    description: "Brand animation, UI micro-interactions, and short-form video.",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate",
  },
};

export default async function AnimatePage() {
  const [featuredMotionProjects, testimonials, resources, credentials, studioPlugins] =
    await Promise.all([
      getFeaturedMotionProjects(),
      getTestimonials("animate"),
      getResources(),
      getAnimateCredentials(),
      getStudioPlugins(),
    ]);

  return (
    <PlaygroundRevealProvider>
      <AnimateHero />
      {/* Collapsed to zero height until the hero's toggle is pressed. It sits
          here, directly under that control, so flipping the switch produces a
          visible result on the same screen rather than somewhere below the
          fold. */}
      <PlaygroundBay />
      <ReelFrame featured={featuredMotionProjects[0]} />
      <ServicesBoard />
      <ReelIndex projects={featuredMotionProjects} />
      <SpecSheet credentials={credentials} />
      <OperatorSection />
      <AnimateTestimonials testimonials={testimonials} />
      <ResourcesTeaser resources={resources} studioPlugins={studioPlugins} />
      <AnimateContact />
      <AnimateFooter />
    </PlaygroundRevealProvider>
  );
}
