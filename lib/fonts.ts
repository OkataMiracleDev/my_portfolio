import localFont from "next/font/local";

// Okata Studios rebrand: these two loaders keep their original CSS variable
// names (--font-cabinet-grotesk, --font-general-sans) but now load the
// brand guide's actual typefaces — Space Grotesk for display, Inter for
// body — so every existing font-[family-name:var(--font-cabinet-grotesk)]
// / --font-general-sans usage across the codebase picks up the new brand
// automatically, with no per-component edits needed. The old local
// Cabinet Grotesk / General Sans woff2 files and the Bodoni Moda script
// accent are no longer used (see globals.css / .impeccable.md history —
// the script-accent treatment was dropped along with the rebrand since the
// design language has no italic-serif concept).
//
// Self-hosted rather than next/font/google: the Google loader downloads the
// fonts at build time, and a malformed response from Google failed a Vercel
// deploy outright ("Cannot read properties of null (reading '1')" in
// next/font's loader). These are the same Google Fonts files (latin subset,
// variable), committed so the build never touches the network for them.
// The weight ranges match the weights the Google loaders used to request
// (JetBrains Mono asked for none, which meant its full variable range).
export const cabinetGrotesk = localFont({
  src: "../app/fonts/SpaceGrotesk-Variable-latin.woff2",
  weight: "500 700",
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../app/fonts/JetBrainsMono-Variable-latin.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const generalSans = localFont({
  src: "../app/fonts/Inter-Variable-latin.woff2",
  weight: "400 600",
  variable: "--font-general-sans",
  display: "swap",
});
