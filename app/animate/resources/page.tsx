import type { Metadata } from "next";
import ResourceFilter from "@/components/Animate/ResourceFilter";
import StudioPluginsGrid from "@/components/Animate/StudioPluginsGrid";
import { getResources, getStudioPlugins } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Motion Design Resources | Mimi Studios",
  description:
    "Free downloads, tutorials, and tool recommendations for motion designers.",
  openGraph: {
    title: "Free Motion Design Resources | Mimi Studios",
    description:
      "Free downloads, tutorials, and tool recommendations for motion designers.",
    url: "https://www.okata-miracle.site/animate/resources",
    siteName: "Mimi Studios",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate/resources",
  },
};

export default async function ResourcesPage() {
  const [resources, plugins] = await Promise.all([
    getResources(),
    getStudioPlugins(),
  ]);

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Resources
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Free for the community — email required for downloads.
          </p>
        </div>

        {plugins.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
              Mimi Studio
            </h2>
            <StudioPluginsGrid plugins={plugins} />
          </div>
        )}

        <div>
          <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            External resources
          </h2>
          <ResourceFilter resources={resources} />
        </div>
      </div>
    </div>
  );
}
