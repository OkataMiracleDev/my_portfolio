import AnimateNav from "@/components/Animate/AnimateNav";

export default function AnimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <AnimateNav />
      {children}
    </div>
  );
}
