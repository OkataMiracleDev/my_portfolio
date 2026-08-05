"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "./actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/rate-cards", label: "Rate Cards" },
  { href: "/admin/projects/dev", label: "Dev Projects" },
  { href: "/admin/projects/animate", label: "Motion Projects" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/landing", label: "Fun Facts" },
  { href: "/admin/credentials", label: "Bragging Rights" },
  { href: "/admin/settings", label: "Settings" },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink/50 transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
        >
          Log out
        </button>
      </form>
    </>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-ink/10 p-4 md:hidden">
        <p className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold">Admin</p>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-lg p-2 text-ink/70 hover:bg-ink/5"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            className="absolute inset-0 bg-ink/30"
          />
          <aside className="relative z-10 h-full w-64 max-w-[80vw] overflow-y-auto bg-base p-6 shadow-xl">
            <p className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold">
              Admin
            </p>
            <NavContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <aside className="hidden w-56 shrink-0 border-r border-ink/10 p-6 md:block">
        <p className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold">
          Admin
        </p>
        <NavContent />
      </aside>
    </>
  );
}
