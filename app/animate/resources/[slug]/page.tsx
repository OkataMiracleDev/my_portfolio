import type { Metadata } from "next";
import Link from "next/link";
import { getResourceBySlug } from "@/lib/data/public";
import JsonLd from "@/components/Shared/JsonLd";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return { title: "Resource not found | Okata Miracle" };
  }

  const title = `${resource.title} | Okata Miracle`;
  const url = `https://www.okata-miracle.site/animate/resources/${resource.slug}`;

  return {
    title,
    description: resource.description,
    keywords: resource.tags,
    openGraph: { title, description: resource.description, url, type: "article" },
    alternates: { canonical: url },
  };
}

const ResourceDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Resource not found
        </h1>
      </div>
    );
  }

  const actionHref = resource.fileUrl ?? resource.externalUrl;

  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: resource.title,
    description: resource.description,
    keywords: resource.tags.join(", "),
    creator: { "@type": "Person", name: "Okata Miracle", url: "https://www.okata-miracle.site" },
    url: `https://www.okata-miracle.site/animate/resources/${resource.slug}`,
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <JsonLd data={resourceJsonLd} />
      <div className="max-w-2xl mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
          {resource.type}
        </p>
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          {resource.title}
        </h1>
        <p className="mb-8 text-ink/70">{resource.description}</p>

        {actionHref ? (
          <a
            href={actionHref}
            target={resource.type === "tool-link" ? "_blank" : undefined}
            rel={resource.type === "tool-link" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            {resource.type === "download" ? "Download" : "Visit link"}
          </a>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-pill bg-ink/5 px-6 py-3 font-semibold text-ink/50">
            Coming soon
          </p>
        )}

        <div className="mt-8">
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
};

export default ResourceDetailPage;
