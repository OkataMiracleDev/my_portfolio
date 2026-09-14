import { getVisitSummary } from "@/lib/actions/analytics";
import { PageHeader } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-frame px-5 py-5">
      <p className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold tabular-nums text-ink">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/35">
        {label}
      </p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const { daily, today, weekTotal, allTimeTotal } = await getVisitSummary();

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Analytics"
        description="Unique visitors per day, deduplicated by IP. Someone who checks two routes in one day counts once for each."
      />

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-6">
        <StatCard label="Today" value={today.total} />
        <StatCard label="Today — /" value={today.landing} />
        <StatCard label="Today — /build" value={today.build} />
        <StatCard label="Today — /animate" value={today.animate} />
        <StatCard label="Last 7 days" value={weekTotal} />
        <StatCard label="All time" value={allTimeTotal} />
      </div>

      {daily.length === 0 ? (
        <p className="text-ink/50">No visits recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-frame">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">/</th>
                <th className="px-6 py-3 font-medium">/build</th>
                <th className="px-6 py-3 font-medium">/animate</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {daily.map((day) => (
                <tr key={day.visitDate}>
                  <td className="px-6 py-3 font-medium text-ink">{day.visitDate}</td>
                  {/* Hardcoded (not brand tokens) so the three columns stay visually
                      distinguishable now that /build, /animate, and / share one
                      brand accent color. */}
                  <td className="px-6 py-3 text-emerald-400">{day.landing}</td>
                  <td className="px-6 py-3 text-amber-400">{day.build}</td>
                  <td className="px-6 py-3 text-violet-400">{day.animate}</td>
                  <td className="px-6 py-3 font-semibold text-ink">{day.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
