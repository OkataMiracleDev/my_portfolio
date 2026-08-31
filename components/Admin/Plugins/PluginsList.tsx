"use client";

import { useState } from "react";
import Link from "next/link";
import type { studioPlugins } from "@/lib/db/schema";
import { deletePluginAction, reorderPluginsAction } from "@/app/admin/plugins/actions";

type Plugin = typeof studioPlugins.$inferSelect;

export default function PluginsList({ initialItems }: { initialItems: Plugin[] }) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setItems(next);
    setDragIndex(null);
    reorderPluginsAction(next.map((item) => item.id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plugin? This cannot be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deletePluginAction(id);
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className="flex cursor-grab items-center justify-between gap-4 px-6 py-4"
        >
          <span className="text-ink/30">⠿</span>
          <div className="flex-1">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="text-sm text-ink/50">
              {item.published ? "Published" : "Draft"} · ₦{item.priceAmount.toLocaleString()}
              {item.pwywEnabled ? " (PWYW)" : ""} · {item.slug}
            </p>
          </div>
          <Link
            href={`/admin/plugins/${item.id}`}
            className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded-pill border border-red-600/30 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600/5"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
