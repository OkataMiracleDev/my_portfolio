"use client";

import { useActionState, useState } from "react";
import {
  Section,
  Row,
  Field,
  AddRowButton,
  SaveBar,
  moveItem,
  IDLE_SAVE_STATE,
  type SaveState,
} from "./RateEditorShell";

type AddonRow = { name: string; value: string };

const BLANK: AddonRow = { name: "", value: "" };

export default function AddonsEditor({
  initialAddons,
  action,
}: {
  initialAddons: AddonRow[];
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, formAction] = useActionState(action, IDLE_SAVE_STATE);
  const [addons, setAddons] = useState<AddonRow[]>(initialAddons);

  function update(index: number, patch: Partial<AddonRow>) {
    setAddons((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <Section
      track="Track 03"
      title="Add-ons"
      description="The list clients can stack onto any project. Value is free text — “+25%”, “$150 / round”, anything."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="payload" value={JSON.stringify(addons)} />

        {addons.map((addon, index) => (
          <Row
            key={index}
            label="Add-on"
            index={index}
            count={addons.length}
            onMove={(from, to) => setAddons((prev) => moveItem(prev, from, to))}
            onRemove={(i) => setAddons((prev) => prev.filter((_, j) => j !== i))}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
              <Field
                label="Name"
                value={addon.name}
                onChange={(value) => update(index, { name: value })}
                placeholder="Rush delivery (under 5 business days)"
              />
              <Field
                label="Value"
                value={addon.value}
                onChange={(value) => update(index, { value })}
                placeholder="+25%"
              />
            </div>
          </Row>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <AddRowButton onClick={() => setAddons((prev) => [...prev, { ...BLANK }])}>
            Add add-on
          </AddRowButton>
          {addons.length === 0 && (
            <p className="text-sm text-ink/45">
              Saving with no add-ons restores the built-in defaults on the live page.
            </p>
          )}
        </div>

        <SaveBar state={state} />
      </form>
    </Section>
  );
}
