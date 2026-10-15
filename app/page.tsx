import type { Metadata } from "next";
import Landing from "@/components/Landing/Landing";
import JsonLd from "@/components/Shared/JsonLd";
import { graph, personNode, studioNode, websiteNode } from "@/lib/seo/structured-data";
import { getFunFactCards } from "@/lib/data/public";
import { recordVisit } from "@/lib/analytics/record-visit";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Okata Studios | Motion Designer & Developer in Nigeria",
  description:
    "Motion designer and frontend developer in Port Harcourt, Nigeria — brand animation, explainer videos and web interfaces for teams across Africa and worldwide.",
  openGraph: {
    title: "Okata Studios | Motion Designer & Developer in Nigeria",
    description:
      "Motion designer and frontend developer in Port Harcourt, Nigeria. Explore motion reels, dev work and free resources.",
    url: SITE_URL,
    siteName: "Okata Studios",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Okata Studios — motion designer and frontend developer in Port Harcourt, Nigeria",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okata Studios | Motion Designer & Developer in Nigeria",
    description: "Motion designer and frontend developer in Port Harcourt, Nigeria.",
    creator: "@mimi_codes",
    images: [absoluteUrl("/og-image.png")],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function LandingPage() {
  await recordVisit("landing");
  const funFactCards = await getFunFactCards();

  return (
    <>
      {/* The studio, Miracle and the site as one linked graph — see
          lib/seo/structured-data.ts for why they share stable @ids. */}
      <JsonLd data={graph(studioNode(), personNode(), websiteNode())} />
      <Landing funFactCards={funFactCards} />
    </>
  );
}
