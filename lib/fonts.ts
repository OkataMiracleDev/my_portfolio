import localFont from "next/font/local";
import { Bodoni_Moda } from "next/font/google";

// The one deliberate script/serif accent — used only for a single emphasis
// word inside a headline (never body copy), paired against Cabinet
// Grotesk Bold for exactly the kind of bold-sans + italic-script contrast
// seen on kova.me. Not on the reflex-reject list (spec's font-selection
// procedure).
export const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: "600",
  style: "italic",
  variable: "--font-accent-script",
  display: "swap",
});

export const cabinetGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/CabinetGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});
