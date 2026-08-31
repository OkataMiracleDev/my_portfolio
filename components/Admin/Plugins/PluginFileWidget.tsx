"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

interface PluginFileWidgetProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
}

export default function PluginFileWidget({ value, onChange }: PluginFileWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Only .zip files are accepted.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "-");
      const blob = await upload(`plugin-files/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/plugins/blob-upload",
        onUploadProgress: (event) => setProgress(Math.round(event.percentage)),
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Plugin file (.zip)</label>
      {value && <p className="mb-3 truncate text-sm text-ink/60">{value}</p>}
      <input
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading… {progress}%</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
