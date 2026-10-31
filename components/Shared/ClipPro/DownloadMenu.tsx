"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Meta } from "@/components/Shared/brand/Hud";
import { CLIPPRO, formatReleaseDate, formatSize, type ClipProRelease } from "@/lib/clippro";
import { downloadHref, track, type Surface } from "@/lib/clippro-track";

const DOWNLOAD_ICON = "M12 4v12M12 16l-5-5M12 16l5-5M5 20h14";

/**
 * The download control: a split pill. The main part downloads the newest release's installer
 * straight away; the chevron opens every published version, newest first, each downloading its
 * own installer.
 *
 * The menu is portalled to <body> with fixed positioning because every place this sits (the
 * spotlight section, the resource card, the page header) clips its overflow for the background
 * art. It opens below the button, or above when there isn't room, and closes on Escape, an
 * outside click, scrolling (the page moves under a fixed menu) or resizing.
 */
export default function DownloadMenu({
  releases,
  accent,
  surface,
}: {
  /** Published releases, newest first (may be empty before the first one). */
  releases: ClipProRelease[];
  accent: "build" | "animate";
  /** Where on the site this button is, for the download counts. */
  surface: Surface;
}) {
  const latest = releases[0] ?? null;
  const hasMenu = releases.length > 0;
  const fill = accent === "build" ? "bg-accent-build" : "bg-accent-animate";
  const ring = accent === "build" ? "focus-visible:outline-accent-build" : "focus-visible:outline-accent-animate";
  const [open, setOpen] = useState(false);
  // Opened from the keyboard (Enter/Space): focus moves into the list; a mouse click leaves it.
  const viaKeyboard = useRef(false);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) toggleRef.current?.focus();
  }, []);

  // Place the menu against the button, flipping above it when the viewport has no room below.
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const height = menuRef.current?.offsetHeight ?? 320;
    const width = Math.min(352, window.innerWidth - 32);
    const left = Math.min(Math.max(16, r.left), window.innerWidth - width - 16);
    const below = window.innerHeight - r.bottom;
    setPos(below >= height + 16 || below >= r.top ? { left, top: r.bottom + 8 } : { left, bottom: window.innerHeight - r.top + 8 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !anchorRef.current?.contains(t)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[next]?.focus();
      }
    };
    // Scrolling the version list itself is fine; scrolling the page is not.
    const onMove = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("wheel", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    // Keyboard users land on the first version.
    if (viaKeyboard.current) {
      requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus({ preventScroll: true }));
    }
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("wheel", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [open, close]);

  // The counting redirect (/api/clippro/download). The session id is added on click, so the
  // server-rendered href and the hydrated one match.
  const mainHref = `/api/clippro/download?v=latest&from=${surface}`;
  const withSession = (e: React.MouseEvent<HTMLAnchorElement>, version: string) => {
    e.currentTarget.href = downloadHref(version, surface);
  };
  const label = latest ? `Download ClipPro ${latest.version} for Windows` : "Download ClipPro for Windows";

  return (
    <div ref={anchorRef} className="inline-flex items-stretch">
      <a
        href={mainHref}
        onClick={(e) => withSession(e, "latest")}
        aria-label={label}
        className={`group inline-flex items-center gap-2 py-2 pl-6 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 ${ring} ${fill} ${hasMenu ? "rounded-l-pill pr-3" : "rounded-pill pr-2"}`}
      >
        <span>Download for Windows</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-y-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={DOWNLOAD_ICON} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>

      {hasMenu && (
        <button
          ref={toggleRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Choose a version to download"
          onClick={(e) => {
            viaKeyboard.current = e.detail === 0;
            if (!open) track("click", surface, "versions");
            setOpen((v) => !v);
          }}
          className={`relative flex items-center rounded-r-pill pl-2.5 pr-3.5 text-ink transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 ${ring} ${fill} hover:brightness-110`}
        >
          {/* The seam between the two halves. */}
          <span aria-hidden="true" className="absolute inset-y-2 left-0 w-px bg-ink/25" />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={`transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="ClipPro versions"
            style={{ position: "fixed", left: pos?.left ?? -9999, top: pos?.top, bottom: pos?.bottom, width: "min(22rem, calc(100vw - 2rem))" }}
            className="z-[100] origin-top rounded-[1.25rem] border border-ink/10 bg-base-raised p-1.5 shadow-[0_24px_70px_-20px_rgb(0_0_0_/_0.85)] motion-safe:animate-[okata-menu-in_160ms_ease-out]"
          >
            <Meta className="block px-3.5 pb-2 pt-2.5 text-ink/35">Every version</Meta>
            <ul className="max-h-[min(22rem,60vh)] overflow-y-auto">
              {releases.map((r, i) => (
                <li key={r.version}>
                  <a
                    role="menuitem"
                    href={`/api/clippro/download?v=${r.version}&from=${surface}`}
                    onClick={(e) => {
                      withSession(e, r.version);
                      close();
                    }}
                    className="flex items-center gap-3 rounded-[0.9rem] px-3.5 py-2.5 outline-none transition-colors duration-150 ease-out hover:bg-ink/[0.06] focus-visible:bg-ink/[0.08]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-ink">v{r.version}</span>
                        {i === 0 && (
                          <span className={`rounded-pill px-2 py-px font-[family-name:var(--font-jetbrains-mono)] text-[0.5625rem] uppercase tracking-[0.14em] text-ink ${fill}`}>
                            Latest
                          </span>
                        )}
                      </span>
                      <Meta className="mt-0.5 block text-ink/35">
                        {formatReleaseDate(r.date)}
                        {r.installer ? ` · ${formatSize(r.installer.size)}` : ""}
                      </Meta>
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink/40">
                      <path d={DOWNLOAD_ICON} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <a
              role="menuitem"
              href={CLIPPRO.releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("click", surface, "all-releases");
                close();
              }}
              className="mt-1 flex items-center justify-between rounded-[0.9rem] border-t border-ink/10 px-3.5 py-2.5 text-sm text-ink/60 outline-none transition-colors duration-150 ease-out hover:text-ink focus-visible:bg-ink/[0.08]"
            >
              Release notes and portable ZIPs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>,
          document.body
        )}
    </div>
  );
}
