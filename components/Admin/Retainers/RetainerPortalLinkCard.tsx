"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { rotateRetainerShareTokenAction } from "@/app/admin/retainers/actions";
import ConfirmButton from "@/components/Admin/ui/ConfirmButton";

/**
 * Same job as the client PortalLinkCard, pointed at /retainer instead of
 * /portal and at the retainer's own rotate action. Kept as a sibling rather
 * than generalised into one component with two sets of props: they are two
 * lines of difference, and a shared version would have to take an action and
 * a base path just to save them.
 */
export default function RetainerPortalLinkCard({
  retainerId,
  shareToken,
}: {
  retainerId: string;
  shareToken: string;
}) {
  const [token, setToken] = useState(shareToken);
  const [rotating, setRotating] = useState(false);

  // window is unavailable during SSR, so the first paint shows the path and
  // the origin fills in on hydration.
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/retainer/${token}`
      : `/retainer/${token}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Portal link copied");
    } catch {
      toast.error("Couldn't copy — copy it manually");
    }
  }

  async function rotate() {
    setRotating(true);
    try {
      const newToken = await rotateRetainerShareTokenAction(retainerId);
      if (newToken) setToken(newToken);
      toast.success("Link rotated");
    } catch {
      toast.error("Could not rotate that link.");
    } finally {
      setRotating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-accent-animate/30 bg-accent-animate/[0.06] p-5">
      <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-accent-animate">
        Retainer portal link
      </p>
      <p className="mb-4 break-all font-[family-name:var(--font-jetbrains-mono)] text-sm text-ink">
        {url}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-pill bg-accent-animate px-4 py-2 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
        >
          Copy link
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-pill border border-ink/15 px-4 py-2 text-sm text-ink/70 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
        >
          Preview
        </a>
        {/* Two-step rather than a native confirm(): rotating invalidates the
            URL the client may already have bookmarked. */}
        <ConfirmButton
          onConfirm={rotate}
          confirmLabel="Rotate anyway"
          pendingLabel={rotating ? "Rotating" : "Working"}
        >
          Rotate link
        </ConfirmButton>
      </div>
    </div>
  );
}
