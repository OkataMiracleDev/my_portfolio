import Link from "next/link";
import { listResources } from "@/lib/actions/resources";
import ResourcesList from "@/components/Admin/Resources/ResourcesList";

export const dynamic = "force-dynamic";

export default async function ResourcesAdminPage() {
  const items = await listResources();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Resources
        </h1>
        <Link
          href="/admin/resources/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? <p className="text-ink/50">No resources yet.</p> : <ResourcesList initialItems={items} />}
    </div>
  );
}
