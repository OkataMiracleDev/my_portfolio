import Nav from "@/components/Home/Navbar/Nav";
import MimiLogo from "@/components/Shared/MimiLogo";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("build");

  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <MimiLogo className="fixed left-4 top-4 z-[10000] md:left-6 md:top-6" />
      <Nav />
      {children}
    </div>
  );
}
