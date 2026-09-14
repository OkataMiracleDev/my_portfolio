import { listCredentials } from "@/lib/actions/animate-credentials";
import { deleteCredentialAction, reorderCredentialsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function CredentialsAdminPage() {
  const items = await listCredentials();

  return (
    <div>
      <PageHeader
        eyebrow="Site content"
        title="Bragging rights"
        description="The stat readout on /animate. Four reads best, because the grid is built for four."
        action={<NewButton href="/admin/credentials/new">New credential</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No credentials yet"
          description="Numbers added here render as the spec sheet on /animate."
          action={<NewButton href="/admin/credentials/new">New credential</NewButton>}
        />
      ) : (
        <SortableList
          label="credential"
          deleteAction={deleteCredentialAction}
          reorderAction={reorderCredentialsAction}
          rows={items.map((item) => ({
            id: item.id,
            title: item.label,
            meta: item.value,
            editHref: `/admin/credentials/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
