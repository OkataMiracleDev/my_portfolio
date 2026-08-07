import AnimateNav from "@/components/Animate/AnimateNav";
import MimiLogo from "@/components/Shared/MimiLogo";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function AnimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("animate");

  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <div className="fixed left-6 top-6 z-[10000] hidden md:block">
        <MimiLogo />
      </div>
      <AnimateNav />
      {children}
    </div>
  );
}
