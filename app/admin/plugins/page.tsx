import { listPlugins } from "@/lib/actions/plugins";
import { deletePluginAction, reorderPluginsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function PluginsAdminPage() {
  const items = await listPlugins();

  return (
    <div>
      <PageHeader
        eyebrow="Store"
        title="Plugins"
        description="Paid and pay-what-you-want downloads sold through /animate/resources."
        action={<NewButton href="/admin/plugins/new">New plugin</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No plugins yet"
          description="Published plugins appear in the studio strip on /animate."
          action={<NewButton href="/admin/plugins/new">New plugin</NewButton>}
        />
      ) : (
        <SortableList
          label="plugin"
          deleteAction={deletePluginAction}
          reorderAction={reorderPluginsAction}
          rows={items.map((item) => ({
            id: item.id,
            title: item.title,
            meta: `\u20a6${item.priceAmount.toLocaleString()}${item.pwywEnabled ? " (PWYW)" : ""} \u00b7 ${item.slug}`,
            badge: item.published
              ? { label: "Published", tone: "live" as const }
              : { label: "Draft", tone: "muted" as const },
            editHref: `/admin/plugins/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
