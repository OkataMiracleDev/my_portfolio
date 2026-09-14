"use client";

import { useActionState, useState } from "react";
import { Section, SaveBar, IDLE_SAVE_STATE, type SaveState } from "./RateEditorShell";

export default function TermsEditor({
  initialTerms,
  action,
}: {
  initialTerms: string[];
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, formAction] = useActionState(action, IDLE_SAVE_STATE);
  // A term is one string with no other fields, so this is a plain textarea
  // rather than the add/remove/reorder row machinery the other three sections
  // need -- here, reordering is just moving a line.
  const [text, setText] = useState(initialTerms.join("\n"));

  const terms = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Section
      track="Terms"
      title="Terms, at a glance"
      description="The numbered list at the foot of the page. One term per line — the numbering is automatic, so don’t type the numbers in."
    >
      <form action={formAction} className="space-y-4">
        {/* One object per line, matching the table's row shape — the section
            saves the same way the other three do. */}
        <input
          type="hidden"
          name="payload"
          value={JSON.stringify(terms.map((body) => ({ body })))}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={
            "50% deposit to start, balance due on final delivery.\n2 rounds of revisions included per project."
          }
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
        <p className="text-xs text-ink/45">
          {terms.length} {terms.length === 1 ? "term" : "terms"}.
          {terms.length === 0 &&
            " Saving an empty list restores the built-in defaults on the live page."}
        </p>
        <SaveBar state={state} />
      </form>
    </Section>
  );
}
