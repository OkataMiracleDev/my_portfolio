import type { Metadata } from "next";
import Landing from "@/components/Landing/Landing";
import { getFunFactCards } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Okata Miracle | Frontend Developer & Motion Designer",
  description:
    "Okata Miracle builds interfaces as a frontend developer and brings them to life as a motion designer. Explore dev work, motion reels, and free resources.",
  openGraph: {
    title: "Okata Miracle | Frontend Developer & Motion Designer",
    description:
      "Frontend developer and motion designer. Explore dev work, motion reels, and free resources.",
    url: "https://www.okata-miracle.site",
    siteName: "Okata Miracle",
    images: [
      {
        url: "https://www.okata-miracle.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Okata Miracle - Frontend Developer & Motion Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okata Miracle | Frontend Developer & Motion Designer",
    description: "Frontend developer and motion designer.",
    creator: "@mimi_codes",
    images: ["https://www.okata-miracle.site/og-image.png"],
  },
  alternates: {
    canonical: "https://www.okata-miracle.site",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Okata Miracle",
  jobTitle: ["Frontend Developer", "Motion Designer"],
  url: "https://www.okata-miracle.site",
  sameAs: [
    "https://github.com/OkataMiracleDev",
    "https://twitter.com/mimi_codes",
  ],
};

export default async function LandingPage() {
  const funFactCards = await getFunFactCards();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Landing funFactCards={funFactCards} />
    </>
  );
}
