import type { Metadata } from "next";
import Landing from "@/components/Landing/Landing";
import JsonLd from "@/components/Shared/JsonLd";
import { getFunFactCards } from "@/lib/data/public";
import { recordVisit } from "@/lib/analytics/record-visit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mimi Studios | Frontend Developer & Motion Designer",
  description:
    "Mimi Studios builds interfaces as a frontend developer and brings them to life as a motion designer. Explore dev work, motion reels, and free resources.",
  openGraph: {
    title: "Mimi Studios | Frontend Developer & Motion Designer",
    description:
      "Frontend developer and motion designer. Explore dev work, motion reels, and free resources.",
    url: "https://www.okata-miracle.site",
    siteName: "Mimi Studios",
    images: [
      {
        url: "https://www.okata-miracle.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mimi Studios - Frontend Developer & Motion Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimi Studios | Frontend Developer & Motion Designer",
    description: "Frontend developer and motion designer.",
    creator: "@mimi_codes",
    images: ["https://www.okata-miracle.site/og-image.png"],
  },
  alternates: {
    canonical: "https://www.okata-miracle.site",
  },
};

const founderJsonLd = {
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mimi Studios",
  url: "https://www.okata-miracle.site",
  logo: "https://www.okata-miracle.site/mimi-logo.svg",
  description: "Mimi Studios — motion design and frontend development, built on intention, not decoration.",
  founder: { "@type": "Person", name: "Okata Miracle" },
};

export default async function LandingPage() {
  await recordVisit("landing");
  const funFactCards = await getFunFactCards();

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={founderJsonLd} />
      <Landing funFactCards={funFactCards} />
    </>
  );
}
