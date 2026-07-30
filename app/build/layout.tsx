import Nav from "@/components/Home/Navbar/Nav";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("build");

  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <Nav />
      {children}
    </div>
  );
}
