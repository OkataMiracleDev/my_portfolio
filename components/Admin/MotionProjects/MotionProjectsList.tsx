"use client";

import { useState } from "react";
import Link from "next/link";
import type { motionProjects } from "@/lib/db/schema";
import { deleteMotionProjectAction, reorderMotionProjectsAction } from "@/app/admin/projects/animate/actions";

type MotionProject = typeof motionProjects.$inferSelect;

export default function MotionProjectsList({ initialItems }: { initialItems: MotionProject[] }) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setItems(next);
    setDragIndex(null);
    reorderMotionProjectsAction(next.map((item) => item.id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deleteMotionProjectAction(id);
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
            <p className="text-sm text-ink/50">{item.slug}</p>
          </div>
          {item.featuredOnHome && (
            <span className="rounded-pill bg-accent-animate/15 px-3 py-1 text-xs font-medium text-accent-animate">
              Featured
            </span>
          )}
          <Link
            href={`/admin/projects/animate/${item.id}`}
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
