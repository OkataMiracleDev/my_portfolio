import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContentByTagSlug } from "@/lib/data/public";
import JsonLd from "@/components/Shared/JsonLd";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const { label, devMatches, motionMatches, resourceMatches } = await getContentByTagSlug(tag);
  const total = devMatches.length + motionMatches.length + resourceMatches.length;

  if (total === 0) {
    return { title: "Not found | Mimi Studios" };
  }

  const title = `${label} — Frontend Dev & Motion Design Work | Mimi Studios`;
  const description = `Frontend development and motion design work tagged "${label}" by Mimi Studios — projects, reels, and resources.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://www.okata-miracle.site/tags/${tag}`, type: "website" },
    alternates: { canonical: `https://www.okata-miracle.site/tags/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const { label, devMatches, motionMatches, resourceMatches } = await getContentByTagSlug(tag);
  const total = devMatches.length + motionMatches.length + resourceMatches.length;

  if (total === 0) notFound();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} — Mimi Studios`,
    description: `Frontend development and motion design work tagged "${label}".`,
    url: `https://www.okata-miracle.site/tags/${tag}`,
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <JsonLd data={collectionJsonLd} />
      <div className="mx-auto max-w-5xl">
        <Link
          href="/tags"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors duration-200 ease-out hover:text-ink"
        >
          <span>←</span>
          <span>All topics</span>
        </Link>

        <h1 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink md:text-5xl">
          {label}
        </h1>
        <p className="mb-12 text-lg text-ink/70">
          {total} {total === 1 ? "piece" : "pieces"} of work involving {label}.
        </p>

        {devMatches.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm uppercase tracking-[0.14em] text-accent-build">
              Dev projects
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {devMatches.map((p) => (
                <Link
                  key={p.id}
                  href={`/build/projects/${p.slug}`}
                  className="group block overflow-hidden rounded-card bg-base-raised"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {motionMatches.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm uppercase tracking-[0.14em] text-accent-animate">
              Motion projects
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {motionMatches.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="group block overflow-hidden rounded-card bg-base-raised"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {resourceMatches.length > 0 && (
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm uppercase tracking-[0.14em] text-accent-animate">
              Resources
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {resourceMatches.map((r) => (
                <Link
                  key={r.id}
                  href={`/animate/resources/${r.slug}`}
                  className="block rounded-card bg-base-raised p-5 transition-transform duration-200 ease-out hover:-translate-y-0.5"
                >
                  <p className="mb-1 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
                    {r.type}
                  </p>
                  <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
