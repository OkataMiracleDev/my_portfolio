import ClientForm from "@/components/Admin/Clients/ClientForm";
import { createClientAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewClientPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title={<>New Client</>}
        action={<BackLink href="/admin/clients">All clients</BackLink>}
      />
      <ClientForm action={createClientAction} />
    </div>
  );
}
