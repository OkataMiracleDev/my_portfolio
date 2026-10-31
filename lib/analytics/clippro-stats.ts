import type { clipproEvents } from "@/lib/db/schema";
import type { ClipProRelease } from "@/lib/clippro";

/** ClipPro analytics maths, kept free of the database so it can be tested on its own. */

export type Row = typeof clipproEvents.$inferSelect;

export interface SurfaceStats {
  surface: string;
  label: string;
  /** Sessions that saw it (impression, or a page view). */
  saw: number;
  /** Median seconds visible. */
  dwell: number | null;
  clicks: number;
  downloads: number;
}

export interface ClipProStats {
  days: number;
  tableMissing: boolean;
  totals: {
    visitors: number;
    sessionsSaw: number;
    sessionsEngaged: number;
    sessionsDownloaded: number;
    downloads: number;
    pageViews: number;
    medianTimeOnPage: number | null;
    githubDownloads: number;
  };
  surfaces: SurfaceStats[];
  daily: { day: string; saw: number; views: number; downloads: number }[];
  versions: { version: string; site: number; github: number }[];
  scroll: { depth: string; share: number }[];
  referrers: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
  browsers: [string, number][];
  clicks: [string, number][];
  recent: { at: string; type: string; surface: string; label: string | null; value: number | null; country: string | null; device: string | null; referrer: string | null }[];
}

const SURFACE_LABELS: Record<string, string> = {
  build: "/build spotlight",
  animate: "/animate teaser",
  resources: "/animate/resources",
  page: "/build/clippro page",
};

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function top(counts: Map<string, Set<string>>, n = 8): [string, number][] {
  return [...counts.entries()].map(([k, v]) => [k, v.size] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, n);
}

function tally(map: Map<string, Set<string>>, key: string | null | undefined, who: string) {
  const k = key || "Unknown";
  if (!map.has(k)) map.set(k, new Set());
  map.get(k)!.add(who);
}

/**
 * Everything the Admin → ClipPro page shows, from the rows of the last `days` days (newest first). Rows are aggregated in
 * JS (the same approach as the visit summary): at this site's traffic a 90-day window is a few
 * thousand rows, and it keeps every metric's definition in one readable place.
 *
 * Definitions:
 * - saw: the session had an impression of a ClipPro card/spotlight or viewed the ClipPro page;
 * - engaged: it looked for 5+ seconds, scrolled half the page, opened the version menu or
 *   clicked anything ClipPro;
 * - downloaded: the counting redirect recorded a download for it.
 */
