import Link from "next/link";
import { count, eq } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "@/lib/db/client";
import {
  devProjects,
  motionProjects,
  resources,
  testimonials,
  testimonialSubmissions,
  posts,
  experienceEntries,
  funFactCards,
  animateCredentials,
  studioPlugins,
  clients,
} from "@/lib/db/schema";
import { getVisitSummary } from "@/lib/actions/analytics";
import { PageHeader, Panel } from "@/components/Admin/ui/Shell";
import { Meta } from "@/components/Shared/brand/Hud";

export const dynamic = "force-dynamic";

/**
 * `select count(*)`, not `select *` then `.length`.
 *
 * The previous dashboard ran `db.select().from(table)` for eight tables and
 * counted the arrays in JavaScript -- eight full table scans, every row of
 * every table pulled across the network from Turso, to render eight integers.
 * It got slower with every project added and it was the single heaviest page
 * in the admin.
 */
async function countRows(table: SQLiteTable): Promise<number> {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

const CONTENT = [
  { table: devProjects, label: "Dev projects", href: "/admin/projects/dev" },
  { table: motionProjects, label: "Motion projects", href: "/admin/projects/animate" },
  { table: posts, label: "Posts", href: "/admin/posts" },
  { table: resources, label: "Resources", href: "/admin/resources" },
  { table: studioPlugins, label: "Plugins", href: "/admin/plugins" },
  { table: clients, label: "Clients", href: "/admin/clients" },
  { table: testimonials, label: "Testimonials", href: "/admin/testimonials" },
  { table: experienceEntries, label: "Experience", href: "/admin/experience" },
  { table: funFactCards, label: "Fun facts", href: "/admin/landing" },
  { table: animateCredentials, label: "Bragging rights", href: "/admin/credentials" },
] as const;

const QUICK_ACTIONS = [
  { label: "New dev project", href: "/admin/projects/dev/new" },
  { label: "New motion project", href: "/admin/projects/animate/new" },
  { label: "New post", href: "/admin/posts/new" },
  { label: "New client", href: "/admin/clients/new" },
];

export default async function AdminDashboardPage() {
  const [counts, visits, newSubmissions] = await Promise.all([
    Promise.all(CONTENT.map((entry) => countRows(entry.table))),
    getVisitSummary(),
    db
      .select({ value: count() })
      .from(testimonialSubmissions)
      .where(eq(testimonialSubmissions.status, "new"))
      .then(([row]) => row?.value ?? 0),
  ]);

  const traffic = [
    { label: "Visits today", value: visits.today.total },
    { label: "Last 7 days", value: visits.weekTotal },
    { label: "All time", value: visits.allTimeTotal },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Everything on the site, and how many people have looked at it."
      />

      {/* Anything genuinely waiting on a decision goes at the very top, and
          only renders when there is actually something to do. */}
      {newSubmissions > 0 && (
        <Link
          href="/admin/testimonials/submissions"
          className="group mb-8 flex items-center justify-between gap-4 rounded-2xl border border-signal/30 bg-signal/[0.06] px-6 py-4 transition-colors duration-200 ease-out hover:border-signal/50"
        >
          <div>
            <Meta className="text-signal">Needs review</Meta>
            <p className="mt-1.5 text-sm text-ink">
              {newSubmissions} testimonial {newSubmissions === 1 ? "submission" : "submissions"}{" "}
              waiting
            </p>
          </div>
          <span
            aria-hidden="true"
            className="text-ink/30 transition-transform duration-200 ease-out group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      )}

      <section className="mb-10">
        <Meta className="mb-4 block text-ink/35">Traffic</Meta>
        <div className="grid grid-cols-3 gap-3">
          {traffic.map((stat) => (
            <Panel key={stat.label} className="px-5 py-5">
              <p className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold tabular-nums text-ink md:text-4xl">
                {stat.value.toLocaleString()}
              </p>
              <Meta className="mt-2 block text-ink/35">{stat.label}</Meta>
            </Panel>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <Meta className="text-ink/25">
            Today &mdash; landing <span className="text-ink/50">{visits.today.landing}</span>
          </Meta>
          <Meta className="text-ink/25">
            build <span className="text-ink/50">{visits.today.build}</span>
          </Meta>
          <Meta className="text-ink/25">
            animate <span className="text-ink/50">{visits.today.animate}</span>
          </Meta>
          <Link
            href="/admin/analytics"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] text-accent-build transition-colors duration-200 ease-out hover:text-ink"
          >
            Full analytics &rarr;
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <Meta className="mb-4 block text-ink/35">Content</Meta>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CONTENT.map((entry, i) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-2xl border border-ink/10 bg-frame px-5 py-5 transition-colors duration-200 ease-out hover:border-ink/25"
            >
              <p
                className={`font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold tabular-nums ${
                  counts[i] === 0 ? "text-ink/25" : "text-ink"
                }`}
              >
                {counts[i]}
              </p>
              <Meta className="mt-2 block text-ink/35">{entry.label}</Meta>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Meta className="mb-4 block text-ink/35">Quick add</Meta>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-pill border border-ink/12 px-4 py-2 text-sm text-ink/60 transition-colors duration-200 ease-out hover:border-ink/30 hover:text-ink"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
