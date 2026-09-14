import AnimateNav from "@/components/Animate/AnimateNav";
import { recordVisit } from "@/lib/analytics/record-visit";

export default async function AnimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await recordVisit("animate");

  return (
    // okata-grain hangs a fixed, click-through noise layer over the whole
    // route. Fixed rather than absolute on purpose: attached to a scrolling
    // container a noise texture repaints every single frame.
    // The logomark used to sit here as a second fixed element in the top-left;
    // it now lives inside the nav pill, so there is only one floating object.
    <div className="okata-grain relative min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <AnimateNav />
      {children}
    </div>
  );
}
