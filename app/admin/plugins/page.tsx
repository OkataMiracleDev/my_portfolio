import Link from "next/link";
import { listPlugins } from "@/lib/actions/plugins";
import PluginsList from "@/components/Admin/Plugins/PluginsList";

export const dynamic = "force-dynamic";

export default async function PluginsAdminPage() {
  const items = await listPlugins();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">Plugins</h1>
        <Link
          href="/admin/plugins/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? <p className="text-ink/50">No plugins yet.</p> : <PluginsList initialItems={items} />}
    </div>
  );
}
