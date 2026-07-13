import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cabinetGrotesk, generalSans } from "@/lib/fonts";
import "./globals.css";
import Nav from "@/components/Home/Navbar/Nav";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Okata Miracle | Frontend Developer & Creative Technologist",
  description:
    "Okata Miracle — a creative frontend developer crafting premium, interactive web experiences with modern JavaScript frameworks and cutting-edge animations.",
  keywords: [
    "Okata Miracle",
    "Frontend Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "GSAP Animations",
    "Portfolio",
  ],
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Okata Miracle",
  metadataBase: new URL("https://www.okata-miracle.site"),
  alternates: {
    canonical: "https://www.okata-miracle.site",
  },
  openGraph: {
    title: "Okata Miracle | Frontend Developer & Creative Technologist",
    description:
      "Creative frontend developer focused on building premium, interactive digital experiences with smooth animations.",
    url: "https://www.okata-miracle.site",
    siteName: "Okata Miracle Portfolio",
    images: [
      {
        url: "https://www.okata-miracle.site/og-image.png",
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
    title: "Okata Miracle | Frontend Developer & Creative Technologist",
    description:
      "Crafting premium interactive web experiences with Next.js, React, and GSAP.",
    creator: "@mimi_codes",
    images: ["https://www.okata-miracle.site/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${generalSans.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Okata Miracle",
              jobTitle: "Frontend Developer",
              url: "https://www.okata-miracle.site",
              sameAs: [
                "https://github.com/OkataMiracleDev",
                "https://twitter.com/mimi_codes",
              ],
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-space-grotesk)" }}>
        <ThemeToggle />
        <Nav />
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'oklch(0.22 0.04 285)',
              color: 'oklch(0.98 0.01 285)',
              border: '1px solid oklch(0.35 0.05 285 / 0.3)',
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
