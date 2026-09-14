"use client";

import { CLIENT_STAGES } from "@/lib/constants/client-stages";
import type { clients } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, Select, FormShell } from "@/components/Admin/ui/Fields";

type Client = typeof clients.$inferSelect;

const STAGE_LABELS: Record<(typeof CLIENT_STAGES)[number], string> = {
  lead: "Lead",
  conversation: "First conversation",
  meeting: "Meeting",
  proposal_sent: "Proposal sent",
  deposit_paid: "Deposit paid",
  in_progress: "In progress",
  completed: "Completed",
  lost: "Lost",
};

interface ClientFormProps {
  client?: Client;
  action: (formData: FormData) => void;
}

export default function ClientForm({ client, action }: ClientFormProps) {
  return (
    <FormShell action={action}>
      <Field label="Name" name="name" defaultValue={client?.name} required />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Email" name="email" type="email" defaultValue={client?.email ?? ""} />
        <Field label="Company" name="company" defaultValue={client?.company ?? ""} />
      </div>

      <Select
        label="Stage"
        name="stage"
        defaultValue={client?.stage ?? "lead"}
        options={CLIENT_STAGES.map((stage) => ({ value: stage, label: STAGE_LABELS[stage] }))}
      />

      <TextArea label="Notes (internal only — never shown to the client)" name="notes" defaultValue={client?.notes ?? ""} />

      <SubmitButton accent="animate" />
    </FormShell>
  );
}
