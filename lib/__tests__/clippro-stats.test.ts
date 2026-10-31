import { describe, expect, it } from "vitest";
import { computeClipProStats, type Row } from "../analytics/clippro-stats";
import type { ClipProRelease } from "../clippro";

const TODAY = new Date("2026-11-20T12:00:00Z");
let n = 0;
const ev = (sessionId: string, type: Row["type"], surface: Row["surface"], extra: Partial<Row> = {}): Row => ({
  id: String(n++),
  day: "2026-11-20",
  type,
  surface,
  label: null,
  value: null,
  sessionId,
  visitorHash: `v-${sessionId}`,
  path: null,
  referrer: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  country: "NG",
  device: "desktop",
  browser: "Chrome",
  os: "Windows",
  createdAt: new Date(TODAY.getTime() - n * 1000),
  ...extra,
});

const release = (version: string, downloads: number): ClipProRelease => ({
  version,
  date: "2026-11-01T00:00:00Z",
  notes: "",
  url: "",
  installer: null,
  portable: null,
  downloads,
});

describe("ClipPro analytics", () => {
  // A: saw the /build spotlight, looked for 6 s, downloaded the latest.
  // B: glanced at the /animate teaser for a second.
  // C: read the ClipPro page to 75% for 30 s and clicked through to the source.
  const rows: Row[] = [
    ev("A", "impression", "build", { referrer: "twitter.com" }),
    ev("A", "dwell", "build", { value: 6000 }),
    ev("A", "download", "build", { label: "latest" }),
    ev("B", "impression", "animate", { device: "mobile", country: "GH" }),
    ev("B", "dwell", "animate", { value: 1000, device: "mobile", country: "GH" }),
    ev("C", "view", "page"),
    ev("C", "scroll", "page", { label: "25" }),
    ev("C", "scroll", "page", { label: "50" }),
    ev("C", "scroll", "page", { label: "75" }),
    ev("C", "time", "page", { value: 30_000 }),
    ev("C", "click", "page", { label: "source" }),
  ];
  const s = computeClipProStats(rows, [release("1.1.0", 12), release("1.0.0", 5)], 7, false, TODAY);

  it("builds the funnel from sessions", () => {
    expect(s.totals.sessionsSaw).toBe(3);
    expect(s.totals.sessionsEngaged).toBe(2); // A (looked 6 s, downloaded) and C (read half, clicked)
    expect(s.totals.sessionsDownloaded).toBe(1);
    expect(s.totals.downloads).toBe(1);
    expect(s.totals.pageViews).toBe(1);
    expect(s.totals.medianTimeOnPage).toBe(30);
    expect(s.totals.githubDownloads).toBe(17);
  });

  it("splits by placement and version", () => {
    const build = s.surfaces.find((x) => x.surface === "build")!;
    expect(build).toMatchObject({ saw: 1, dwell: 6, downloads: 1 });
    expect(s.surfaces.find((x) => x.surface === "page")).toMatchObject({ saw: 1, clicks: 1 });
    // "latest" downloads count against the newest version.
    expect(s.versions).toEqual([
      { version: "1.1.0", site: 1, github: 12 },
      { version: "1.0.0", site: 0, github: 5 },
    ]);
  });

  it("measures reading depth and who came", () => {
    expect(s.scroll.map((x) => x.share)).toEqual([1, 1, 1, 0]);
    expect(s.countries).toEqual([
      ["NG", 2],
      ["GH", 1],
    ]);
    expect(s.referrers).toEqual([["twitter.com", 1]]);
    expect(s.clicks).toEqual([["source", 1]]);
    expect(s.daily).toHaveLength(7);
    expect(s.daily[6]).toMatchObject({ day: "2026-11-20", saw: 3, downloads: 1, views: 1 });
  });
});
