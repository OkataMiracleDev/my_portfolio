import { NextResponse } from "next/server";
import { recordDownload, SURFACES, type Surface } from "@/lib/analytics/clippro-events";
import { CLIPPRO, allReleases, getClipProReleases } from "@/lib/clippro";

export const dynamic = "force-dynamic";

/**
 * Every ClipPro download button on the site goes through here:
 *   /api/clippro/download?v=<version|latest>&from=<surface>&s=<session>
 * It records the download (server side, so ad-blockers don't hide it) and redirects to the
 * installer on GitHub, where the browser downloads it without leaving the page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const wanted = (url.searchParams.get("v") ?? "latest").replace(/^v/, "");
  const from = url.searchParams.get("from");
  const surface: Surface = (SURFACES as readonly string[]).includes(from ?? "") ? (from as Surface) : "page";
  const session = url.searchParams.get("s");

  const releases = await getClipProReleases();
  const list = allReleases(releases);
  const release = wanted === "latest" ? list[0] : list.find((r) => r.version === wanted);

  let target: string;
  let version: string | null;
  if (release) {
    target = release.installer?.url ?? CLIPPRO.latestInstallerUrl;
    version = release.version;
  } else if (wanted === "latest" && releases.unavailable) {
    // GitHub couldn't be asked; its own "latest" link still resolves.
    target = CLIPPRO.latestInstallerUrl;
    version = "latest";
  } else {
    // Nothing published yet, or an unknown version: the releases page, not a dead file.
    target = CLIPPRO.releasesUrl;
    version = null;
  }

  if (version) await recordDownload(surface, version, session, request.headers.get("referer"));
  return NextResponse.redirect(target, 302);
}
