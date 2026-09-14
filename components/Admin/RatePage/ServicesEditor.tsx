"use client";

import { useActionState, useState } from "react";
import {
  Section,
  Row,
  Field,
  TextArea,
  AddRowButton,
  SaveBar,
  moveItem,
  IDLE_SAVE_STATE,
  type SaveState,
} from "./RateEditorShell";

type ServiceRow = {
  timecode: string;
  title: string;
  description: string;
  price: string;
  unit: string;
};

const BLANK: ServiceRow = { timecode: "", title: "", description: "", price: "", unit: "" };

export default function ServicesEditor({
  initialServices,
  action,
}: {
  initialServices: ServiceRow[];
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, formAction] = useActionState(action, IDLE_SAVE_STATE);
  const [services, setServices] = useState<ServiceRow[]>(initialServices);

  function update(index: number, patch: Partial<ServiceRow>) {
    setServices((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <Section
      track="Track 02"
      title="Project-based work"
      description="Flat-fee deliverables. Prices are free text, so ranges like “$300 – $800” stay exactly as you type them."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="payload" value={JSON.stringify(services)} />

        {services.map((service, index) => (
          <Row
            key={index}
            label="Service"
            index={index}
            count={services.length}
            onMove={(from, to) => setServices((prev) => moveItem(prev, from, to))}
            onRemove={(i) => setServices((prev) => prev.filter((_, j) => j !== i))}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                label="Timecode"
                value={service.timecode}
                onChange={(value) => update(index, { timecode: value })}
                placeholder="00:00:01:00"
                hint="The monospace label above the card."
              />
              <Field
                label="Title"
                value={service.title}
                onChange={(value) => update(index, { title: value })}
                placeholder="Brand Animation"
              />
            </div>

            <TextArea
              label="Description"
              className="mt-3"
              value={service.description}
              onChange={(value) => update(index, { description: value })}
              placeholder="Logo reveals, brand intros/outros, motion identity systems."
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                label="Price"
                value={service.price}
                onChange={(value) => update(index, { price: value })}
                placeholder="$300 – $800"
              />
              <Field
                label="Unit"
                value={service.unit}
                onChange={(value) => update(index, { unit: value })}
                placeholder="Per deliverable"
              />
            </div>
          </Row>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <AddRowButton onClick={() => setServices((prev) => [...prev, { ...BLANK }])}>
            Add service
          </AddRowButton>
          {services.length === 0 && (
            <p className="text-sm text-ink/45">
              Saving with no services restores the built-in defaults on the live page.
            </p>
          )}
        </div>

        <SaveBar state={state} />
      </form>
    </Section>
  );
}
