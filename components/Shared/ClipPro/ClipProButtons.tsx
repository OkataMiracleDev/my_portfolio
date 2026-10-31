import { FaGithub } from "react-icons/fa";
import { CLIPPRO, downloadUrl, formatSize, type ClipProRelease } from "@/lib/clippro";

/**
 * The download pill, in the shape of the project pages' "Visit the live site" button: accent
 * fill, label, and the round icon well on the right. It points straight at the installer on
 * GitHub, so the click starts the download. Before the first release is published it becomes
 * a plain link to the releases page rather than a dead button.
 */
export function DownloadButton({
  release,
  accent,
  className = "",
}: {
  release: ClipProRelease | null;
  accent: "build" | "animate";
  className?: string;
}) {
  const fill = accent === "build" ? "bg-accent-build" : "bg-accent-animate";
  const label = release ? "Download for Windows" : "Get it on GitHub";
  return (
    <a
      href={downloadUrl(release)}
      {...(release ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
      className={`group inline-flex items-center gap-2 rounded-pill ${fill} py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${className}`}
      aria-label={release ? `Download ClipPro ${release.version} for Windows` : "ClipPro on GitHub"}
    >
      <span>{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-y-0.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d={release ? "M12 4v12M12 16l-5-5M12 16l5-5M5 20h14" : "M7 17L17 7M17 7H9M17 7V15"}
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

export function SourceLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={CLIPPRO.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink ${className}`}
    >
      <FaGithub aria-hidden="true" className="h-4 w-4" />
      Source on GitHub
    </a>
  );
}

/** "v1.0.0 · 77 MB · 31 Oct 2026", or a quiet placeholder before the first release. */
export function releaseLine(release: ClipProRelease | null, date: (iso: string) => string): string {
  if (!release) return "First release coming soon";
  return [`v${release.version}`, release.installer ? formatSize(release.installer.size) : null, date(release.date)].filter(Boolean).join(" · ");
}
