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
      <body       style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #9c9de300 100%)",
    }}
      className={`${popp.className} ${bun.className} ${grav.className} antialiased md:flex md:flex-col md:items-center`}>
        <Nav />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}

