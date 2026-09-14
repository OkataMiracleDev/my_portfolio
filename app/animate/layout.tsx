import AnimateNav from "@/components/Animate/AnimateNav";
import OkataLogo from "@/components/Shared/OkataLogo";
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
        <OkataLogo />
      </div>
      <AnimateNav />
      {children}
    </div>
  );
}
