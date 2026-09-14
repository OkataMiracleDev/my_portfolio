import { listExperienceEntries } from "@/lib/actions/experience";
import { deleteExperienceAction, reorderExperienceAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function ExperienceAdminPage() {
  const items = await listExperienceEntries();

  return (
    <div>
      <PageHeader
        eyebrow="Site content"
        title="Experience"
        description="The card deck on /build. The order here is the order they are dealt."
        action={<NewButton href="/admin/experience/new">New entry</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No experience entries yet"
          description="Entries added here render as the pinned card deck on /build."
          action={<NewButton href="/admin/experience/new">New entry</NewButton>}
        />
      ) : (
        <SortableList
          label="entry"
          deleteAction={deleteExperienceAction}
          reorderAction={reorderExperienceAction}
          rows={items.map((item) => ({
            id: item.id,
            title: `${item.role} \u00b7 ${item.company}`,
            meta: item.year,
            editHref: `/admin/experience/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
