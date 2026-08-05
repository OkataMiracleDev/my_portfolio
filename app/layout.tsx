import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { cabinetGrotesk, generalSans } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mimi Studios",
  description: "Mimi Studios — motion design and frontend development, built on intention.",
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Mimi Studios",
  metadataBase: new URL("https://www.okata-miracle.site"),
  icons: {
    icon: "/favicon.svg",
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
