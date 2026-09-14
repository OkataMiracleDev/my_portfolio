import { listClients } from "@/lib/actions/clients";
import ClientsList from "@/components/Admin/Clients/ClientsList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function ClientsAdminPage() {
  const items = await listClients();

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Clients"
        description="The pipeline, grouped by stage. Open a client for their updates and portal link."
        action={<NewButton href="/admin/clients/new">New client</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Add a client to track their stage and share a portal link with them."
          action={<NewButton href="/admin/clients/new">New client</NewButton>}
        />
      ) : (
        <ClientsList initialItems={items} />
      )}
    </div>
  );
}
