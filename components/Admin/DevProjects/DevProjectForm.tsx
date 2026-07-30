"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { devProjects } from "@/lib/db/schema";

type DevProject = typeof devProjects.$inferSelect;

interface DevProjectFormProps {
  project?: DevProject;
  action: (formData: FormData) => void;
}

export default function DevProjectForm({ project, action }: DevProjectFormProps) {
  const [image, setImage] = useState(project?.image ?? "");
  const [image2, setImage2] = useState(project?.image2 ?? "");
  const [image3, setImage3] = useState(project?.image3 ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="image2" value={image2 ?? ""} />
      <input type="hidden" name="image3" value={image3 ?? ""} />

      <Field
        label="Slug"
        name="slug"
        defaultValue={project?.slug}
        required
        pattern="[a-zA-Z0-9-]+"
        patternTitle="Letters, numbers, and hyphens only"
      />
      <Field label="Name" name="name" defaultValue={project?.name} required />
      <Field label="Subhead" name="subhead" defaultValue={project?.subhead ?? ""} />
      <TextArea label="Description" name="description" defaultValue={project?.description} required />
      <UploadWidget label="Image" value={image} onChange={setImage} />
      <UploadWidget label="Image 2 (optional)" value={image2} onChange={setImage2} />
      <UploadWidget label="Image 3 (optional)" value={image3} onChange={setImage3} />
      <Field
        label="Technology (comma-separated)"
        name="technology"
        defaultValue={project?.technology.join(", ")}
        required
      />
      <Field label="Date" name="date" defaultValue={project?.date ?? ""} />
      <Field label="Type" name="type" defaultValue={project?.type ?? ""} />
      <Field label="Client" name="client" defaultValue={project?.client ?? ""} />
      <Field label="Live link" name="link" defaultValue={project?.link ?? ""} type="url" />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name="featuredOnHome"
          defaultChecked={project?.featuredOnHome ?? false}
        />
        Featured on /build home
      </label>

      <button
        type="submit"
        className="rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
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
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
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
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
      />
    </div>
  );
}
