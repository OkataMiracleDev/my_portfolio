"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CLIENT_STAGES } from "@/lib/constants/client-stages";
import { updateClientStageAction, deleteClientAction } from "@/app/admin/clients/actions";
import DeleteButton from "@/components/Admin/ui/DeleteButton";
import { Badge, DataList, Row, RowLink } from "@/components/Admin/ui/Shell";
import { Meta } from "@/components/Shared/brand/Hud";
import type { clients } from "@/lib/db/schema";

type Client = typeof clients.$inferSelect;
type Stage = (typeof CLIENT_STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  lead: "Lead",
  conversation: "First conversation",
  meeting: "Meeting",
  proposal_sent: "Proposal sent",
  deposit_paid: "Deposit paid",
  in_progress: "In progress",
  completed: "Completed",
  lost: "Lost",
};

/** Stages that mean money is committed get the live treatment. */
const COMMITTED: ReadonlySet<Stage> = new Set(["deposit_paid", "in_progress", "completed"]);

/**
 * The client pipeline, grouped by stage.
 *
 * Kept as its own component rather than folded into SortableList: clients are
 * not ordered by hand, they are grouped by where they are in the funnel, and
 * each row carries a stage selector that the generic list has no concept of.
 *
 * Two fixes over the previous version. The stage change was fired inside a
 * transition and its result never checked, so a failed write left the dropdown
 * showing the new stage and the database holding the old one -- it now reverts
 * and says so. And the delete used `window.confirm` plus an unchecked
 * optimistic removal, which is what DeleteButton exists to replace.
 */
export default function ClientsList({ initialItems }: { initialItems: Client[] }) {
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function handleStageChange(id: string, stage: string) {
    const previous = items;
    setItems((current) =>
      current.map((client) =>
        client.id === id ? { ...client, stage: stage as Client["stage"] } : client
      )
    );

    startTransition(async () => {
      try {
        await updateClientStageAction(id, stage);
      } catch (error) {
        console.error(error);
        setItems(previous);
        toast.error("Could not update that stage.");
      }
    });
  }

  const groups = CLIENT_STAGES.map((stage) => ({
    stage,
    clients: items.filter((client) => client.stage === stage),
  })).filter((group) => group.clients.length > 0);

  return (
    <div className="space-y-9">
      {groups.map((group) => (
        <section key={group.stage}>
          <Meta className="mb-3 flex items-center gap-3 text-ink/35">
            <span className={COMMITTED.has(group.stage) ? "text-accent-build" : undefined}>
              {STAGE_LABELS[group.stage]}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-ink/15" />
            <span>{String(group.clients.length).padStart(2, "0")}</span>
          </Meta>

          <DataList>
            {group.clients.map((client) => (
              <Row
                key={client.id}
                title={
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="transition-colors duration-200 ease-out hover:text-accent-build"
                  >
                    {client.name}
                  </Link>
                }
                meta={client.company}
                badge={
                  COMMITTED.has(group.stage) ? (
                    <Badge tone="live">{STAGE_LABELS[group.stage]}</Badge>
                  ) : undefined
                }
                actions={
                  <>
                    <label className="sr-only" htmlFor={`stage-${client.id}`}>
                      Stage for {client.name}
                    </label>
                    <select
                      id={`stage-${client.id}`}
                      value={client.stage}
                      disabled={pending}
                      onChange={(event) => handleStageChange(client.id, event.target.value)}
                      className="rounded-lg border border-ink/12 bg-stage px-2.5 py-1.5 text-xs text-ink/70 transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build disabled:opacity-50"
                    >
                      {CLIENT_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {STAGE_LABELS[stage]}
                        </option>
                      ))}
                    </select>
                    <RowLink href={`/admin/clients/${client.id}`}>Open</RowLink>
                    <DeleteButton
                      action={deleteClientAction.bind(null, client.id)}
                      label="client"
                    />
                  </>
                }
              />
            ))}
          </DataList>
        </section>
      ))}
    </div>
  );
}
