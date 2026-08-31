"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import PluginFileWidget from "./PluginFileWidget";
import type { studioPlugins } from "@/lib/db/schema";

type Plugin = typeof studioPlugins.$inferSelect;

interface PluginFormProps {
  plugin?: Plugin;
  action: (formData: FormData) => void;
}

export default function PluginForm({ plugin, action }: PluginFormProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState(plugin?.thumbnailUrl ?? "");
  const [fileUrl, setFileUrl] = useState(plugin?.fileUrl ?? "");
  const [pwywEnabled, setPwywEnabled] = useState(plugin?.pwywEnabled ?? false);
  const [published, setPublished] = useState(plugin?.published ?? false);
  const [thumbnailWarning, setThumbnailWarning] = useState<string | null>(null);

  // UploadWidget is shared with resources/testimonials/etc, so the 1:1
  // check lives here rather than inside it — a non-blocking warning only,
  // since a slightly-off thumbnail shouldn't stop a save.
  function handleThumbnailChange(url: string) {
    setThumbnailUrl(url);
    setThumbnailWarning(null);
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        setThumbnailWarning("This image isn't square (1:1) — it'll be cropped in the grid.");
      }
    };
    img.src = url;
  }

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
      <input type="hidden" name="fileUrl" value={fileUrl} />
      <input type="hidden" name="pwywEnabled" value={pwywEnabled ? "on" : ""} />
      <input type="hidden" name="published" value={published ? "on" : ""} />

      <Field label="Title" name="title" defaultValue={plugin?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={plugin?.slug}
        required
        pattern="[a-z0-9-]+"
        patternTitle="Lowercase letters, numbers, and hyphens only"
      />
      <TextArea label="Description" name="description" defaultValue={plugin?.description} required />
      <Field label="Tags (comma-separated)" name="tags" defaultValue={plugin?.tags.join(", ")} required />

      <div>
        <UploadWidget label="Thumbnail (1:1)" value={thumbnailUrl} onChange={handleThumbnailChange} kind="image" />
        {thumbnailWarning && <p className="mt-2 text-sm text-amber-600">{thumbnailWarning}</p>}
      </div>

      <PluginFileWidget value={fileUrl} onChange={setFileUrl} />

      <Field
        label="Price (₦)"
        name="priceAmount"
        type="number"
        defaultValue={plugin ? String(plugin.priceAmount) : "0"}
        required
      />

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input
          type="checkbox"
          checked={pwywEnabled}
          onChange={(e) => setPwywEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-ink/30"
        />
        Allow pay what you want (buyers can pay ₦0)
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-ink/30"
        />
        Published (visible on the live site)
      </label>

      <button
        type="submit"
        className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  pattern,
  patternTitle,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
  pattern?: string;
  patternTitle?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        pattern={pattern}
        title={patternTitle}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={5}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}
