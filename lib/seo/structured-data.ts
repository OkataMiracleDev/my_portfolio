import { CONTACT_EMAIL, SAME_AS, SITE_URL, STUDIO_LOCATION, absoluteUrl } from "@/lib/site";

/**
 * schema.org entities for the studio and the person behind it.
 *
 * Each has a stable `@id`, so every page that mentions the studio or
 * Miracle points at the *same* node instead of declaring a fresh, slightly
 * different one. That's what lets search engines merge "Okata Studios" on
 * the home page, the founder on /animate and the creator of a case study
 * into one entity with one location — which is the whole basis for
 * showing up as *the* motion designer in Nigeria rather than a stray mention.
 *
 * Everything asserted here is already on the site in visible form
 * (location, services, contact). Structured data that claims things the
 * page doesn't is ignored at best and treated as spam at worst.
 */

export const STUDIO_ID = `${SITE_URL}/#studio`;
export const PERSON_ID = `${SITE_URL}/#miracle`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const address = {
  "@type": "PostalAddress",
  addressLocality: STUDIO_LOCATION.locality,
  addressRegion: STUDIO_LOCATION.region,
  addressCountry: STUDIO_LOCATION.countryCode,
};

// Who the studio sells to. Nigeria first, then the continent, then
// everywhere — remote work is a real part of the business, and the site
// already says "working anywhere".
const areaServed = [
  { "@type": "Country", name: "Nigeria" },
  // Where most Nigerian commissioning happens. Listed as areas *served*,
  // not locations: the studio is in Port Harcourt and works with these
  // cities remotely, the same way it works with everywhere else.
  { "@type": "City", name: "Port Harcourt" },
  { "@type": "City", name: "Lagos" },
  { "@type": "City", name: "Abuja" },
  { "@type": "Place", name: "Africa" },
  { "@type": "Place", name: "Worldwide" },
];

const KNOWS_ABOUT = [
  "Motion design",
  "Motion graphics",
  "2D animation",
  "Brand animation",
  "Logo animation",
  "Explainer videos",
  "SaaS product videos",
  "Advertising video",
  "UI animation",
  "Micro-interactions",
  "Kinetic typography",
  "Short-form video",
  "Adobe After Effects",
];

// The three service lines on /animate (components/Animate/ServicesBoard.tsx)
// plus the SaaS ad work the briefs and portal are built around.
const SERVICES = [
  {
    name: "Brand animation",
    description: "Logo reveals, brand intros and outros, and motion identity systems.",
  },
  {
    name: "UI animation and micro-interactions",
    description: "Interface transitions, button states and loading sequences for apps and websites.",
  },
  {
    name: "Explainer and short-form video",
    description: "Explainer videos, kinetic typography, and short-form video for social platforms.",
  },
  {
    name: "SaaS and product advertisements",
    description: "Performance ad videos and launch films for software products.",
  },
];

export function studioNode() {
  return {
    "@type": "ProfessionalService",
    "@id": STUDIO_ID,
    name: "Okata Studios",
    description:
      "Motion design studio in Port Harcourt, Nigeria — brand animation, SaaS ads, explainer and short-form video for brands across Nigeria, Africa and worldwide.",
    url: absoluteUrl("/animate"),
    logo: absoluteUrl("/okata-logo.png"),
    image: absoluteUrl("/og-image.png"),
    email: CONTACT_EMAIL,
    address,
    areaServed,
    knowsAbout: KNOWS_ABOUT,
    founder: { "@id": PERSON_ID },
    sameAs: SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Motion design services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: "Motion design",
          provider: { "@id": STUDIO_ID },
          areaServed,
        },
      })),
    },
  };
}

export function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Okata Miracle",
    // The site uses both orders (the hero alt text is "Miracle Okata").
    alternateName: "Miracle Okata",
    jobTitle: ["Motion Designer", "Frontend Developer"],
    description: "Motion designer and frontend developer based in Port Harcourt, Nigeria.",
    url: SITE_URL,
    image: absoluteUrl("/images/Miracle_Okata.jpg"),
    email: CONTACT_EMAIL,
    worksFor: { "@id": STUDIO_ID },
    homeLocation: {
      "@type": "Place",
      name: `${STUDIO_LOCATION.locality}, ${STUDIO_LOCATION.country}`,
      address,
    },
    knowsAbout: KNOWS_ABOUT,
    sameAs: SAME_AS,
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Okata Studios",
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@id": STUDIO_ID },
  };
}

/** One JSON-LD document holding several linked nodes. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqNode(entries: FaqEntry[]) {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
