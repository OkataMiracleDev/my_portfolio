"use client";

import { useState } from "react";
import Image from "next/image";

interface BulkUploadWidgetProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function BulkUploadWidget({ label, values, onChange, onUploadingChange }: BulkUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    onUploadingChange?.(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", "image");
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? `Upload failed for ${file.name}`);
        uploaded.push(data.url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      e.target.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>

      {values.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {values.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs leading-none text-base opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
