import Link from "next/link";
import { listDevProjects } from "@/lib/actions/dev-projects";
import DevProjectsList from "@/components/Admin/DevProjects/DevProjectsList";

export const dynamic = "force-dynamic";

export default async function DevProjectsPage() {
  const items = await listDevProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Dev Projects
        </h1>
        <Link
          href="/admin/projects/dev/new"
          className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-ink/50">No dev projects yet.</p>
      ) : (
        <DevProjectsList initialItems={items} />
      )}
    </div>
  );
}
