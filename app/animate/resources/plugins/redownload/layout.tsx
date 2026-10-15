import type { Metadata } from "next";

// The page itself is a client component and can't export metadata, so the
// noindex lives here. It's a utility form for past buyers, not a landing page.
export const metadata: Metadata = {
  title: "Re-download a plugin | Okata Studios",
  robots: { index: false, follow: true },
};

export default function RedownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
