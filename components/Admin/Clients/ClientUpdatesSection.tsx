"use client";

import { useState } from "react";
import ClientUpdateForm from "./ClientUpdateForm";
import ClientUpdatesFeed from "./ClientUpdatesFeed";
import type { clientUpdates } from "@/lib/db/schema";

type ClientUpdate = typeof clientUpdates.$inferSelect;

export default function ClientUpdatesSection({
  clientId,
  initialItems,
}: {
  clientId: string;
  initialItems: ClientUpdate[];
}) {
  const [items, setItems] = useState(initialItems);

  function handleCreated(update: ClientUpdate) {
    setItems((prev) => [update, ...prev]);
  }

  function handleDeleted(id: string) {
    setItems((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <ClientUpdateForm clientId={clientId} onCreated={handleCreated} />
      <ClientUpdatesFeed clientId={clientId} items={items} onDeleted={handleDeleted} />
    </div>
  );
}
