import { notFound } from "next/navigation";
import {
  getRetainer,
  getRetainerProject,
  listRetainerUpdates,
} from "@/lib/actions/retainers";
import { updateRetainerProjectAction } from "../../../actions";
import RetainerProjectForm from "@/components/Admin/Retainers/RetainerProjectForm";
import RetainerUpdatesSection from "@/components/Admin/Retainers/RetainerUpdatesSection";
import PhaseTrack, { PhaseBadge } from "@/components/Shared/PhaseTrack";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";
import { Meta } from "@/components/Shared/brand/Hud";

export const dynamic = "force-dynamic";

export default async function RetainerProjectPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  const [retainer, project, updates] = await Promise.all([
    getRetainer(id),
    getRetainerProject(projectId),
    listRetainerUpdates(projectId),
  ]);

  if (!retainer || !project) notFound();
  // A project id from another retainer would otherwise render happily under
  // the wrong client's heading.
  if (project.retainerClientId !== id) notFound();

  const boundAction = updateRetainerProjectAction.bind(null, projectId);

  return (
    <div className="space-y-12">
      <div>
        <PageHeader
          eyebrow={retainer.name}
          title={
            <span className="flex flex-wrap items-center gap-3">
              {project.name}
              <PhaseBadge phase={project.phase} />
            </span>
          }
          description={project.description ?? undefined}
          action={<BackLink href={`/admin/retainers/${id}`}>Back to {retainer.name}</BackLink>}
        />
      </div>

      <section>
        <Meta className="mb-4 block text-ink/35">Pipeline</Meta>
        <PhaseTrack phase={project.phase} />
      </section>

      <section>
        <Meta className="mb-4 block text-ink/35">Post an update</Meta>
        <RetainerUpdatesSection
          projectId={project.id}
          currentPhase={project.phase}
          initialItems={updates}
        />
      </section>

      <section>
        <Meta className="mb-4 block text-ink/35">Project details</Meta>
        <RetainerProjectForm
          retainerClientId={id}
          project={project}
          action={boundAction}
        />
      </section>
    </div>
  );
}
