import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, Select, FormShell } from "@/components/Admin/ui/Fields";
import { RETAINER_PHASES, RETAINER_PHASE_LABELS } from "@/lib/constants/retainer-phases";
import type { retainerProjects } from "@/lib/db/schema";

type Project = typeof retainerProjects.$inferSelect;

export default function RetainerProjectForm({
  retainerClientId,
  project,
  action,
}: {
  retainerClientId: string;
  project?: Project;
  action: (formData: FormData) => void;
}) {
  return (
    <FormShell action={action}>
      <input type="hidden" name="retainerClientId" value={retainerClientId} />

      <Field
        label="Project name"
        name="name"
        defaultValue={project?.name}
        required
        placeholder="e.g. Q1 brand film"
        hint="The client sees this, so name it the way they refer to it."
      />

      <TextArea
        label="Description"
        name="description"
        rows={3}
        defaultValue={project?.description ?? ""}
        hint="Optional. A line of context under the project name on the portal."
      />

      <Select
        label="Current phase"
        name="phase"
        defaultValue={project?.phase ?? "scripting"}
        options={RETAINER_PHASES.map((phase) => ({
          value: phase,
          label: RETAINER_PHASE_LABELS[phase],
        }))}
        hint="Posting an update also moves the project forward, so this rarely needs setting by hand."
      />

      <SubmitButton accent="animate" />
    </FormShell>
  );
}
