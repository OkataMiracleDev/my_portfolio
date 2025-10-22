import type { Metadata } from "next";
import { DM_Sans, Poppins , Bungee_Inline } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Home/Navbar/Nav";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const popp = Poppins({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ["latin"],
});

const bun = Bungee_Inline({
  weight: '400', 
  subsets: ['latin'],
  display: 'swap', 
});

const grav = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Okata Miracle | Software Engineer & Front-End Developer",
  description:
    "Okata Miracle — a creative software engineer and front-end developer crafting interactive, high-performance web experiences using modern JavaScript frameworks and technologies.",
  keywords: [
    "Okata Miracle",
    "Frontend Developer",
    "Software Engineer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Portfolio",
  ],
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Okata Miracle",
  metadataBase: new URL("https://www.okata-miracle.site"), // replace with your domain
  alternates: {
    canonical: "https://www.okata-miracle.site",
  },
  openGraph: {
    title: "Okata Miracle | Software Engineer & Front-End Developer",
    description:
      "Creative software engineer focused on building fast, modern, and visually engaging digital experiences.",
    url: "https://www.okata-miracle.site",
    siteName: "Okata Miracle Portfolio",
    images: [
      {
        url: "https://www.okata-miracle.site", // replace with your OG image path
        width: 1200,
        height: 630,
        alt: "Okata Miracle - Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okata Miracle | Software Engineer & Front-End Developer",
    description:
      "Crafting interactive web experiences with Next.js, React, and TailwindCSS.",
    creator: "mimi_codes", // if you have a Twitter/X handle
    images: ["https://www.okata-miracle.site"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Okata Miracle",
      jobTitle: "Software Engineer",
      url: "https://www.okata-miracle.site",
      sameAs: [
        "https://github.com/OkataMiracleDev",
        "https://twitter.com/mimi_codes",
      ],
    }),
  }}
/>


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body       style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #9c9de300 100%)",
    }}
      className={`${popp.className} ${bun.className} ${grav.className} antialiased md:flex md:flex-col md:items-center`}>
        <Nav />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}

