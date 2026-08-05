import { Space_Grotesk, Inter } from "next/font/google";

// Mimi Studios rebrand: these two loaders keep their original CSS variable
// names (--font-cabinet-grotesk, --font-general-sans) but now load the
// brand guide's actual typefaces — Space Grotesk for display, Inter for
// body — so every existing font-[family-name:var(--font-cabinet-grotesk)]
// / --font-general-sans usage across the codebase picks up the new brand
// automatically, with no per-component edits needed. The old local
// Cabinet Grotesk / General Sans woff2 files and the Bodoni Moda script
// accent are no longer used (see globals.css / .impeccable.md history —
// the script-accent treatment was dropped along with the rebrand since the
// design language has no italic-serif concept).
export const cabinetGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export const generalSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-general-sans",
  display: "swap",
});
