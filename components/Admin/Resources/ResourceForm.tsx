"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { resources } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, FormShell, Select } from "@/components/Admin/ui/Fields";

type Resource = typeof resources.$inferSelect;

interface ResourceFormProps {
  resource?: Resource;
  action: (formData: FormData) => void;
}

export default function ResourceForm({ resource, action }: ResourceFormProps) {
  const [type, setType] = useState(resource?.type ?? "download");
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? "");

  return (
    <FormShell action={action}>
      <input type="hidden" name="fileUrl" value={fileUrl ?? ""} />

      <Select
        label="Type"
        name="type"
        value={type}
        onChange={(next) => setType(next as typeof type)}
        options={[
          { value: "download", label: "Download" },
          { value: "tutorial", label: "Tutorial" },
          { value: "tool-link", label: "Tool link" },
        ]}
      />

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

      <SubmitButton accent="animate" />
    </FormShell>
  );
}
