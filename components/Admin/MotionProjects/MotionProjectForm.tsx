"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { motionProjects } from "@/lib/db/schema";

type MotionProject = typeof motionProjects.$inferSelect;

interface MotionProjectFormProps {
  project?: MotionProject;
  action: (formData: FormData) => void;
}

export default function MotionProjectForm({ project, action }: MotionProjectFormProps) {
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="thumbnail" value={thumbnail} />

      <Field label="Slug" name="slug" defaultValue={project?.slug} required />
      <Field label="Title" name="title" defaultValue={project?.title} required />
      <TextArea label="Description" name="description" defaultValue={project?.description} required />
      <UploadWidget label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
      <Field label="Tags (comma-separated)" name="tags" defaultValue={project?.tags.join(", ")} required />
      <Field
        label="Video embed URL (optional — leave blank for 'coming soon')"
        name="videoEmbedUrl"
        defaultValue={project?.videoEmbedUrl ?? ""}
      />
      <TextArea label="Process" name="process" defaultValue={project?.process} required />
      <Field label="Tools (comma-separated)" name="tools" defaultValue={project?.tools.join(", ")} required />

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
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
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
