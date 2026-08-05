import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse by Skill & Topic | Mimi Studios",
  description:
    "Browse Mimi Studios' frontend development and motion design work by skill, tool, and topic — React, Next.js, GSAP, After Effects, and more.",
  alternates: {
    canonical: "https://www.okata-miracle.site/tags",
  },
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors duration-200 ease-out hover:text-ink"
        >
          <span>←</span>
          <span>Home</span>
        </Link>

        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink md:text-5xl">
          Browse by topic
        </h1>
        <p className="mb-12 text-lg text-ink/70">
          Every skill, tool, and topic across dev projects, motion reels, and resources.
        </p>

        {tags.length === 0 ? (
          <p className="text-ink/50">Nothing tagged yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="rounded-pill border border-ink/15 bg-base-raised px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
              >
                {tag.label} <span className="text-ink/40">({tag.count})</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
