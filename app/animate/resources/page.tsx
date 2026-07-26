import type { Metadata } from "next";
import ResourceFilter from "@/components/Animate/ResourceFilter";
import { getResources } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources | Okata Miracle",
  description: "Free downloads, tutorials, and tool recommendations for motion designers.",
};

export default async function ResourcesPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Resources
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Free for the community — no email required for downloads.
          </p>
        </div>

        <ResourceFilter resources={await getResources()} />
      </div>
    </div>
  );
}
