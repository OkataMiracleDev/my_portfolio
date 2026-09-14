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

type TierRow = {
  code: string;
  name: string;
  tagline: string;
  // Held as a string while editing so the field can be emptied and retyped
  // without the value snapping to 0; coerced back to a number on save.
  monthly: string;
  features: string[];
  featured: boolean;
};

const BLANK: TierRow = {
  code: "",
  name: "",
  tagline: "",
  monthly: "",
  features: [""],
  featured: false,
};

export default function RetainerTiersEditor({
  initialTiers,
  action,
}: {
  initialTiers: TierRow[];
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, formAction] = useActionState(action, IDLE_SAVE_STATE);
  const [tiers, setTiers] = useState<TierRow[]>(initialTiers);

  function update(index: number, patch: Partial<TierRow>) {
    setTiers((prev) => prev.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  }

  return (
    <Section
      track="Track 01"
      title="Monthly retainer tiers"
      description="The pricing cards at the top of the page. Monthly price is a plain number — the yearly figure is calculated from it (10 months billed for 12)."
    >
      <form action={formAction} className="space-y-4">
        {/* The editor state is a nested structure (features is a list inside a
            list), which repeated form fields cannot express cleanly. One JSON
            payload keeps the client state and what the server parses identical.
            Blank feature lines are dropped here rather than rejected by the
            server -- a trailing newline in a textarea is not a mistake worth
            failing a save over. */}
        <input
          type="hidden"
          name="payload"
          value={JSON.stringify(
            tiers.map((tier) => ({
              ...tier,
              features: tier.features.map((f) => f.trim()).filter(Boolean),
            }))
          )}
        />

        {tiers.map((tier, index) => (
          <Row
            key={index}
            label="Tier"
            index={index}
            count={tiers.length}
            onMove={(from, to) => setTiers((prev) => moveItem(prev, from, to))}
            onRemove={(i) => setTiers((prev) => prev.filter((_, j) => j !== i))}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field
                label="Code"
                value={tier.code}
                onChange={(value) => update(index, { code: value })}
                placeholder="R01"
                hint="Shown small, top-left of the card."
              />
              <Field
                label="Name"
                value={tier.name}
                onChange={(value) => update(index, { name: value })}
                placeholder="Growth"
              />
              <Field
                label="Monthly price (USD)"
                type="number"
                value={tier.monthly}
                onChange={(value) => update(index, { monthly: value })}
                placeholder="1500"
                hint="Digits only — no $ or commas."
              />
            </div>

            <TextArea
              label="Tagline"
              className="mt-3"
              value={tier.tagline}
              onChange={(value) => update(index, { tagline: value })}
              placeholder="The steady-stream setup most teams settle on."
            />

            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-ink/70">
                Features (one per line)
              </label>
              <textarea
                value={tier.features.join("\n")}
                onChange={(e) => update(index, { features: e.target.value.split("\n") })}
                rows={5}
                placeholder={"4–6 deliverables per month\n3 revision rounds per deliverable"}
                className="w-full rounded-lg border border-ink/15 bg-frame px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
              />
              <p className="mt-1 text-xs text-ink/45">
                Each line gets a checkmark. Blank lines are dropped on save.
              </p>
            </div>

            <label className="mt-3 flex items-center gap-2.5 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={tier.featured}
                onChange={(e) => update(index, { featured: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent-animate)]"
              />
              Highlight this tier (dark card + “Most chosen” badge)
            </label>
          </Row>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <AddRowButton onClick={() => setTiers((prev) => [...prev, { ...BLANK }])}>
            Add tier
          </AddRowButton>
          {tiers.length === 0 && (
            <p className="text-sm text-ink/45">
              Saving with no tiers restores the three built-in defaults on the live page.
            </p>
          )}
        </div>

        <SaveBar state={state} />
      </form>
    </Section>
  );
}
