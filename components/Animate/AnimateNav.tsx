"use client";
import Link from "next/link";

const links = [
  { id: "home", label: "Home", href: "/animate" },
  { id: "projects", label: "Projects", href: "/animate/projects" },
  { id: "resources", label: "Resources", href: "/animate/resources" },
];

const AnimateNav = () => {
  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill bg-base-raised px-4 py-3 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]">
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="text-sm md:text-base font-medium text-ink transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-110 inline-block"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/"
          className="rounded-pill bg-accent-animate px-3 md:px-4 py-1.5 md:py-2 font-medium text-sm text-ink transition-transform duration-200 ease-out hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Switch mode
        </Link>
      </div>
    </nav>
  );
};

export default AnimateNav;
