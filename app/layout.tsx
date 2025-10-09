import type { Metadata } from "next";
import { Gravitas_One, Poppins } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Home/Navbar/Nav";

const popp = Poppins({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ["latin"],
});

const grav = Gravitas_One({
  weight: ['400'],
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
      <body className={`${grav.className} ${popp.className} antialiased bg-[#d9d9ddb5]`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
