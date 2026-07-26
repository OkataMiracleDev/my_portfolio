import Link from "next/link";
import { logout } from "./actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects/dev", label: "Dev Projects" },
  { href: "/admin/projects/animate", label: "Motion Projects" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/landing", label: "Fun Facts" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base text-ink">
      <aside className="w-56 shrink-0 border-r border-ink/10 p-6">
        <p className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
