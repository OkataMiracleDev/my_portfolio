import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cabinetGrotesk, generalSans, bodoniModa } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
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
  title: "Okata Miracle",
  description: "Okata Miracle — frontend developer and motion designer.",
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Okata Miracle",
  metadataBase: new URL("https://www.okata-miracle.site"),
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${generalSans.variable} ${bodoniModa.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="font-[family-name:var(--font-space-grotesk)]">
        <SmoothScroll />
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
