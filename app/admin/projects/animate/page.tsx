import { listMotionProjects } from "@/lib/actions/motion-projects";
import { deleteMotionProjectAction, reorderMotionProjectsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function MotionProjectsPage() {
  const items = await listMotionProjects();

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Motion projects"
        description="Motion case studies shown on /animate. The first featured one takes the lead frame on the index."
        action={<NewButton href="/admin/projects/animate/new">New project</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No motion projects yet"
          description="Projects added here show up on /animate and /animate/projects."
          action={<NewButton href="/admin/projects/animate/new">New project</NewButton>}
        />
      ) : (
        <SortableList
          label="project"
          deleteAction={deleteMotionProjectAction}
          reorderAction={reorderMotionProjectsAction}
          rows={items.map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.slug,
            badge: item.featuredOnHome
              ? { label: "Featured", tone: "live" as const }
              : undefined,
            editHref: `/admin/projects/animate/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
