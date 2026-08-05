import Link from "next/link";
import { listRateCards } from "@/lib/actions/rate-cards";
import { listClients } from "@/lib/actions/clients";
import RateCardsList from "@/components/Admin/RateCards/RateCardsList";

export const dynamic = "force-dynamic";

export default async function RateCardsAdminPage() {
  const [cards, clients] = await Promise.all([listRateCards(), listClients()]);
  const clientNameById = new Map(clients.map((c) => [c.id, c.name]));
  const items = cards.map((card) => ({
    ...card,
    clientName: card.clientId ? clientNameById.get(card.clientId) ?? null : null,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Rate Cards
        </h1>
        <Link
          href="/admin/rate-cards/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      <RateCardsList initialItems={items} />
    </div>
  );
}
