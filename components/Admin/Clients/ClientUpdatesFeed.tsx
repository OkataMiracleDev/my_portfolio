"use client";

import Image from "next/image";
import { deleteClientUpdateAction } from "@/app/admin/clients/actions";
import type { clientUpdates } from "@/lib/db/schema";
import ConfirmButton from "@/components/Admin/ui/ConfirmButton";

type ClientUpdate = typeof clientUpdates.$inferSelect;

export default function ClientUpdatesFeed({
  clientId,
  items,
  onDeleted,
}: {
  clientId: string;
  items: ClientUpdate[];
  onDeleted: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-ink/50">No updates posted yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {items.map((update) => (
        <li key={update.id} className="rounded-2xl border border-ink/10 bg-frame p-5">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{update.title}</p>
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-ink/40">
                {new Date(update.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Removes the row only once the server confirms, instead of
                optimistically and never checking. */}
            <ConfirmButton
              onConfirm={async () => {
                await deleteClientUpdateAction(update.id, clientId);
                onDeleted(update.id);
              }}
              confirmLabel="Delete"
              pendingLabel="Deleting"
            >
              Delete
            </ConfirmButton>
          </div>
          {update.body && <p className="mb-3 text-sm text-ink/70">{update.body}</p>}
          {update.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {update.images.map((url, i) => (
                <div key={`${url}-${i}`} className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          {update.videoEmbedUrl && (
            <p className="mt-2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
              + video attached
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
