import Link from "next/link";
import { PageHeader } from "@/components/Admin/ui/Shell";
import { getClipProStats } from "@/lib/actions/clippro-analytics";
import type { ClipProStats } from "@/lib/analytics/clippro-stats";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

const mono = "font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em]";
const card = "rounded-2xl border border-ink/10 bg-frame";

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className={`${card} px-5 py-5`}>
      <p className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold tabular-nums text-ink">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className={`mt-2 text-ink/35 ${mono}`}>{label}</p>
      {hint && <p className="mt-1 text-xs text-ink/35">{hint}</p>}
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">{title}</h2>
        {note && <p className="text-xs text-ink/35">{note}</p>}
      </div>
      {children}
    </section>
  );
}

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");
const secs = (s: number | null) => (s === null ? "—" : s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);

/** Daily bars: sessions that saw ClipPro (outline) with downloads (solid) inside. */
function DailyChart({ daily }: { daily: ClipProStats["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.saw));
  const w = 720;
  const h = 160;
  const bw = w / daily.length;
  return (
    <div className={`${card} overflow-x-auto p-5`}>
      <svg viewBox={`0 0 ${w} ${h + 24}`} className="h-auto w-full min-w-[560px]" role="img" aria-label="Daily sessions that saw ClipPro and downloads">
        {[0.5, 1].map((t) => (
          <line key={t} x1="0" x2={w} y1={h - h * t} y2={h - h * t} stroke="currentColor" className="text-ink/10" strokeDasharray="3 4" />
        ))}
        {daily.map((d, i) => {
          const sh = (d.saw / max) * h;
          const dh = (d.downloads / max) * h;
          return (
            <g key={d.day}>
              <title>{`${d.day}: ${d.saw} saw ClipPro, ${d.views} page views, ${d.downloads} downloads`}</title>
              <rect x={i * bw + bw * 0.15} y={h - sh} width={bw * 0.7} height={Math.max(sh, d.saw ? 1 : 0)} rx="2" className="fill-ink/15" />
              <rect x={i * bw + bw * 0.15} y={h - dh} width={bw * 0.7} height={dh} rx="2" className="fill-accent-build" />
            </g>
          );
        })}
        <text x="0" y={h + 18} className="fill-ink/40 text-[11px]">
          {daily[0]?.day}
        </text>
        <text x={w} y={h + 18} textAnchor="end" className="fill-ink/40 text-[11px]">
          {daily[daily.length - 1]?.day}
        </text>
        <text x={w} y="12" textAnchor="end" className="fill-ink/40 text-[11px]">
          max {max}
        </text>
      </svg>
      <div className="mt-3 flex gap-5 text-xs text-ink/50">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-ink/15" /> Sessions that saw ClipPro
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent-build" /> Downloads
        </span>
      </div>
    </div>
  );
}

function Bar({ label, value, share, right }: { label: string; value: string; share: number; right?: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-ink/80">{label}</span>
        <span className="shrink-0 tabular-nums text-ink">
          {value}
          {right && <span className="ml-2 text-ink/35">{right}</span>}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div className="h-full rounded-full bg-accent-build" style={{ width: `${Math.max(0, Math.min(1, share)) * 100}%` }} />
      </div>
    </div>
  );
}

function TopList({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <div className={`${card} p-5`}>
      <p className={`mb-4 text-ink/40 ${mono}`}>{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-ink/40">Nothing yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(([k, v]) => (
            <Bar key={k} label={k} value={String(v)} share={total ? v / total : 0} />
          ))}
        </div>
      )}
    </div>
  );
}

const CLICK_LABELS: Record<string, string> = {
  versions: "Opened the version menu",
  source: "Source on GitHub",
  page: "Screens and release notes",
  "all-releases": "All releases on GitHub",
};

const EVENT_LABELS: Record<string, string> = {
  view: "Viewed the ClipPro page",
  impression: "Saw ClipPro",
  dwell: "Looked at it",
  scroll: "Scrolled",
  time: "Time on page",
  click: "Clicked",
  download: "Downloaded",
};

