import Link from "next/link";
import { listFunFacts } from "@/lib/actions/fun-facts";
import FunFactsList from "@/components/Admin/FunFacts/FunFactsList";

export const dynamic = "force-dynamic";

export default async function FunFactsAdminPage() {
  const items = await listFunFacts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Landing Fun Facts
        </h1>
        <Link
          href="/admin/landing/new"
          className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? <p className="text-ink/50">No fun facts yet.</p> : <FunFactsList initialItems={items} />}
    </div>
  );
}
