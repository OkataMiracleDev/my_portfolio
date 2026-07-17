import type { Metadata } from "next";
import AnimateHero from "@/components/Animate/AnimateHero";
import InteractivePlayground from "@/components/Animate/Playground/InteractivePlayground";
import CapabilitiesStrip from "@/components/Animate/CapabilitiesStrip";
import FeaturedWork from "@/components/Animate/FeaturedWork";
import AnimateTestimonials from "@/components/Animate/AnimateTestimonials";
import ResourcesTeaser from "@/components/Animate/ResourcesTeaser";
import HireCta from "@/components/Animate/HireCta";
import AnimateFooter from "@/components/Animate/AnimateFooter";

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

export default function AnimatePage() {
  return (
    <>
      <AnimateHero />
      <InteractivePlayground />
      <CapabilitiesStrip />
      <FeaturedWork />
      <AnimateTestimonials />
      <ResourcesTeaser />
      <HireCta />
      <AnimateFooter />
    </>
  );
}
