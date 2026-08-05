"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteRateCardAction } from "@/app/admin/rate-cards/actions";
import type { rateCards } from "@/lib/db/schema";

type RateCard = typeof rateCards.$inferSelect & { clientName?: string | null };

export default function RateCardsList({ initialItems }: { initialItems: RateCard[] }) {
  const [items, setItems] = useState(initialItems);

  async function handleDelete(id: string, clientId: string | null) {
    if (!confirm("Delete this rate card? This cannot be undone.")) return;
    setItems((prev) => prev.filter((c) => c.id !== id));
    await deleteRateCardAction(id, clientId);
  }

  if (items.length === 0) {
    return <p className="text-ink/50">No rate cards yet.</p>;
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
      {items.map((card) => (
        <li key={card.id} className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex-1">
            <p className="font-semibold text-ink">{card.title}</p>
            <p className="text-sm text-ink/50">
              {card.clientName ? `Client: ${card.clientName}` : "Generic / template"} · {card.lineItems.length} items
            </p>
          </div>
          <Link
            href={`/admin/rate-cards/${card.id}`}
            className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(card.id, card.clientId)}
            className="rounded-pill border border-red-600/30 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600/5"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
