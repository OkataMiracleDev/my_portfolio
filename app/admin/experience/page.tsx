import Link from "next/link";
import { listExperienceEntries } from "@/lib/actions/experience";
import ExperienceList from "@/components/Admin/Experience/ExperienceList";

export const dynamic = "force-dynamic";

export default async function ExperienceAdminPage() {
  const items = await listExperienceEntries();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Experience
        </h1>
        <Link
          href="/admin/experience/new"
          className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-ink/50">No experience entries yet.</p>
      ) : (
        <ExperienceList initialItems={items} />
      )}
    </div>
  );
}
