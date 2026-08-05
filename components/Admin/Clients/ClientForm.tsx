"use client";

import { CLIENT_STAGES } from "@/lib/actions/clients";
import type { clients } from "@/lib/db/schema";

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
    <form action={action} className="max-w-2xl space-y-5">
      <Field label="Name" name="name" defaultValue={client?.name} required />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Email" name="email" type="email" defaultValue={client?.email ?? ""} />
        <Field label="Company" name="company" defaultValue={client?.company ?? ""} />
      </div>

      <div>
        <label htmlFor="stage" className="mb-2 block text-sm font-medium text-ink/70">
          Stage
        </label>
        <select
          id="stage"
          name="stage"
          defaultValue={client?.stage ?? "lead"}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
        >
          {CLIENT_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>
      </div>

      <TextArea label="Notes (internal only — never shown to the client)" name="notes" defaultValue={client?.notes ?? ""} />

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
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        type={type}
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
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}
