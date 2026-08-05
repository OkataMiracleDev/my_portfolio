"use client";

import { useRef, useState } from "react";
import BulkUploadWidget from "@/components/Admin/BulkUploadWidget";
import { createClientUpdateAction } from "@/app/admin/clients/actions";
import type { clientUpdates } from "@/lib/db/schema";

type ClientUpdate = typeof clientUpdates.$inferSelect;

export default function ClientUpdateForm({
  clientId,
  onCreated,
}: {
  clientId: string;
  onCreated: (update: ClientUpdate) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setPending(true);
    try {
      const created = await createClientUpdateAction(formData);
      if (created) onCreated(created);
      formRef.current?.reset();
      setImages([]);
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-card border border-ink/10 bg-base-raised p-6">
      <input type="hidden" name="clientId" value={clientId} />
      {images.map((url, i) => (
        <input key={`${url}-${i}`} type="hidden" name="images" value={url} />
      ))}

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Update title</label>
        <input
          name="title"
          required
          placeholder="e.g. First cut delivered"
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Details (optional)</label>
        <textarea
          name="body"
          rows={3}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Video embed URL (optional)</label>
        <input
          name="videoEmbedUrl"
          type="url"
          placeholder="https://www.youtube.com/embed/..."
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      <BulkUploadWidget label="Images (optional)" values={images} onChange={setImages} onUploadingChange={setUploading} />

      <button
        type="submit"
        disabled={pending || uploading}
        className={`rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
          pending || uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading…" : pending ? "Posting…" : "Post update"}
      </button>
    </form>
  );
}
