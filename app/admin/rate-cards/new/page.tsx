import RateCardForm from "@/components/Admin/RateCards/RateCardForm";
import { listClients } from "@/lib/actions/clients";
import { createRateCardAction } from "../actions";

export default async function NewRateCardPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const [clients, { clientId }] = await Promise.all([listClients(), searchParams]);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Rate Card
      </h1>
      <RateCardForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        defaultClientId={clientId}
        action={createRateCardAction}
      />
    </div>
  );
}
