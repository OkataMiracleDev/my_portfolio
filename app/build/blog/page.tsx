import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Home/Footer/Footer";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import { getPublishedPosts } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Okata Studios — Software Development Notes",
  description:
    "Writing on software development, frontend engineering, and building products by Okata Studios.",
  openGraph: {
    title: "Blog | Okata Studios",
    description: "Writing on software development and frontend engineering.",
    url: "https://www.okata-miracle.site/build/blog",
    siteName: "Okata Studios",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/build/blog",
  },
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts(["build", "general"]);

  return (
    <>
      <header className="okata-stage relative overflow-hidden px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
        <OkataRing className="okata-ring-drift pointer-events-none absolute -right-40 -top-24 h-[30rem] w-[30rem] opacity-[0.06]" />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex items-center gap-3 text-ink/40">
            <span>Writing</span>
            <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
            <span>{String(posts.length).padStart(2, "0")} notes</span>
          </Meta>

          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.86] tracking-[-0.035em] text-ink">
            <span className="okata-line">
              <span>
                Notes<span className="text-signal">.</span>
              </span>
            </span>
          </h1>

          <p
            className="okata-rise mt-8 max-w-lg text-lg leading-relaxed text-ink/55"
            style={{ animationDelay: "300ms" }}
          >
            Things I worked out the hard way and wrote down so the next person
            does not have to.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24 md:px-12 md:pb-36">
        <div className="mx-auto max-w-[84rem]">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-24 text-center">
              <OkataRing className="h-14 w-14 opacity-60" />
              <p className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink">
                Nothing published yet
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-ink/45">
                Posts land here as they get written.
              </p>
            </div>
          ) : (
            <ul className="border-t border-ink/10">
              {posts.map((post, i) => (
                <li key={post.id}>
                  <Link
                    href={`/build/blog/${post.slug}`}
                    className="group grid grid-cols-1 gap-4 border-b border-ink/10 py-9 md:grid-cols-12 md:gap-8 md:py-11"
                  >
                    <Meta className="text-ink/25 md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </Meta>

                    <div className="md:col-span-8">
                      <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink transition-colors duration-200 ease-out group-hover:text-ink/70 md:text-3xl">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 max-w-xl leading-relaxed text-ink/50">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:col-span-3 md:justify-end md:gap-5">
                      {post.publishedAt && (
                        <Meta className="text-ink/30">
                          {DATE_FORMAT.format(new Date(post.publishedAt))}
                        </Meta>
                      )}
                      <span
                        aria-hidden="true"
                        className="text-ink/25 transition-transform duration-200 ease-out group-hover:translate-x-1"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 17L17 7M17 7H9M17 7V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-16 flex justify-center">
            <Link
              href="/build"
              className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
            >
              Back to index
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
