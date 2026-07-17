import Nav from "@/components/Home/Navbar/Nav";
import ThemeToggle from "@/components/ThemeToggle";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeToggle />
      <Nav />
      {children}
    </>
  );
}
