import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getStudioPluginBySlug } from "@/lib/data/public";
import PluginBuyForm from "@/components/Animate/PluginBuyForm";
import ExpandableText from "@/components/Shared/ExpandableText";
import JsonLd from "@/components/Shared/JsonLd";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getStudioPluginBySlug(slug);
  if (!plugin) return { title: "Plugin not found | Mimi Studios" };

  const title = `${plugin.title} | Mimi Studio`;
  const url = `https://www.okata-miracle.site/animate/resources/plugins/${plugin.slug}`;
  return {
    title,
    description: plugin.description,
    keywords: plugin.tags,
    openGraph: {
      title,
      description: plugin.description,
      url,
      type: "website",
      images: [{ url: plugin.thumbnailUrl }],
    },
    alternates: { canonical: url },
  };
}

export default async function PluginDetailPage({ params }: Props) {
  const { slug } = await params;
  const plugin = await getStudioPluginBySlug(slug);

  if (!plugin) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Plugin not found
        </h1>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: plugin.title,
    description: plugin.description,
    image: plugin.thumbnailUrl,
    offers: { "@type": "Offer", price: plugin.priceAmount, priceCurrency: "NGN" },
    creator: { "@type": "Person", name: "Okata Miracle", url: "https://www.okata-miracle.site" },
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <JsonLd data={jsonLd} />
      <div className="max-w-4xl mx-auto">
        <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
          Mimi Studio
        </p>
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
          {plugin.title}
        </h1>
        <div className="mb-10 max-w-2xl">
          <ExpandableText
            text={plugin.description}
            className="text-lg text-ink/70"
            linkClassName="text-accent-animate"
          />
        </div>

        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div className="relative aspect-square overflow-hidden rounded-card bg-band-dark">
            <Image src={plugin.thumbnailUrl} alt={plugin.title} fill quality={90} className="object-cover" />
          </div>

          <div className="rounded-card bg-base-raised p-8">
            <p className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">Get it</p>
            <PluginBuyForm plugin={plugin} />
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/animate/resources"
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Resources</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
