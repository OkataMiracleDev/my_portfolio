"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CLIENT_STAGES } from "@/lib/actions/clients";
import { updateClientStageAction, deleteClientAction } from "@/app/admin/clients/actions";
import type { clients } from "@/lib/db/schema";

type Client = typeof clients.$inferSelect;

const STAGE_LABELS: Record<(typeof CLIENT_STAGES)[number], string> = {
  lead: "Lead",
  conversation: "First conversation",
  meeting: "Meeting",
  proposal_sent: "Proposal sent",
  deposit_paid: "Deposit paid",
  in_progress: "In progress",
  completed: "Completed",
  lost: "Lost",
};

export default function ClientsList({ initialItems }: { initialItems: Client[] }) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  function handleStageChange(id: string, stage: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, stage: stage as Client["stage"] } : c)));
    startTransition(() => {
      updateClientStageAction(id, stage);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client and all their updates/rate cards? This cannot be undone.")) return;
    setItems((prev) => prev.filter((c) => c.id !== id));
    await deleteClientAction(id);
  }

  const groups = CLIENT_STAGES.map((stage) => ({
    stage,
    clients: items.filter((c) => c.stage === stage),
  })).filter((group) => group.clients.length > 0);

  if (items.length === 0) {
    return <p className="text-ink/50">No clients yet.</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.stage}>
          <h2 className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
            {STAGE_LABELS[group.stage]} ({group.clients.length})
          </h2>
          <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
            {group.clients.map((client) => (
              <li key={client.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div className="flex-1">
                  <Link href={`/admin/clients/${client.id}`} className="font-semibold text-ink hover:underline">
                    {client.name}
                  </Link>
                  {client.company && <p className="text-sm text-ink/50">{client.company}</p>}
                </div>

                <select
                  value={client.stage}
                  disabled={isPending}
                  onChange={(e) => handleStageChange(client.id, e.target.value)}
                  className="rounded-lg border border-ink/15 bg-base px-3 py-2 text-sm text-ink"
                >
                  {CLIENT_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {STAGE_LABELS[stage]}
                    </option>
                  ))}
                </select>

                <Link
                  href={`/admin/clients/${client.id}`}
                  className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="rounded-pill border border-red-600/30 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600/5"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
