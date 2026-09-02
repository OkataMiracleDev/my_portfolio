"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface LinkEntry {
  label: string;
  path: string;
  description: string;
}

const LINKS: LinkEntry[] = [
  {
    label: "Motion portfolio home",
    path: "/animate",
    description: "The main /animate landing page — reels, capabilities, testimonials.",
  },
  {
    label: "Motion projects",
    path: "/animate/projects",
    description: "Full list of motion case studies.",
  },
  {
    label: "Rate card",
    path: "/animate/rates",
    description: "Public pricing page for project and retainer work.",
  },
  {
    label: "Share a testimonial",
    path: "/animate/testimonial",
    description: "Send this to a client after wrapping a project — they fill in a quick form.",
  },
  {
    label: "YouTube intro brief",
    path: "/mimi-studios-youtube-intro-brief.html",
    description: "Client intake for a YouTube channel intro — send once scope is roughly agreed.",
  },
  {
    label: "Long-form video brief",
    path: "/mimi-studios-long-form-video-brief.html",
    description: "Client intake for a long-form video edit — structure, graphics, sound, and specs.",
  },
  {
    label: "Short-form video brief",
    path: "/mimi-studios-short-form-video-brief.html",
    description: "Client intake for Shorts / Reels / TikTok edits — hook, format, and cadence.",
  },
  {
    label: "SaaS ad brief",
    path: "/mimi-studios-saas-ad-brief.html",
    description: "Client intake for a SaaS performance ad — offer, audience, and ad platform specs.",
  },
  {
    label: "Product placement brief",
    path: "/mimi-studios-product-placement-brief.html",
    description: "Client intake for a product placement — the product, the scene, and usage rights.",
  },
  {
    label: "Showcase brief",
    path: "/mimi-studios-showcase-brief.html",
    description: "Client intake for a product or feature showcase video.",
  },
  {
    label: "Event trailer brief",
    path: "/mimi-studios-event-trailer-brief.html",
    description: "Client intake for an event trailer or teaser — lineup, highlights, and dates.",
  },
  {
    label: "Free resources",
    path: "/animate/resources",
    description: "Downloads, tutorials, and tool recommendations.",
  },
  {
    label: "Browse by topic",
    path: "/tags",
    description: "Every skill/tool tag across dev and motion work, useful for a portfolio deep-link.",
  },
];

export default function ShareableLinksList() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copyLink(path: string) {
    const url = `${origin || ""}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy — copy it manually");
    }
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
      {LINKS.map((link) => (
        <li key={link.path} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex-1">
            <p className="font-semibold text-ink">{link.label}</p>
            <p className="mb-1 text-sm text-ink/50">{link.description}</p>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
              {link.path}
            </p>
          </div>
          <button
            onClick={() => copyLink(link.path)}
            className="shrink-0 rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
          >
            Share
          </button>
        </li>
      ))}
    </ul>
  );
}
