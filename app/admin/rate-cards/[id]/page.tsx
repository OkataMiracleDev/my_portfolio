import { notFound } from "next/navigation";
import RateCardForm from "@/components/Admin/RateCards/RateCardForm";
import { getRateCard } from "@/lib/actions/rate-cards";
import { listClients } from "@/lib/actions/clients";
import { updateRateCardAction } from "../actions";

export default async function EditRateCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rateCard, clients] = await Promise.all([getRateCard(id), listClients()]);
  if (!rateCard) notFound();

  const boundAction = updateRateCardAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {rateCard.title}
      </h1>
      <RateCardForm
        rateCard={rateCard}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        action={boundAction}
      />
    </div>
  );
}
