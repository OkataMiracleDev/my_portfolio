"use client";

import type { animateCredentials } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, FormShell } from "@/components/Admin/ui/Fields";

type Credential = typeof animateCredentials.$inferSelect;

interface CredentialFormProps {
  credential?: Credential;
  action: (formData: FormData) => void;
}

export default function CredentialForm({ credential, action }: CredentialFormProps) {
  return (
    <FormShell action={action}>
      <Field label="Label" name="label" defaultValue={credential?.label} required />
      <Field label="Value" name="value" defaultValue={credential?.value} required />
      <SubmitButton accent="animate" />
    </FormShell>
  );
}
