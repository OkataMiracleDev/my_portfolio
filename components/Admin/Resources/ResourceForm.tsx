"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { resources } from "@/lib/db/schema";

type Resource = typeof resources.$inferSelect;

interface ResourceFormProps {
  resource?: Resource;
  action: (formData: FormData) => void;
}

export default function ResourceForm({ resource, action }: ResourceFormProps) {
  const [type, setType] = useState(resource?.type ?? "download");
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="fileUrl" value={fileUrl ?? ""} />

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Type</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
        >
          <option value="download">Download</option>
          <option value="tutorial">Tutorial</option>
          <option value="tool-link">Tool link</option>
        </select>
      </div>

      <Field
        label="Slug"
        name="slug"
        defaultValue={resource?.slug}
        required
        pattern="[a-z0-9-]+"
        patternTitle="Lowercase letters, numbers, and hyphens only"
      />
      <Field label="Title" name="title" defaultValue={resource?.title} required />
      <TextArea label="Description" name="description" defaultValue={resource?.description} required />

      {type === "download" && (
        <UploadWidget label="File" value={fileUrl} onChange={setFileUrl} kind="download" />
      )}
      {type === "tool-link" && (
        <Field
          label="External URL"
          name="externalUrl"
          defaultValue={resource?.externalUrl ?? ""}
          required
          type="url"
        />
      )}

      <Field label="Tags (comma-separated)" name="tags" defaultValue={resource?.tags.join(", ")} required />

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
