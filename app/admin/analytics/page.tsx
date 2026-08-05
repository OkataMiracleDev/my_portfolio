import { getVisitSummary } from "@/lib/actions/analytics";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card bg-base-raised p-6">
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const { daily, today, weekTotal, allTimeTotal } = await getVisitSummary();

  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Analytics
      </h1>

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-6">
        <StatCard label="Today" value={today.total} />
        <StatCard label="Today — /" value={today.landing} />
        <StatCard label="Today — /build" value={today.build} />
        <StatCard label="Today — /animate" value={today.animate} />
        <StatCard label="Last 7 days" value={weekTotal} />
        <StatCard label="All time" value={allTimeTotal} />
      </div>

      <p className="mb-4 text-sm text-ink/50">
        Unique visitors per day, deduplicated by IP. A visitor who checks both routes in the same day
        counts once for each.
      </p>

      {daily.length === 0 ? (
        <p className="text-ink/50">No visits recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card bg-base-raised">
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
