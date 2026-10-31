"use client";

import { FaGithub } from "react-icons/fa";
import { CLIPPRO, formatSize, type ClipProRelease } from "@/lib/clippro";
import { track, type Surface } from "@/lib/clippro-track";

export function SourceLink({ surface, className = "" }: { surface: Surface; className?: string }) {
  return (
    <a
      href={CLIPPRO.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click", surface, "source")}
      className={`inline-flex items-center gap-2 rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink ${className}`}
    >
      <FaGithub aria-hidden="true" className="h-4 w-4" />
      Source on GitHub
    </a>
  );
}

/** "v1.0.0 · 77 MB · 31 Oct 2026", or a quiet placeholder before the first release. */
export function releaseLine(release: ClipProRelease | null, date: (iso: string) => string, unavailable = false): string {
  if (!release) return unavailable ? "Latest version on GitHub" : "First release coming soon";
  return [`v${release.version}`, release.installer ? formatSize(release.installer.size) : null, date(release.date)].filter(Boolean).join(" · ");
}
