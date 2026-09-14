import { listRateCards } from "@/lib/actions/rate-cards";
import { listClients } from "@/lib/actions/clients";
import RateCardsList from "@/components/Admin/RateCards/RateCardsList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function RateCardsAdminPage() {
  const [cards, clients] = await Promise.all([listRateCards(), listClients()]);

  // Denormalise the client name once here rather than making the list
  // component look it up per row.
  const items = cards.map((card) => ({
    ...card,
    clientName: clients.find((client) => client.id === card.clientId)?.name ?? null,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Rate cards"
        description="Per-client cards shown behind a portal link. For the public one, use Rate card page."
        action={<NewButton href="/admin/rate-cards/new">New rate card</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No rate cards yet"
          description="Build one per client, then share it through their portal link."
          action={<NewButton href="/admin/rate-cards/new">New rate card</NewButton>}
        />
      ) : (
        <RateCardsList initialItems={items} />
      )}
    </div>
  );
}
