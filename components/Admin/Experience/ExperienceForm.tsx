"use client";

import type { experienceEntries } from "@/lib/db/schema";

type ExperienceEntry = typeof experienceEntries.$inferSelect;

interface ExperienceFormProps {
  entry?: ExperienceEntry;
  action: (formData: FormData) => void;
}

export default function ExperienceForm({ entry, action }: ExperienceFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
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
        rows={4}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
      />
    </div>
  );
}
