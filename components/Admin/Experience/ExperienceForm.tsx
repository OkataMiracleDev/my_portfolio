"use client";

import type { experienceEntries } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, FormShell } from "@/components/Admin/ui/Fields";

type ExperienceEntry = typeof experienceEntries.$inferSelect;

interface ExperienceFormProps {
  entry?: ExperienceEntry;
  action: (formData: FormData) => void;
}

export default function ExperienceForm({ entry, action }: ExperienceFormProps) {
  return (
    <FormShell action={action}>
      <Field label="Year (e.g. 2024 - 2025)" name="year" defaultValue={entry?.year} required />
      <Field label="Role" name="role" defaultValue={entry?.role} required />
      <Field label="Company" name="company" defaultValue={entry?.company} required />
      <TextArea label="Description" name="description" defaultValue={entry?.description} required />
      <Field
        label="Technologies (comma-separated)"
        name="technologies"
        defaultValue={entry?.technologies.join(", ")}
        required
      />
      <SubmitButton accent="build" />
    </FormShell>
  );
}
