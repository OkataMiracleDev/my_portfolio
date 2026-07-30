import AnimateNav from "@/components/Animate/AnimateNav";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function AnimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("animate");

  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <AnimateNav />
      {children}
    </div>
  );
}
