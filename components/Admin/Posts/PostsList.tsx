"use client";

import { useState } from "react";
import Link from "next/link";
import type { posts } from "@/lib/db/schema";
import { deletePostAction } from "@/app/admin/posts/actions";

type Post = typeof posts.$inferSelect;

export default function PostsList({ initialItems }: { initialItems: Post[] }) {
  const [items, setItems] = useState(initialItems);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deletePostAction(id);
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex-1">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="text-sm text-ink/50">
              {item.route} · {item.published ? "Published" : "Draft"}
            </p>
          </div>
          <Link
            href={`/admin/posts/${item.id}`}
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
