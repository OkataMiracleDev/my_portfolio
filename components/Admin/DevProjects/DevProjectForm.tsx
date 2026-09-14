"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { devProjects } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, FormShell, Checkbox } from "@/components/Admin/ui/Fields";

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
    <FormShell action={action}>
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

      <Checkbox
        label="Featured on the /build home page"
        name="featuredOnHome"
        defaultChecked={project?.featuredOnHome ?? false}
      />

      <SubmitButton accent="build" />
    </FormShell>
  );
}