export default async function ClipProAnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: raw } = await searchParams;
  const days = RANGES.includes(Number(raw) as (typeof RANGES)[number]) ? Number(raw) : 30;
  const s = await getClipProStats(days);
  const t = s.totals;
  const whoTotal = Math.max(1, ...s.countries.map((c) => c[1]));

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="ClipPro"
        description="What visitors do with ClipPro on the site: who sees it, how long they look, how far they read, and what they download. Visitors are counted per day without cookies."
        action={
          <div className="flex gap-1 rounded-pill border border-ink/10 p-1">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/admin/clippro?days=${r}`}
                className={`rounded-pill px-3.5 py-1.5 text-sm ${r === days ? "bg-ink text-stage" : "text-ink/60 hover:text-ink"}`}
              >
                {r} days
              </Link>
            ))}
          </div>
        }
      />

      {s.tableMissing && (
        <div className="mb-8 rounded-2xl border border-signal/40 bg-signal/10 px-5 py-4 text-sm text-ink/80">
          The analytics table isn&apos;t in the database yet. Apply the migration once with{" "}
          <code className="rounded bg-ink/10 px-1.5 py-0.5">npx drizzle-kit migrate</code>, and events start recording.
        </div>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <Stat label="Downloads (site)" value={t.downloads} />
        <Stat label="Downloads (GitHub, all time)" value={t.githubDownloads} hint="Everywhere, updates included" />
        <Stat label="Saw ClipPro" value={t.sessionsSaw} hint="Sessions" />
        <Stat label="Engaged" value={t.sessionsEngaged} hint={pct(t.sessionsEngaged, t.sessionsSaw) + " of those"} />
        <Stat label="Conversion" value={pct(t.sessionsDownloaded, t.sessionsSaw)} hint="Saw → downloaded" />
        <Stat label="Page views" value={t.pageViews} hint="/build/clippro" />
        <Stat label="Time on page" value={secs(t.medianTimeOnPage)} hint="Median, active" />
        <Stat label="Visitors" value={t.visitors} hint="Unique per day" />
      </div>

      <Section title="Funnel" note="Sessions in the selected range">
        <div className={`${card} space-y-4 p-6`}>
          <Bar label="Saw ClipPro (a card, the spotlight or the page)" value={String(t.sessionsSaw)} share={1} />
          <Bar
            label="Engaged (5s+ looking, half the page read, or a click)"
            value={String(t.sessionsEngaged)}
            right={pct(t.sessionsEngaged, t.sessionsSaw)}
            share={t.sessionsSaw ? t.sessionsEngaged / t.sessionsSaw : 0}
          />
          <Bar
            label="Downloaded"
            value={String(t.sessionsDownloaded)}
            right={pct(t.sessionsDownloaded, t.sessionsSaw)}
            share={t.sessionsSaw ? t.sessionsDownloaded / t.sessionsSaw : 0}
          />
        </div>
      </Section>

      <Section title="Daily">
        <DailyChart daily={s.daily} />
      </Section>

      <Section title="Where on the site" note="Which placement earns the attention and the downloads">
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="px-6 py-3 font-medium">Placement</th>
                <th className="px-6 py-3 font-medium">Saw it</th>
                <th className="px-6 py-3 font-medium">Looked for</th>
                <th className="px-6 py-3 font-medium">Clicks</th>
                <th className="px-6 py-3 font-medium">Downloads</th>
                <th className="px-6 py-3 font-medium">Download rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {s.surfaces.map((x) => (
                <tr key={x.surface}>
                  <td className="px-6 py-3 font-medium text-ink">{x.label}</td>
                  <td className="px-6 py-3 tabular-nums">{x.saw}</td>
                  <td className="px-6 py-3 tabular-nums">{secs(x.dwell)}</td>
                  <td className="px-6 py-3 tabular-nums">{x.clicks}</td>
                  <td className="px-6 py-3 tabular-nums">{x.downloads}</td>
                  <td className="px-6 py-3 tabular-nums">{pct(x.downloads, x.saw)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="grid gap-10 lg:grid-cols-2">
        <Section title="Downloads by version" note="Site: this range · GitHub: all time">
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-ink/50">
                  <th className="px-6 py-3 font-medium">Version</th>
                  <th className="px-6 py-3 font-medium">From the site</th>
                  <th className="px-6 py-3 font-medium">GitHub total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {s.versions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-ink/40">
                      No releases published yet.
                    </td>
                  </tr>
                ) : (
                  s.versions.map((v, i) => (
                    <tr key={v.version}>
                      <td className="px-6 py-3 font-medium text-ink">
                        v{v.version}
                        {i === 0 && <span className={`ml-2 text-accent-build ${mono}`}>latest</span>}
                      </td>
                      <td className="px-6 py-3 tabular-nums">{v.site}</td>
                      <td className="px-6 py-3 tabular-nums">{v.github}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="How far they read" note="/build/clippro, share of page views">
          <div className={`${card} space-y-4 p-6`}>
            {s.scroll.map((x) => (
              <Bar key={x.depth} label={`Reached ${x.depth}%`} value={pct(Math.round(x.share * 100), 100)} share={x.share} />
            ))}
          </div>
        </Section>
      </div>

      <Section title="Who" note="Unique visitors who saw ClipPro">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopList title="Referrers" rows={s.referrers} total={whoTotal} />
          <TopList title="Countries" rows={s.countries} total={whoTotal} />
          <TopList title="Devices" rows={s.devices} total={whoTotal} />
          <TopList title="Browsers" rows={s.browsers} total={whoTotal} />
        </div>
      </Section>

      <Section title="Clicks">
        <div className={`${card} p-6`}>
          {s.clicks.length === 0 ? (
            <p className="text-sm text-ink/40">No clicks yet.</p>
          ) : (
            <div className="space-y-3">
              {s.clicks.map(([k, v]) => (
                <Bar key={k} label={CLICK_LABELS[k] ?? k} value={String(v)} share={v / Math.max(1, s.clicks[0]![1])} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Recent activity" note="Latest 40 events">
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="px-6 py-3 font-medium">When (UTC)</th>
                <th className="px-6 py-3 font-medium">What</th>
                <th className="px-6 py-3 font-medium">Where</th>
                <th className="px-6 py-3 font-medium">Detail</th>
                <th className="px-6 py-3 font-medium">From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {s.recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-ink/40">
                    Nothing recorded yet.
                  </td>
                </tr>
              ) : (
                s.recent.map((e, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-6 py-2.5 tabular-nums text-ink/60">{e.at.slice(0, 16).replace("T", " ")}</td>
                    <td className={`px-6 py-2.5 ${e.type === "download" ? "font-medium text-accent-build" : "text-ink"}`}>{EVENT_LABELS[e.type] ?? e.type}</td>
                    <td className="px-6 py-2.5 text-ink/60">{e.surface}</td>
                    <td className="px-6 py-2.5 text-ink/60">
                      {e.type === "download" && e.label ? `v${e.label}` : null}
                      {e.type === "scroll" && e.label ? `${e.label}%` : null}
                      {e.type === "click" && e.label ? (CLICK_LABELS[e.label] ?? e.label) : null}
                      {(e.type === "dwell" || e.type === "time") && e.value !== null ? secs(e.value / 1000) : null}
                    </td>
                    <td className="px-6 py-2.5 text-ink/50">{[e.country, e.device, e.referrer].filter(Boolean).join(" · ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
