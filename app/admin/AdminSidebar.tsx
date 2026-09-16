"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import { logout } from "./actions";

/**
 * Seventeen links in one flat column is a list you read rather than a menu you
 * scan. Grouped by what the thing actually is, with the current page marked.
 */
const NAV_GROUPS: Array<{ heading: string; items: Array<{ href: string; label: string }> }> = [
  {
    heading: "Overview",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/analytics", label: "Analytics" },
    ],
  },
  {
    heading: "Work",
    items: [
      { href: "/admin/projects/dev", label: "Dev projects" },
      { href: "/admin/projects/animate", label: "Motion projects" },
      { href: "/admin/posts", label: "Posts" },
      { href: "/admin/resources", label: "Resources" },
    ],
  },
  {
    heading: "Store",
    items: [
      { href: "/admin/plugins", label: "Plugins" },
      { href: "/admin/plugins/sales", label: "Plugin sales" },
    ],
  },
  {
    heading: "Clients",
    items: [
      { href: "/admin/clients", label: "Clients" },
      // Two separate pipelines on purpose: Clients is the sales funnel
      // (lead -> proposal -> deposit); Retainers are already-signed clients
      // with named projects moving through production.
      { href: "/admin/retainers", label: "Retainers" },
      // Two different things, easy to confuse: "Rate cards" are the per-client
      // cards behind a portal link; "Rate card page" is the single public one
      // at /animate/rates.
      { href: "/admin/rate-cards", label: "Rate cards" },
      { href: "/admin/links", label: "Shareable links" },
    ],
  },
  {
    heading: "Site content",
    items: [
      { href: "/admin/rates", label: "Rate card page" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/testimonials/submissions", label: "Submissions" },
      { href: "/admin/experience", label: "Experience" },
      { href: "/admin/landing", label: "Fun facts" },
      { href: "/admin/credentials", label: "Bragging rights" },
    ],
  },
  {
    heading: "System",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

const VIEW_SITE = [
  { href: "/", label: "Landing" },
  { href: "/build", label: "Build" },
  { href: "/animate", label: "Animate" },
];

/**
 * Longest-prefix match, so /admin/plugins/sales highlights "Plugin sales"
 * rather than lighting up both it and "Plugins", and /admin never matches
 * everything beneath it.
 */
function useActiveHref(pathname: string) {
  const all = NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
  return all
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const activeHref = useActiveHref(pathname);

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-7" aria-label="Admin sections">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <Meta className="mb-2.5 block px-3 text-ink/25">{group.heading}</Meta>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      // Every target is an authenticated force-dynamic page with
                      // no loading.tsx boundary, so the default prefetch would
                      // pull eighteen full RSC payloads on every admin page
                      // load, for data that is stale on arrival.
                      prefetch={false}
                      className={`relative block rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ease-out ${
                        active
                          ? "bg-ink/[0.07] font-medium text-ink"
                          : "text-ink/50 hover:bg-ink/[0.04] hover:text-ink"
                      }`}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent-build"
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-8 space-y-4 border-t border-ink/10 pt-5">
        <div>
          <Meta className="mb-2.5 block px-3 text-ink/25">View site</Meta>
          <ul className="flex flex-wrap gap-1.5 px-3">
            {VIEW_SITE.map((site) => (
              <li key={site.href}>
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-pill border border-ink/12 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.12em] text-ink/40 transition-colors duration-200 ease-out hover:border-ink/30 hover:text-ink"
                >
                  {site.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-1.5 text-left text-sm text-ink/40 transition-colors duration-150 ease-out hover:bg-ink/[0.04] hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-3">
      <OkataRing className="h-7 w-7 shrink-0" />
      <span className="font-[family-name:var(--font-cabinet-grotesk)] text-[1rem] font-bold leading-none tracking-tight text-ink">
        Okata<span className="text-accent-build">admin</span>
      </span>
    </Link>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer when the route changes, or it covers the page it opened.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-stage/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-stage/70 backdrop-blur-sm"
          />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-ink/10 bg-frame p-5">
            <div className="mb-8">
              <Brand />
            </div>
            <NavContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-ink/10 bg-frame px-4 py-6 md:block">
        <div className="mb-9">
          <Brand />
        </div>
        <NavContent />
      </aside>
    </>
  );
}
