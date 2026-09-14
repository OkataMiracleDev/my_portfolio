import RateCardForm from "@/components/Admin/RateCards/RateCardForm";
import { listClients } from "@/lib/actions/clients";
import { createRateCardAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function NewRateCardPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const [clients, { clientId }] = await Promise.all([listClients(), searchParams]);

  return (
    <div>
      <PageHeader
        eyebrow="Rate cards"
        title={<>New Rate Card</>}
        action={<BackLink href="/admin/rate-cards">All rate cards</BackLink>}
      />
      <RateCardForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        defaultClientId={clientId}
        action={createRateCardAction}
      />
    </div>
  );
}
