"use client";

export interface ProcessStep {
  title: string;
  body: string;
}

interface ProcessStepsEditorProps {
  steps: ProcessStep[];
  onChange: (steps: ProcessStep[]) => void;
}

export default function ProcessStepsEditor({ steps, onChange }: ProcessStepsEditorProps) {
  function updateStep(index: number, field: keyof ProcessStep, value: string) {
    onChange(steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)));
  }

  function addStep() {
    onChange([...steps, { title: "", body: "" }]);
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Process steps</label>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="rounded-xl border border-ink/15 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/40">
                Step {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <input
              value={step.title}
              onChange={(e) => updateStep(i, "title", e.target.value)}
              placeholder="Step title (e.g. Concept & Brief)"
              className="mb-2 w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
            <textarea
              value={step.body}
              onChange={(e) => updateStep(i, "body", e.target.value)}
              placeholder="What happened in this step"
              rows={3}
              className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addStep}
        className="mt-3 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        + Add step
      </button>
    </div>
  );
}
