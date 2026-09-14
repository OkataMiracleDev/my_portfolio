import StudioNav from "@/components/Shared/StudioNav";
import { recordVisit } from "@/lib/analytics/record-visit";

const LINKS = [
  { label: "Index", href: "/build" },
  { label: "Work", href: "/build/projects" },
  { label: "Writing", href: "/build/blog" },
];

export default async function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("build");

  return (
    // Same shell as /animate: one fixed grain layer, one floating nav, no
    // separate fixed logomark in the corner (it lives in the nav pill now).
    <div className="okata-grain relative min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <StudioNav
        links={LINKS}
        homeHref="/build"
        ctaHref="/build#contact"
        accent="build"
        ariaLabel="Build"
      />
      {children}
    </div>
  );
}
