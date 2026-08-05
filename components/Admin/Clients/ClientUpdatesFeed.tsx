"use client";

import Image from "next/image";
import { deleteClientUpdateAction } from "@/app/admin/clients/actions";
import type { clientUpdates } from "@/lib/db/schema";

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
  async function handleDelete(id: string) {
    if (!confirm("Delete this update? The client will no longer see it on their portal.")) return;
    onDeleted(id);
    await deleteClientUpdateAction(id, clientId);
  }

  if (items.length === 0) {
    return <p className="text-sm text-ink/50">No updates posted yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {items.map((update) => (
        <li key={update.id} className="rounded-card border border-ink/10 bg-base-raised p-5">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{update.title}</p>
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-ink/40">
                {new Date(update.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(update.id)}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Delete
            </button>
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
