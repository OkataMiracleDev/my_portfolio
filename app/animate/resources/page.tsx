import type { Metadata } from "next";
import ResourceFilter from "@/components/Animate/ResourceFilter";
import StudioPluginsGrid from "@/components/Animate/StudioPluginsGrid";
import { getResources, getStudioPlugins } from "@/lib/data/public";
import { absoluteUrl } from "@/lib/site";
import { allReleases, getClipProReleases } from "@/lib/clippro";
import ClipProFeature from "@/components/Animate/ClipProFeature";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Motion Design Resources | Okata Studios",
  description:
    "Free downloads, tutorials, plugins and tool recommendations for motion designers, from Okata Studios in Port Harcourt, Nigeria.",
  openGraph: {
    title: "Free Motion Design Resources | Okata Studios",
    description:
      "Free downloads, tutorials, and tool recommendations for motion designers.",
    url: absoluteUrl("/animate/resources"),
    siteName: "Okata Studios",
    type: "website",
  },
  alternates: {
    canonical: absoluteUrl("/animate/resources"),
  },
};

export default async function ResourcesPage() {
  const [resources, plugins, clipPro] = await Promise.all([
    getResources(),
    getStudioPlugins(),
    getClipProReleases(),
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

        <div className="mb-16">
          <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            Software
          </h2>
          <ClipProFeature releases={allReleases(clipPro)} unavailable={clipPro.unavailable} />
        </div>

        {plugins.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
              Okata Studio
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
