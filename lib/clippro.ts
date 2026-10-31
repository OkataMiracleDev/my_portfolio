/**
 * ClipPro, the open-source desktop app, and its releases.
 *
 * The release data comes straight from GitHub's API, cached for ten minutes, so publishing a
 * release (release.bat in the ClipPro repo) shows up here without a redeploy. Only published
 * releases count: GitHub never returns drafts to an unauthenticated request, and pre-releases
 * are skipped. If GitHub can't be reached, or nothing is published yet, the page still renders
 * and the buttons fall back to links that always resolve.
 */

export const CLIPPRO = {
  name: "ClipPro",
  repo: "OkataMiracleDev/ClipPro",
  repoUrl: "https://github.com/OkataMiracleDev/ClipPro",
  releasesUrl: "https://github.com/OkataMiracleDev/ClipPro/releases",
  /** GitHub redirects this to the newest published release's installer. */
  latestInstallerUrl: "https://github.com/OkataMiracleDev/ClipPro/releases/latest/download/ClipPro-setup-x64.exe",
  pagePath: "/build/clippro",
  tagline: "Finds the usable footage in a pile of clips.",
  summary:
    "ClipPro watches every second of your footage and scores it for focus, exposure, camera motion and sound, then hands your editor a timeline of only the good parts. Local AI adds faces, shot types and searchable transcripts. Everything runs on your machine.",
  platform: "Windows 10 / 11, 64-bit",
  licence: "MIT + Commons Clause",
  technology: ["Rust", "Tauri", "React", "TypeScript", "FFmpeg", "ONNX Runtime", "Whisper"],
  shots: [
    { src: "/images/clippro/focus.webp", label: "Focus map", alt: "ClipPro showing a focus heat map over a clip, its score chart and the timeline of selects" },
    { src: "/images/clippro/main.webp", label: "Tuning", alt: "ClipPro's main window: clip list, viewer, score chart, timeline and the tuning panel" },
    { src: "/images/clippro/transcript.webp", label: "Transcripts", alt: "ClipPro's transcript panel with search, filler words and the People list" },
    { src: "/images/clippro/export.webp", label: "Export", alt: "ClipPro's export sheet building a stringout for an editing app" },
  ],
} as const;

export interface ClipProAsset {
  url: string;
  size: number;
}

export interface ClipProRelease {
  version: string;
  /** ISO date of publication. */
  date: string;
  /** Release notes, Markdown. */
  notes: string;
  url: string;
  installer: ClipProAsset | null;
  portable: ClipProAsset | null;
}

export interface ClipProReleases {
  latest: ClipProRelease | null;
  earlier: ClipProRelease[];
}

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  assets: GitHubAsset[];
}

/** Turns GitHub's release list into ClipPro's: published, not pre-release, newest first. */
export function parseReleases(raw: unknown): ClipProReleases {
  if (!Array.isArray(raw)) return { latest: null, earlier: [] };
  const releases = (raw as GitHubRelease[])
    .filter((r) => r && !r.draft && !r.prerelease && r.published_at && /^v?\d+\.\d+\.\d+$/.test(r.tag_name))
    .sort((a, b) => Date.parse(b.published_at!) - Date.parse(a.published_at!))
    .map((r): ClipProRelease => {
      const asset = (test: (name: string) => boolean): ClipProAsset | null => {
        const a = r.assets.find((x) => test(x.name));
        return a ? { url: a.browser_download_url, size: a.size } : null;
      };
      return {
        version: r.tag_name.replace(/^v/, ""),
        date: r.published_at!,
        // The notes file's own "# ClipPro x.y.z" title repeats what the page already says.
        notes: (r.body ?? "").replace(/^#\s+ClipPro[^\n]*\n+/i, "").trim(),
        url: r.html_url,
        // The versioned installer, not the fixed-name copy (same file).
        installer: asset((n) => /^ClipPro_.*_x64-setup\.exe$/.test(n)),
        portable: asset((n) => /^ClipPro_.*_x64-portable\.zip$/.test(n)),
      };
    });
  return { latest: releases[0] ?? null, earlier: releases.slice(1, 6) };
}

/** ClipPro's releases from GitHub; never throws. */
export async function getClipProReleases(): Promise<ClipProReleases> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    // Optional: lifts GitHub's 60-requests-an-hour limit for unauthenticated calls.
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${CLIPPRO.repo}/releases?per_page=12`, {
      headers,
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { latest: null, earlier: [] };
    return parseReleases(await res.json());
  } catch {
    return { latest: null, earlier: [] };
  }
}

/** Where the main download button points: the exact installer when known, else the stable link. */
export function downloadUrl(latest: ClipProRelease | null): string {
  return latest?.installer?.url ?? (latest ? CLIPPRO.latestInstallerUrl : CLIPPRO.releasesUrl);
}

export function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1e6)} MB`;
}

export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
