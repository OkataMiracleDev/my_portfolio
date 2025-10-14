import type { Metadata } from "next";
import { DM_Sans, Poppins , Bungee_Inline } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Home/Navbar/Nav";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const popp = Poppins({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ["latin"],
});

const bun = Bungee_Inline({
  weight: '400', 
  subsets: ['latin'],
  display: 'swap', 
});

const grav = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Okata Miracle - Software Engineer | Front-End Developer",
  description: "Creative Software Engineer with 1 year of hands-on experience in web development, web app development, motion graphics, and project management. Focused on crafting visually engaging and high-performing digital products that bring ideas to life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body     style={{
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
      backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    }}
      className={`${popp.className} ${bun.className} ${grav.className} antialiased d9d9ddb5 md:flex md:flex-col md:items-center`}>
        <Nav />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}

<div className="min-h-screen w-full bg-[#faf9f6] relative">
  {/* Paper Texture */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
      backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    }}
  />
     {/* Your Content/Components */}
</div>