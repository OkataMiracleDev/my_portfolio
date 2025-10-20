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
  metadataBase: new URL("https://okata-miracle-portfolio.vercel.app"), // replace with your domain
  alternates: {
    canonical: "https://okata-miracle-portfolio.vercel.app",
  },
  openGraph: {
    title: "Okata Miracle | Software Engineer & Front-End Developer",
    description:
      "Creative software engineer focused on building fast, modern, and visually engaging digital experiences.",
    url: "ata-miracle-portfolio.vercel.app",
    siteName: "Okata Miracle Portfolio",
    images: [
      {
        url: "https://okata-miracle-portfolio.vercel.app/og-image.png", // replace with your OG image path
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
    images: ["https://okata-miracle-portfolio.vercel.app/og-image.png"],
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
      url: "https://okata-miracle-portfolio.vercel.app",
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
      <head>
        {/* <!-- Hotjar Tracking Code for https://okata-miracle-portfolio.vercel.app/ --> */}
        <script>
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6551167,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        </script>
        <body       style={{
        background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #9c9de300 100%)",
      }}
        className={`${popp.className} ${bun.className} ${grav.className} antialiased md:flex md:flex-col md:items-center`}>
          <Nav />
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </head>
    </html>
  );
}

