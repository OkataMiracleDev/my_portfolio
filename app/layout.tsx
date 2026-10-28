import type { Metadata } from "next";
import { cabinetGrotesk, generalSans, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Okata Studios — Motion Designer in Nigeria",
  description:
    "Okata Studios is a motion design studio in Port Harcourt, Nigeria — brand animation, explainer and SaaS ads, and short-form video for teams across Africa and worldwide.",
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Okata Studios",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/okata-favicon.png",
    shortcut: "/okata-favicon.png",
    apple: "/okata-icon.png",
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
      className={`${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${generalSans.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-[family-name:var(--font-general-sans)]">
        <SmoothScroll />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#161619',
              color: '#F4F3EF',
              border: '1px solid #2A2A2E',
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