export function computeClipProStats(rows: Row[], list: ClipProRelease[], days: number, tableMissing = false, today = new Date()): ClipProStats {
  const dayStr = (daysAgo: number) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  };

  const sessions = new Map<string, Row[]>();
  for (const r of rows) {
    if (!sessions.has(r.sessionId)) sessions.set(r.sessionId, []);
    sessions.get(r.sessionId)!.push(r);
  }

  const saw = new Set<string>();
  const engaged = new Set<string>();
  const downloaded = new Set<string>();
  for (const [id, evs] of sessions) {
    if (evs.some((e) => e.type === "impression" || e.type === "view")) saw.add(id);
    if (
      evs.some(
        (e) =>
          (e.type === "dwell" && (e.value ?? 0) >= 5000) ||
          (e.type === "time" && (e.value ?? 0) >= 5000) ||
          (e.type === "scroll" && Number(e.label) >= 50) ||
          e.type === "click" ||
          e.type === "download"
      )
    )
      engaged.add(id);
    if (evs.some((e) => e.type === "download")) downloaded.add(id);
  }

  const surfaces: SurfaceStats[] = (["build", "animate", "resources", "page"] as const).map((s) => {
    const evs = rows.filter((r) => r.surface === s);
    return {
      surface: s,
      label: SURFACE_LABELS[s]!,
      saw: new Set(evs.filter((e) => e.type === "impression" || e.type === "view").map((e) => e.sessionId)).size,
      dwell: median(evs.filter((e) => e.type === "dwell").map((e) => (e.value ?? 0) / 1000)),
      clicks: evs.filter((e) => e.type === "click").length,
      downloads: evs.filter((e) => e.type === "download").length,
    };
  });

  const daily = Array.from({ length: days }, (_, i) => {
    const day = dayStr(days - 1 - i);
    const evs = rows.filter((r) => r.day === day);
    return {
      day,
      saw: new Set(evs.filter((e) => e.type === "impression" || e.type === "view").map((e) => e.sessionId)).size,
      views: evs.filter((e) => e.type === "view").length,
      downloads: evs.filter((e) => e.type === "download").length,
    };
  });

  const siteByVersion = new Map<string, number>();
  for (const r of rows.filter((e) => e.type === "download")) {
    const v = r.label === "latest" ? (list[0]?.version ?? "latest") : (r.label ?? "?");
    siteByVersion.set(v, (siteByVersion.get(v) ?? 0) + 1);
  }
  const versions = [
    ...list.map((r) => ({ version: r.version, site: siteByVersion.get(r.version) ?? 0, github: r.downloads })),
    ...[...siteByVersion.entries()].filter(([v]) => !list.some((r) => r.version === v)).map(([version, site]) => ({ version, site, github: 0 })),
  ];

  const pageSessions = new Set(rows.filter((r) => r.type === "view").map((r) => r.sessionId));
  const scroll = ["25", "50", "75", "100"].map((depth) => ({
    depth,
    share: pageSessions.size ? new Set(rows.filter((r) => r.type === "scroll" && Number(r.label) >= Number(depth)).map((r) => r.sessionId)).size / pageSessions.size : 0,
  }));

  // Who: one entry per visitor that saw ClipPro.
  const referrers = new Map<string, Set<string>>();
  const countries = new Map<string, Set<string>>();
  const devices = new Map<string, Set<string>>();
  const browsers = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!saw.has(r.sessionId)) continue;
    if (r.referrer) tally(referrers, r.utmSource ? `${r.referrer} (${r.utmSource})` : r.referrer, r.visitorHash);
    tally(countries, r.country, r.visitorHash);
    tally(devices, r.device, r.visitorHash);
    tally(browsers, r.browser && r.os ? `${r.browser} · ${r.os}` : r.browser, r.visitorHash);
  }
  const clickCounts = new Map<string, number>();
  for (const r of rows.filter((e) => e.type === "click")) {
    const k = r.label ?? "other";
    clickCounts.set(k, (clickCounts.get(k) ?? 0) + 1);
  }

  return {
    days,
    tableMissing,
    totals: {
      visitors: new Set(rows.map((r) => r.visitorHash)).size,
      sessionsSaw: saw.size,
      sessionsEngaged: [...engaged].filter((id) => saw.has(id) || downloaded.has(id)).length,
      sessionsDownloaded: downloaded.size,
      downloads: rows.filter((r) => r.type === "download").length,
      pageViews: rows.filter((r) => r.type === "view").length,
      medianTimeOnPage: median(rows.filter((r) => r.type === "time").map((r) => (r.value ?? 0) / 1000)),
      githubDownloads: list.reduce((sum, r) => sum + r.downloads, 0),
    },
    surfaces,
    daily,
    versions,
    scroll,
    referrers: top(referrers),
    countries: top(countries),
    devices: top(devices),
    browsers: top(browsers),
    clicks: [...clickCounts.entries()].sort((a, b) => b[1] - a[1]),
    recent: rows.slice(0, 40).map((r) => ({
      at: r.createdAt.toISOString(),
      type: r.type,
      surface: r.surface,
      label: r.label,
      value: r.value,
      country: r.country,
      device: r.device,
      referrer: r.referrer,
    })),
  };
}
