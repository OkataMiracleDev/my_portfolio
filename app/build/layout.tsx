import Nav from "@/components/Home/Navbar/Nav";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <Nav />
      {children}
    </div>
  );
}
