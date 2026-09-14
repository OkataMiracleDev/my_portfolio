"use client";

import type { funFactCards } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, FormShell } from "@/components/Admin/ui/Fields";

type FunFactCard = typeof funFactCards.$inferSelect;

interface FunFactFormProps {
  fact?: FunFactCard;
  action: (formData: FormData) => void;
}

export default function FunFactForm({ fact, action }: FunFactFormProps) {
  return (
    <FormShell action={action}>
      <Field label="Label" name="label" defaultValue={fact?.label} required />
      <Field label="Value" name="value" defaultValue={fact?.value} required />
      <SubmitButton accent="build" />
    </FormShell>
  );
}
