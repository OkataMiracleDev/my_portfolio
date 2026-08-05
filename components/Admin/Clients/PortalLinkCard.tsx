"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { rotateShareTokenAction } from "@/app/admin/clients/actions";

export default function PortalLinkCard({ clientId, shareToken }: { clientId: string; shareToken: string }) {
  const [token, setToken] = useState(shareToken);
  const [rotating, setRotating] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/portal/${token}` : `/portal/${token}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Portal link copied");
    } catch {
      toast.error("Couldn't copy — copy it manually");
    }
  }

  async function rotate() {
    if (!confirm("Rotate this link? The old portal URL will stop working immediately.")) return;
    setRotating(true);
    try {
      const newToken = await rotateShareTokenAction(clientId);
      if (newToken) setToken(newToken);
      toast.success("Link rotated");
    } finally {
      setRotating(false);
    }
  }

  return (
    <div className="rounded-card border border-accent-animate/30 bg-accent-animate/[0.06] p-5">
      <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-accent-animate">
        Client portal link
      </p>
      <p className="mb-4 break-all font-[family-name:var(--font-jetbrains-mono)] text-sm text-ink">{url}</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={copyLink}
          className="rounded-pill bg-accent-animate px-4 py-2 text-sm font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
        >
          Copy link
        </button>
        <button
          onClick={rotate}
          disabled={rotating}
          className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5 disabled:opacity-50"
        >
          {rotating ? "Rotating…" : "Rotate link"}
        </button>
      </div>
    </div>
  );
}
