import { listRetainers, listRetainerProjects } from "@/lib/actions/retainers";
import { deleteRetainerAction } from "./actions";
import DeleteButton from "@/components/Admin/ui/DeleteButton";
import {
  PageHeader,
  NewButton,
  EmptyState,
  DataList,
  Row,
  RowLink,
  Badge,
} from "@/components/Admin/ui/Shell";
import { RETAINER_STATUS_LABELS, type RetainerStatus } from "@/lib/constants/retainer-phases";

export const dynamic = "force-dynamic";

export default async function RetainersAdminPage() {
  const items = await listRetainers();

  // One project count per retainer, so the list says how much is in flight
  // rather than just who exists.
  const counts = await Promise.all(
    items.map(async (retainer) => (await listRetainerProjects(retainer.id)).length)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Retainers"
        description="Ongoing clients with named projects moving through production. Each one gets a portal link showing live progress."
        action={<NewButton href="/admin/retainers/new">New retainer</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No retainers yet"
          description="A retainer is an already-signed client with recurring work, as opposed to a lead in the Clients pipeline."
          action={<NewButton href="/admin/retainers/new">New retainer</NewButton>}
        />
      ) : (
        <DataList>
          {items.map((retainer, i) => (
            <Row
              key={retainer.id}
              title={retainer.name}
              meta={[
                retainer.company,
                `${counts[i]} ${counts[i] === 1 ? "project" : "projects"}`,
              ]
                .filter(Boolean)
                .join(" \u00b7 ")}
              badge={
                retainer.status === "active" ? (
                  <Badge tone="live">{RETAINER_STATUS_LABELS[retainer.status as RetainerStatus]}</Badge>
                ) : (
                  <Badge tone="muted">{RETAINER_STATUS_LABELS[retainer.status as RetainerStatus]}</Badge>
                )
              }
              actions={
                <>
                  <RowLink href={`/admin/retainers/${retainer.id}`}>Open</RowLink>
                  <DeleteButton
                    action={deleteRetainerAction.bind(null, retainer.id)}
                    label="retainer"
                  />
                </>
              }
            />
          ))}
        </DataList>
      )}
    </div>
  );
}
