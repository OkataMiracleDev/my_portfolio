import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Footer from "@/components/Home/Footer/Footer";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import { getPostBySlug } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found | Okata Studios" };

  const title = `${post.title} | Okata Studios`;
  const description = post.excerpt ?? undefined;
  const url = `https://www.okata-miracle.site/build/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <header className="okata-stage relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-48">
        <OkataRing className="okata-ring-drift pointer-events-none absolute -right-40 -top-28 h-[28rem] w-[28rem] opacity-[0.055]" />
        <div className="relative mx-auto max-w-3xl">
          <Meta className="okata-rise mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/40">
            <Link
              href="/build/blog"
              className="transition-colors duration-200 ease-out hover:text-ink"
            >
              Writing
            </Link>
            {post.publishedAt && (
              <>
                <span aria-hidden="true" className="text-ink/20">
                  /
                </span>
                <span>{DATE_FORMAT.format(new Date(post.publishedAt))}</span>
              </>
            )}
          </Meta>

          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.4rem,7vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
            <span className="okata-line">
              <span>{post.title}</span>
            </span>
          </h1>

          {post.excerpt && (
            <p
              className="okata-rise mt-7 text-lg leading-relaxed text-ink/55"
              style={{ animationDelay: "280ms" }}
            >
              {post.excerpt}
            </p>
          )}
        </div>
      </header>

      <main className="px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {post.coverImage && (
            <div className="mb-14 rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 48rem, 100vw"
                  quality={75}
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* okata-prose, not Tailwind's `prose`: @tailwindcss/typography is not
              a dependency of this project, so the class that used to be here
              matched nothing and every post rendered as flat body text. */}
          <article className="okata-prose">
            <ReactMarkdown>{post.bodyMarkdown}</ReactMarkdown>
          </article>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-10">
            <Link
              href="/build/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors duration-200 ease-out hover:text-ink"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
              >
                &larr;
              </span>
              <span>All writing</span>
            </Link>
            <Link
              href="/build#contact"
              className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
            >
              Start a project
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
