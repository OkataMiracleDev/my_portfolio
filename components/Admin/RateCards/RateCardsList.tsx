import DeleteButton from "@/components/Admin/ui/DeleteButton";
import { DataList, Row, RowLink } from "@/components/Admin/ui/Shell";
import { deleteRateCardAction } from "@/app/admin/rate-cards/actions";
import type { rateCards } from "@/lib/db/schema";

type RateCard = typeof rateCards.$inferSelect & { clientName?: string | null };

/**
 * No longer a client component. It held `useState` purely to support an
 * optimistic delete whose result was never checked; DeleteButton owns the
 * mutation now and refreshes the route, so this is just markup.
 */
export default function RateCardsList({ initialItems }: { initialItems: RateCard[] }) {
  return (
    <DataList>
      {initialItems.map((card) => (
        <Row
          key={card.id}
          title={card.title}
          meta={`${
            card.clientName ? `Client: ${card.clientName}` : "Generic / template"
          } \u00b7 ${card.lineItems.length} ${card.lineItems.length === 1 ? "item" : "items"}`}
          actions={
            <>
              <RowLink href={`/admin/rate-cards/${card.id}`}>Edit</RowLink>
              <DeleteButton
                action={deleteRateCardAction.bind(null, card.id, card.clientId)}
                label="rate card"
              />
            </>
          }
        />
      ))}
    </DataList>
  );
}
