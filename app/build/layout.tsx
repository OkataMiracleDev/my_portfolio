import Nav from "@/components/Home/Navbar/Nav";
import OkataLogo from "@/components/Shared/OkataLogo";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("build");

  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <div className="fixed left-6 top-6 z-[10000] hidden md:block">
        <OkataLogo />
      </div>
      <Nav />
      {children}
    </div>
  );
}
