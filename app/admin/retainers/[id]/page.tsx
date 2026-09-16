import { notFound } from "next/navigation";
import Link from "next/link";
import { getRetainer, listRetainerProjects } from "@/lib/actions/retainers";
import { updateRetainerAction } from "../actions";
import RetainerForm from "@/components/Admin/Retainers/RetainerForm";
import RetainerPortalLinkCard from "@/components/Admin/Retainers/RetainerPortalLinkCard";
import RetainerProjectsList from "@/components/Admin/Retainers/RetainerProjectsList";
import { PageHeader, BackLink, EmptyState, NewButton, Badge } from "@/components/Admin/ui/Shell";
import { Meta } from "@/components/Shared/brand/Hud";
import { RETAINER_STATUS_LABELS, type RetainerStatus } from "@/lib/constants/retainer-phases";

export const dynamic = "force-dynamic";

export default async function RetainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [retainer, projects] = await Promise.all([getRetainer(id), listRetainerProjects(id)]);

  if (!retainer) notFound();

  const boundAction = updateRetainerAction.bind(null, id);

  return (
    <div className="space-y-12">
      <div>
        <PageHeader
          eyebrow="Retainers"
          title={
            <span className="flex flex-wrap items-center gap-3">
              {retainer.name}
              {retainer.status !== "active" && (
                <Badge tone="muted">
                  {RETAINER_STATUS_LABELS[retainer.status as RetainerStatus]}
                </Badge>
              )}
            </span>
          }
          action={<BackLink href="/admin/retainers">All retainers</BackLink>}
        />
      </div>

      <RetainerPortalLinkCard retainerId={retainer.id} shareToken={retainer.shareToken} />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Meta className="mb-2 block text-ink/35">Projects</Meta>
            <p className="max-w-xl text-sm leading-relaxed text-ink/45">
              Each project moves through the pipeline independently. Change a phase here, or post
              an update inside a project and it moves itself.
            </p>
          </div>
          <NewButton href={`/admin/retainers/${retainer.id}/projects/new`}>New project</NewButton>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Add the first piece of work so this retainer's portal has something to show."
            action={
              <NewButton href={`/admin/retainers/${retainer.id}/projects/new`}>
                New project
              </NewButton>
            }
          />
        ) : (
          <RetainerProjectsList retainerId={retainer.id} initialItems={projects} />
        )}
      </section>

      <section>
        <Meta className="mb-4 block text-ink/35">Retainer details</Meta>
        <RetainerForm retainer={retainer} action={boundAction} />
      </section>

      <p className="text-xs text-ink/25">
        Deleting this retainer also deletes every project under it and every update on those
        projects.{" "}
        <Link href="/admin/retainers" className="underline underline-offset-2 hover:text-ink/50">
          Back to all retainers
        </Link>
      </p>
    </div>
  );
}
