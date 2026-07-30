import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  devProjects,
  motionProjects,
  resources,
  testimonials,
  posts,
  experienceEntries,
  funFactCards,
  animateCredentials,
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const CARDS = [
  { table: devProjects, label: "Dev Projects", href: "/admin/projects/dev" },
  { table: motionProjects, label: "Motion Projects", href: "/admin/projects/animate" },
  { table: resources, label: "Resources", href: "/admin/resources" },
  { table: testimonials, label: "Testimonials", href: "/admin/testimonials" },
  { table: posts, label: "Posts", href: "/admin/posts" },
  { table: experienceEntries, label: "Experience", href: "/admin/experience" },
  { table: funFactCards, label: "Fun Facts", href: "/admin/landing" },
  { table: animateCredentials, label: "Bragging Rights", href: "/admin/credentials" },
] as const;

export default async function AdminDashboardPage() {
  const counts = await Promise.all(CARDS.map((c) => db.select().from(c.table).orderBy(asc(c.table.id))));

  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CARDS.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-card bg-base-raised p-6 transition-transform duration-150 ease-out hover:-translate-y-0.5"
          >
            <p className="text-3xl font-bold">{counts[i].length}</p>
            <p className="mt-1 text-sm text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
