"use client";

import type { funFactCards } from "@/lib/db/schema";

type FunFactCard = typeof funFactCards.$inferSelect;

interface FunFactFormProps {
  fact?: FunFactCard;
  action: (formData: FormData) => void;
}

export default function FunFactForm({ fact, action }: FunFactFormProps) {
  return (
    <form action={action} className="max-w-lg space-y-5">
      <Field label="Label" name="label" defaultValue={fact?.label} required />
      <Field label="Value" name="value" defaultValue={fact?.value} required />
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
