"use client";
import Link from "next/link";
import { animateNavLinks } from "@/constant/constant";

const AnimateNav = () => {
  return (
    <div className="fixed inset-x-0 top-4 z-[10000] flex justify-center px-4 md:top-6">
      <nav className="max-w-full rounded-pill bg-nav-dark px-3 py-2.5 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)] md:px-4 md:py-3">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {animateNavLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              aria-label={link.ariaLabel}
              className="inline-flex transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-110"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-pill bg-accent-animate px-2.5 md:px-4 py-1.5 md:py-2 font-medium text-xs md:text-sm text-ink transition-transform duration-200 ease-out hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Switch mode
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AnimateNav;
