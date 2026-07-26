"use client";

import { useState } from "react";
import Link from "next/link";
import type { testimonials } from "@/lib/db/schema";
import { deleteTestimonialAction, reorderTestimonialsAction } from "@/app/admin/testimonials/actions";

type Testimonial = typeof testimonials.$inferSelect;
type RouteFilter = "all" | Testimonial["route"];

export default function TestimonialsList({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<RouteFilter>("all");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const visible = filter === "all" ? items : items.filter((item) => item.route === filter);

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setItems(next);
    setDragIndex(null);
    reorderTestimonialsAction(next.map((item) => item.id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deleteTestimonialAction(id);
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "build", "animate"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-pill px-4 py-2 text-sm font-medium ${
              filter === f ? "bg-ink text-base" : "bg-ink/5 text-ink/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
        {visible.map((item) => {
          const index = items.indexOf(item);
          return (
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
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-ink/50">{item.route}</p>
              </div>
              <Link
                href={`/admin/testimonials/${item.id}`}
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
          );
        })}
      </ul>
    </div>
  );
}
