import Link from "next/link";
import { notFound } from "next/navigation";
import RateCardForm from "@/components/Admin/RateCards/RateCardForm";
import { getRateCard } from "@/lib/actions/rate-cards";
import { getClient, listClients } from "@/lib/actions/clients";
import PortalLinkCard from "@/components/Admin/Clients/PortalLinkCard";
import { updateRateCardAction } from "../actions";

export default async function EditRateCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rateCard, clients] = await Promise.all([getRateCard(id), listClients()]);
  if (!rateCard) notFound();

  const client = rateCard.clientId ? await getClient(rateCard.clientId) : null;
  const boundAction = updateRateCardAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {rateCard.title}
      </h1>

      {client ? (
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-sm text-ink/50">
            This rate card shows up on {client.name}&apos;s portal link — share this with them:
          </p>
          <PortalLinkCard clientId={client.id} shareToken={client.shareToken} />
        </div>
      ) : (
        <div className="mb-6 max-w-2xl rounded-card border border-ink/10 bg-base-raised p-5 text-sm text-ink/60">
          This is a generic/template rate card, so there&apos;s no shareable link for it yet. Assign it
          to a client below to get a portal link you can send them, or{" "}
          <Link href="/admin/clients" className="text-accent-animate hover:underline">
            go create a client
          </Link>{" "}
          first.
        </div>
      )}

      <RateCardForm
        rateCard={rateCard}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        action={boundAction}
      />
    </div>
  );
}
