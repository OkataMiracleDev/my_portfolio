import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient, listClientUpdates } from "@/lib/actions/clients";
import { listRateCards } from "@/lib/actions/rate-cards";
import ClientForm from "@/components/Admin/Clients/ClientForm";
import PortalLinkCard from "@/components/Admin/Clients/PortalLinkCard";
import ClientUpdatesSection from "@/components/Admin/Clients/ClientUpdatesSection";
import { updateClientAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, updates, allRateCards] = await Promise.all([
    getClient(id),
    listClientUpdates(id),
    listRateCards(),
  ]);

  if (!client) notFound();

  const rateCardsForClient = allRateCards.filter((card) => card.clientId === id);
  const boundAction = updateClientAction.bind(null, id);

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <Link href="/admin/clients" className="mb-4 inline-block text-sm text-ink/50 hover:text-ink">
          ← All clients
        </Link>
        <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          {client.name}
        </h1>
        <ClientForm client={client} action={boundAction} />
      </div>

      <PortalLinkCard clientId={client.id} shareToken={client.shareToken} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
            Rate cards
          </h2>
          <Link
            href={`/admin/rate-cards/new?clientId=${client.id}`}
            className="text-sm font-medium text-accent-animate hover:underline"
          >
            + New rate card for {client.name}
          </Link>
        </div>
        {rateCardsForClient.length === 0 ? (
          <p className="text-sm text-ink/50">No rate cards for this client yet.</p>
        ) : (
          <ul className="space-y-2">
            {rateCardsForClient.map((card) => (
              <li key={card.id}>
                <Link
                  href={`/admin/rate-cards/${card.id}`}
                  className="block rounded-xl border border-ink/10 bg-base-raised px-4 py-3 text-sm font-medium text-ink hover:bg-ink/5"
                >
                  {card.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          Progress updates
        </h2>
        <p className="mb-4 text-sm text-ink/50">
          Posted updates show up on {client.name}&apos;s portal link above, newest first.
        </p>
        <ClientUpdatesSection clientId={client.id} initialItems={updates} />
      </section>
    </div>
  );
}
