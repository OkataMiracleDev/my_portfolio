import { listResources } from "@/lib/actions/resources";
import { deleteResourceAction, reorderResourcesAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function ResourcesAdminPage() {
  const items = await listResources();

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Resources"
        description="Downloads, tutorials and tool links published on /animate/resources."
        action={<NewButton href="/admin/resources/new">New resource</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Resources appear on /animate and the resources hub."
          action={<NewButton href="/admin/resources/new">New resource</NewButton>}
        />
      ) : (
        <SortableList
          label="resource"
          deleteAction={deleteResourceAction}
          reorderAction={reorderResourcesAction}
          filters={[
            { value: "all", label: "All" },
            { value: "download", label: "Download" },
            { value: "tutorial", label: "Tutorial" },
            { value: "tool-link", label: "Tool link" },
          ]}
          rows={items.map((item) => ({
            id: item.id,
            title: item.title,
            meta: `${item.type} \u00b7 ${item.slug}`,
            editHref: `/admin/resources/${item.id}`,
            filterValue: item.type,
          }))}
        />
      )}
    </div>
  );
}
