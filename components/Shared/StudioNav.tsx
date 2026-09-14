"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Tally } from "@/components/Shared/brand/Hud";

/**
 * The floating nav for both studio routes.
 *
 * /animate and /build previously had two separate nav components that had
 * already drifted apart -- different link shapes, different hit areas, one with
 * icon-only links whose meaning you had to guess. They are the same object in
 * two liveries, so this is one component taking a link list and an accent, and
 * both routes render it.
 */

export interface StudioNavLink {
  label: string;
  href: string;
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StudioNav({
  links,
  homeHref,
  ctaHref,
  ctaLabel = "Start a project",
  accent,
  ariaLabel,
  statusLabel = "Open for work",
}: {
  links: StudioNavLink[];
  /** The route's own index, used to decide which link is "current". */
  homeHref: string;
  ctaHref: string;
  ctaLabel?: string;
  accent: "animate" | "build";
  ariaLabel: string;
  statusLabel?: string;
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const accentBg = accent === "build" ? "bg-accent-build" : "bg-accent-animate";
  const accentText = accent === "build" ? "text-accent-build" : "text-accent-animate";

  function isActive(href: string) {
    // The index would otherwise match every child route, since every one of
    // them starts with it.
    if (href === homeHref) return pathname === homeHref;
    return pathname.startsWith(href);
  }

  // Tapping a link inside the overlay navigates, but the overlay itself would
  // otherwise survive the transition and cover the page it just opened.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape should land the caret back on the control that opened the
      // panel, not at the top of the document.
      triggerRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[10000] flex justify-center px-4 pt-5 md:pt-7">
        <nav
          aria-label={ariaLabel}
          className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-pill border border-ink/10 bg-frame/70 p-1.5 pl-2.5 backdrop-blur-xl md:gap-4 md:pl-4"
        >
          <Link
            href="/"
            aria-label="Okata Studios, all modes"
            className="flex shrink-0 items-center gap-2.5"
          >
            <OkataRing
              className="okata-ring-drift h-8 w-8 shrink-0"
            />
            <span className="hidden font-[family-name:var(--font-cabinet-grotesk)] text-sm font-bold leading-none tracking-tight text-ink sm:inline">
              Okata<span className={accentText}>studios</span>
            </span>
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-pill px-3.5 py-2 text-sm transition-colors duration-200 ease-out ${
                      active ? "bg-ink/10 font-medium text-ink" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={ctaHref}
            className={`group ml-auto hidden shrink-0 items-center gap-2 rounded-pill ${accentBg} py-1.5 pl-4 pr-1.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] md:inline-flex`}
          >
            <span>{ctaLabel}</span>
            {/* Button-in-button: the arrow sits in its own well, flush with the
                pill's inner padding, and drifts diagonally on hover. */}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <Arrow />
            </span>
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="studio-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 transition-transform duration-200 ease-out active:scale-[0.94] md:hidden"
          >
            <span className="relative block h-3 w-4">
              {/* Two bars that rotate into an X rather than swapping icons. */}
              <span
                className={`absolute left-0 block h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 rotate-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0 rotate-0"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Kept mounted rather than unmounted so the links can transition out as
          well as in. While closed it is click-through and untabbable. */}
      <div
        id="studio-menu"
        ref={panelRef}
        tabIndex={-1}
        aria-hidden={!open}
        className={`fixed inset-0 z-[9999] bg-stage/90 backdrop-blur-2xl transition-opacity duration-300 ease-out md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <ul className="flex flex-col gap-1">
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={open ? undefined : -1}
                  style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                  className={`block py-3 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold tracking-tight text-ink transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? "320ms" : "0ms" }}
            className={`flex flex-col gap-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Link
              href={ctaHref}
              tabIndex={open ? undefined : -1}
              className={`inline-flex w-full items-center justify-between rounded-pill ${accentBg} py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]`}
            >
              <span>{ctaLabel}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15">
                <Arrow />
              </span>
            </Link>
            <div className="flex items-center justify-between">
              <Tally className="text-ink/45">{statusLabel}</Tally>
              <Link
                href="/"
                tabIndex={open ? undefined : -1}
                className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] text-ink/45 transition-colors duration-200 ease-out hover:text-ink"
              >
                Switch mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
