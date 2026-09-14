import type { ReactNode } from "react";

/**
 * Shared form controls for the admin.
 *
 * Ten of the thirteen admin forms declared their own local `Field`, and seven
 * declared their own local `TextArea` -- seventeen near-identical copies that
 * had already drifted apart (some support `pattern`, some support `onChange`,
 * some render hints, most do not). One set here, used by all of them.
 *
 * Everything is uncontrolled by default and posts through the enclosing
 * <form action={serverAction}>, which is how these forms already worked. Pass
 * `value` + `onChange` only where a field genuinely needs to be controlled.
 */

const CONTROL =
  "w-full rounded-xl border border-ink/12 bg-stage px-4 py-2.5 text-ink placeholder:text-ink/25 transition-colors duration-200 ease-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-build";

const LABEL =
  "mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45";

function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-xs leading-relaxed text-ink/35">{children}</p>;
}

export interface BaseFieldProps {
  label: string;
  name: string;
  /** Falls back to `name`, which is unique within a form. */
  id?: string;
  required?: boolean;
  hint?: ReactNode;
  placeholder?: string;
}

export function Field({
  label,
  name,
  id,
  defaultValue,
  value,
  onChange,
  required,
  type = "text",
  pattern,
  patternTitle,
  placeholder,
  hint,
  min,
  max,
  step,
  autoComplete,
}: BaseFieldProps & {
  defaultValue?: string | number | null;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  pattern?: string;
  /** Shown by the browser when `pattern` fails. */
  patternTitle?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
}) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={LABEL}>
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      <input
        id={fieldId}
        name={name}
        type={type}
        // Controlled only when a `value` is actually supplied. A field may be
        // uncontrolled and still want an onChange listener, so the two are
        // decided independently.
        {...(value !== undefined
          ? { value }
          : { defaultValue: defaultValue ?? "" })}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        pattern={pattern}
        title={patternTitle}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        className={CONTROL}
      />
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  id,
  defaultValue,
  value,
  onChange,
  required,
  rows = 5,
  placeholder,
  hint,
}: BaseFieldProps & {
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
}) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={LABEL}>
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        {...(value !== undefined ? { value } : { defaultValue: defaultValue ?? "" })}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        placeholder={placeholder}
        className={`${CONTROL} resize-y`}
      />
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

export function Select({
  label,
  name,
  id,
  defaultValue,
  value,
  onChange,
  required,
  options,
  hint,
}: BaseFieldProps & {
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={LABEL}>
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      <select
        id={fieldId}
        name={name}
        {...(value !== undefined ? { value } : { defaultValue: defaultValue ?? "" })}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className={CONTROL}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  id,
  defaultChecked,
  checked,
  onChange,
  hint,
}: {
  label: string;
  /** Omit for a checkbox whose value is posted by a separate hidden input. */
  name?: string;
  id?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  hint?: ReactNode;
}) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className="flex cursor-pointer items-center gap-3 text-sm text-ink/75">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          {...(checked !== undefined ? { checked } : { defaultChecked })}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className="h-4 w-4 shrink-0 accent-[var(--color-accent-build)]"
        />
        <span>{label}</span>
      </label>
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

/** Groups related fields under a small mono heading inside a form. */
export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-t border-ink/10 pt-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
          {title}
        </p>
        {description && <p className="mt-2 text-xs leading-relaxed text-ink/30">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

/** The surface an admin form sits on, matching Panel but form-shaped. */
export function FormShell({ children, ...props }: React.ComponentProps<"form">) {
  return (
    <form
      {...props}
      className="max-w-2xl space-y-5 rounded-2xl border border-ink/10 bg-frame p-6 md:p-8"
    >
      {children}
    </form>
  );
}
