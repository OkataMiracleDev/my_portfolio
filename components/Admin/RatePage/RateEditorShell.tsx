"use client";

import SubmitButton from "@/components/Admin/SubmitButton";

/**
 * Shared chrome for the four /admin/rates section editors.
 *
 * Every section is the same shape -- a reorderable list of rows, an "add row"
 * button, and one Save that replaces the whole section -- so the framing,
 * the row controls and the save/result row live here and each editor only
 * supplies its own fields.
 */

export type SaveState = { status: "idle" | "saved" | "error"; message?: string };

export const IDLE_SAVE_STATE: SaveState = { status: "idle" };

export function Section({
  title,
  track,
  description,
  children,
}: {
  title: string;
  track: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-base-raised p-6">
      <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
        {track}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
        {title}
      </h2>
      <p className="mb-6 mt-1 max-w-2xl text-sm text-ink/55">{description}</p>
      {children}
    </section>
  );
}

/** One editable row, with its reorder/remove controls. */
export function Row({
  label,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  label: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink/15 bg-base p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/40">
          {label} {index + 1}
        </p>
        <div className="flex items-center gap-1">
          {/* Arrows rather than drag-and-drop: these rows are mostly text
              inputs, and dragging a row means starting the drag on a field
              you are also trying to select text in. */}
          <IconButton
            label="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          >
            ↑
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index === count - 1}
            onClick={() => onMove(index, index + 1)}
          >
            ↓
          </IconButton>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-pill border border-red-600/30 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-600/5"
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-pill border border-ink/15 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function AddRowButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-pill border border-dashed border-ink/25 px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/40 hover:bg-ink/5"
    >
      + {children}
    </button>
  );
}

/** Save button plus the result of the last save. */
export function SaveBar({ state }: { state: SaveState }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-5">
      <SubmitButton accent="animate">Save section</SubmitButton>
      {/* aria-live so the outcome is announced, not just shown -- the button
          itself only ever announces "Saving...". */}
      <p
        role="status"
        aria-live="polite"
        className={`text-sm ${state.status === "error" ? "text-red-600" : "text-ink/55"}`}
      >
        {state.status === "saved" ? "Saved — the live page is updated." : state.message ?? ""}
      </p>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  className = "",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "number";
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-ink/70">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink/15 bg-base-raised px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 2,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-ink/70">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink/15 bg-base-raised px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}

/** Moves item `from` to index `to`, returning a new array. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
