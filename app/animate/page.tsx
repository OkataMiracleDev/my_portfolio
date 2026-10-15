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
import AnimateFaq from "@/components/Animate/AnimateFaq";
import JsonLd from "@/components/Shared/JsonLd";
import { breadcrumbNode, graph, personNode, studioNode, websiteNode } from "@/lib/seo/structured-data";
import AnimateFooter from "@/components/Animate/AnimateFooter";
import {
  getFeaturedMotionProjects,
  getTestimonials,
  getResources,
  getAnimateCredentials,
  getStudioPlugins,
} from "@/lib/data/public";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Leads with the phrase people actually search ("motion designer in
  // Nigeria") rather than the brand, which nobody looking for a motion
  // designer knows yet. The country rather than the city because far more
  // people search it; Port Harcourt still appears, because it's true and it
  // wins the city searches outright.
  title: "Motion Designer in Nigeria — Port Harcourt | Okata Studios",
  description:
    "Motion design studio in Port Harcourt, Nigeria — brand animation, SaaS ads, explainer and short-form video for brands across Nigeria, Africa and worldwide.",
  openGraph: {
    title: "Motion Designer in Nigeria | Okata Studios",
    description:
      "Brand animation, SaaS ads, explainer and short-form video — from a Port Harcourt studio working with teams across Africa and worldwide.",
    url: absoluteUrl("/animate"),
    siteName: "Okata Studios",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motion Designer in Nigeria | Okata Studios",
    description: "Brand animation, SaaS ads, explainer and short-form video, made in Port Harcourt.",
  },
  alternates: {
    canonical: absoluteUrl("/animate"),
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
      {/* /animate is the page meant to rank for "motion designer in
          Nigeria / Africa", so it carries the full studio entity, not just
          the home page. */}
      <JsonLd
        data={graph(
          studioNode(),
          personNode(),
          websiteNode(),
          breadcrumbNode([
            { name: "Okata Studios", path: "/" },
            { name: "Motion design", path: "/animate" },
          ])
        )}
      />
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
      <AnimateFaq />
      <AnimateContact />
      <AnimateFooter />
    </PlaygroundRevealProvider>
  );
}
