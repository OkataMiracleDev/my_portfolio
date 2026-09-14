"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import PluginFileWidget from "./PluginFileWidget";
import type { studioPlugins } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, FormShell, Checkbox } from "@/components/Admin/ui/Fields";

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
    <FormShell action={action}>
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

      {/* No `name` on either: both values post through the hidden inputs
          above, and naming these would submit each one twice. */}
      <Checkbox
        label="Allow pay what you want"
        checked={pwywEnabled}
        onChange={setPwywEnabled}
        hint="Buyers can choose to pay ₦0."
      />

      <Checkbox
        label="Published"
        checked={published}
        onChange={setPublished}
        hint="Visible in the studio strip on /animate."
      />

      <SubmitButton accent="animate" />
    </FormShell>
  );
}
