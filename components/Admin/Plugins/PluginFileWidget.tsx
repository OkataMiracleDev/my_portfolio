"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/blob-client";
import { UPLOAD_KINDS } from "@/lib/blob-kinds";

interface PluginFileWidgetProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function PluginFileWidget({ value, onChange, onUploadingChange }: PluginFileWidgetProps) {
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
    onUploadingChange?.(true);
    setError(null);

    try {
      onChange(await uploadFile(file, "plugin-file", setProgress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Plugin file (.zip)</label>
      {value && <p className="mb-3 truncate text-sm text-ink/60">{value}</p>}
      <input
        type="file"
        accept={UPLOAD_KINDS["plugin-file"].accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading… {progress}%</p>}
      {error && <p className="mt-2 text-sm text-signal">{error}</p>}
    </div>
  );
}
