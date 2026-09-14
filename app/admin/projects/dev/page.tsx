import { listDevProjects } from "@/lib/actions/dev-projects";
import { deleteDevProjectAction, reorderDevProjectsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function DevProjectsPage() {
  const items = await listDevProjects();

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Dev projects"
        description="Frontend case studies shown on /build. Drag the handle or use the arrows to change the order they appear in."
        action={<NewButton href="/admin/projects/dev/new">New project</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No dev projects yet"
          description="Projects added here show up on /build and /build/projects."
          action={<NewButton href="/admin/projects/dev/new">New project</NewButton>}
        />
      ) : (
        <SortableList
          label="project"
          deleteAction={deleteDevProjectAction}
          reorderAction={reorderDevProjectsAction}
          rows={items.map((item) => ({
            id: item.id,
            title: item.name,
            meta: item.slug,
            badge: item.featuredOnHome
              ? { label: "Featured", tone: "live" as const }
              : undefined,
            editHref: `/admin/projects/dev/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
