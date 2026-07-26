import Link from "next/link";
import { listMotionProjects } from "@/lib/actions/motion-projects";
import MotionProjectsList from "@/components/Admin/MotionProjects/MotionProjectsList";

export const dynamic = "force-dynamic";

export default async function MotionProjectsPage() {
  const items = await listMotionProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Motion Projects
        </h1>
        <Link
          href="/admin/projects/animate/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-ink/50">No motion projects yet.</p>
      ) : (
        <MotionProjectsList initialItems={items} />
      )}
    </div>
  );
}
