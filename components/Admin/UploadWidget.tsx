"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/lib/blob-client";
import { UPLOAD_KINDS, type UploadKind } from "@/lib/blob-kinds";

interface UploadWidgetProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  kind?: UploadKind;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function UploadWidget({ label, value, onChange, kind = "image", onUploadingChange }: UploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);
    setError(null);

    try {
      onChange(await uploadFile(file, kind, setProgress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">{label}</label>
      {value && kind === "image" && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-xl">
          <Image src={value} alt="" fill quality={90} className="object-cover" />
        </div>
      )}
      {value && kind !== "image" && (
        <p className="mb-3 truncate text-sm text-ink/60">{value}</p>
      )}
      <input
        type="file"
        accept={UPLOAD_KINDS[kind].accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading… {progress}%</p>}
      {error && <p className="mt-2 text-sm text-signal">{error}</p>}
    </div>
  );
}
