import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, Select, FormShell } from "@/components/Admin/ui/Fields";
import { RETAINER_STATUSES, RETAINER_STATUS_LABELS } from "@/lib/constants/retainer-phases";
import type { retainerClients } from "@/lib/db/schema";

type Retainer = typeof retainerClients.$inferSelect;

export default function RetainerForm({
  retainer,
  action,
}: {
  retainer?: Retainer;
  action: (formData: FormData) => void;
}) {
  return (
    <FormShell action={action}>
      <Field label="Name" name="name" defaultValue={retainer?.name} required />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Email" name="email" type="email" defaultValue={retainer?.email ?? ""} />
        <Field label="Company" name="company" defaultValue={retainer?.company ?? ""} />
      </div>

      <Select
        label="Status"
        name="status"
        defaultValue={retainer?.status ?? "active"}
        options={RETAINER_STATUSES.map((status) => ({
          value: status,
          label: RETAINER_STATUS_LABELS[status],
        }))}
        hint="Shown on the portal header so a paused retainer does not look abandoned."
      />

      <TextArea
        label="Notes"
        name="notes"
        defaultValue={retainer?.notes ?? ""}
        hint="Internal only. Never rendered on the portal."
      />

      <SubmitButton accent="animate" />
    </FormShell>
  );
}
