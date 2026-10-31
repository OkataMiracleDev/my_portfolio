import { describe, expect, it } from "vitest";
import { CLIPPRO, downloadUrl, parseReleases } from "../clippro";

const release = (tag: string, published: string | null, extra: Record<string, unknown> = {}) => ({
  tag_name: tag,
  name: `ClipPro ${tag}`,
  body: `# ClipPro ${tag.slice(1)}\n\nFaster.\n\n## Fixes\n\n- One`,
  html_url: `https://github.com/${CLIPPRO.repo}/releases/tag/${tag}`,
  draft: false,
  prerelease: false,
  published_at: published,
  assets: [
    { name: `ClipPro_${tag.slice(1)}_x64-setup.exe`, size: 80_000_000, browser_download_url: `https://example.test/${tag}/setup.exe` },
    { name: "ClipPro-setup-x64.exe", size: 80_000_000, browser_download_url: "https://example.test/fixed.exe" },
    { name: `ClipPro_${tag.slice(1)}_x64-portable.zip`, size: 100_000_000, browser_download_url: `https://example.test/${tag}/portable.zip` },
    { name: "latest.json", size: 900, browser_download_url: "https://example.test/latest.json" },
  ],
  ...extra,
});

describe("ClipPro releases", () => {
  it("takes the newest published release and skips drafts and pre-releases", () => {
    const r = parseReleases([
      release("v1.0.0", "2026-10-31T10:00:00Z"),
      release("v1.2.0", "2026-12-01T10:00:00Z", { prerelease: true }),
      release("v1.1.0", "2026-11-15T10:00:00Z"),
      release("v1.3.0", null, { draft: true }),
    ]);
    expect(r.latest?.version).toBe("1.1.0");
    expect(r.earlier.map((e) => e.version)).toEqual(["1.0.0"]);
    expect(r.latest?.installer?.url).toBe("https://example.test/v1.1.0/setup.exe");
    expect(r.latest?.portable?.size).toBe(100_000_000);
    // The notes file's own title is dropped; the page already names the version.
    expect(r.latest?.notes.startsWith("Faster.")).toBe(true);
  });

  it("falls back to links that always resolve", () => {
    // GitHub couldn't be asked: never "coming soon", always the current installer.
    expect(parseReleases("not a list")).toEqual({ latest: null, earlier: [], unavailable: true });
    expect(downloadUrl(null, true)).toBe(CLIPPRO.latestInstallerUrl);
    // Asked, and nothing is published yet.
    expect(parseReleases([])).toEqual({ latest: null, earlier: [], unavailable: false });
    expect(downloadUrl(null)).toBe(CLIPPRO.releasesUrl);
    const noAsset = parseReleases([release("v1.0.0", "2026-10-31T10:00:00Z", { assets: [] })]).latest;
    expect(downloadUrl(noAsset)).toBe(CLIPPRO.latestInstallerUrl);
  });
});
