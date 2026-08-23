"use client";

import { useState } from "react";
import LineItemsEditor, { type LineItem } from "./LineItemsEditor";
import { CURRENCIES } from "@/lib/constants/currencies";
import type { rateCards } from "@/lib/db/schema";

type RateCard = typeof rateCards.$inferSelect;

interface RateCardFormProps {
  rateCard?: RateCard;
  clients: { id: string; name: string }[];
  defaultClientId?: string;
  action: (formData: FormData) => void;
}

export default function RateCardForm({ rateCard, clients, defaultClientId, action }: RateCardFormProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(
    rateCard?.lineItems && rateCard.lineItems.length > 0
      ? rateCard.lineItems
      : [{ section: "", title: "", description: "", price: "", unit: "" }]
  );
  const [layout, setLayout] = useState<"flat" | "sectioned">(rateCard?.layout ?? "flat");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const hasValidItem = lineItems.some((item) => item.title.trim() && item.price.trim());
    if (!hasValidItem) {
      e.preventDefault();
      setError("Add at least one line item with a title and price.");
    } else {
      setError(null);
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <input type="hidden" name="layout" value={layout} />
      {lineItems.map((item, i) => (
        <div key={i}>
          <input type="hidden" name="lineItemSection" value={item.section ?? ""} />
          <input type="hidden" name="lineItemTitle" value={item.title} />
          <input type="hidden" name="lineItemDescription" value={item.description} />
          <input type="hidden" name="lineItemPrice" value={item.price} />
          <input type="hidden" name="lineItemUnit" value={item.unit} />
        </div>
      ))}

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Title</label>
        <input
          name="title"
          defaultValue={rateCard?.title}
          required
          placeholder="e.g. Rate card — Acme Co."
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Client (optional)</label>
        <select
          name="clientId"
          defaultValue={rateCard?.clientId ?? defaultClientId ?? ""}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
        >
          <option value="">— Generic / template —</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink/50">
          Assign a client to show this on their portal link instead of a generic template.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">Currency</label>
          <select
            name="currency"
            defaultValue={rateCard?.currency ?? "USD"}
            className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink/50">
            Shown as a badge on the card. Keep typing prices as free text (symbols, ranges, "/mo") —
            this doesn&apos;t reformat them.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">Layout</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLayout("flat")}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                layout === "flat"
                  ? "border-accent-animate bg-accent-animate/10 text-ink"
                  : "border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              Flat list
            </button>
            <button
              type="button"
              onClick={() => setLayout("sectioned")}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                layout === "sectioned"
                  ? "border-accent-animate bg-accent-animate/10 text-ink"
                  : "border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              Grouped sections
            </button>
          </div>
          <p className="mt-1 text-xs text-ink/50">
            Sectioned groups line items under named tracks (e.g. Project work, Retainer, Add-ons).
          </p>
        </div>
      </div>

      <div>
        <LineItemsEditor items={lineItems} onChange={setLineItems} sectioned={layout === "sectioned"} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Terms (public, one per line)</label>
        <textarea
          name="terms"
          defaultValue={rateCard?.terms?.join("\n") ?? ""}
          rows={4}
          placeholder={"e.g. 50% deposit to start, balance due on final delivery\n2 rounds of revisions included per project"}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
        <p className="mt-1 text-xs text-ink/50">Shown as a bullet list under the rate card on the client portal.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Notes (internal, optional)</label>
        <textarea
          name="notes"
          defaultValue={rateCard?.notes ?? ""}
          rows={3}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      <button
        type="submit"
        className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
      >
        Save
      </button>
    </form>
  );
}
