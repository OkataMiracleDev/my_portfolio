"use client";

import { useState } from "react";
import Image from "next/image";

interface UploadWidgetProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  kind?: "image" | "download";
}

export default function UploadWidget({ label, value, onChange, kind = "image" }: UploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      {value && kind === "image" && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-xl">
          <Image src={value} alt="" fill className="object-cover" />
        </div>
      )}
      {value && kind === "download" && (
        <p className="mb-3 truncate text-sm text-ink/60">{value}</p>
      )}
      <input
        type="file"
        accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "application/pdf,application/zip"}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
