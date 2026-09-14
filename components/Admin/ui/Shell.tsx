import Link from "next/link";
import type { ReactNode } from "react";
import { Meta } from "@/components/Shared/brand/Hud";

/**
 * The admin's shared furniture.
 *
 * These are deliberately plainer than the public site's components. /build and
 * /animate are trying to impress someone; the admin is a tool Miracle opens to
 * get something done, so the priorities invert: density over drama, fast
 * scanning over reveal animations, and no grain, no huge type, no motion that
 * costs a frame. What carries over is the vocabulary -- mono metadata labels,
 * hairline rules, the frame/stage surfaces -- so it still reads as the same
 * product rather than a bolted-on CMS.
 */

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** Usually the "New" button. */
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <Meta className="mb-3 block text-ink/35">{eyebrow}</Meta>}
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/45">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

/** The primary action button, used for every "New <thing>" in the admin. */
export function NewButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-pill bg-accent-build py-1.5 pl-4 pr-1.5 text-sm font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
    >
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/15 text-[1rem] leading-none transition-transform duration-200 ease-out group-hover:rotate-90">
        +
      </span>
    </Link>
  );
}

/** The surface most admin content sits on. */
export function Panel({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-frame ${padded ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** A list of records. Rows are supplied as <Row> children. */
export function DataList({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-frame">
      {children}
    </ul>
  );
}

/**
 * One record. `meta` is the secondary line; `actions` is the trailing control
 * cluster (Edit + Delete). The row wraps on narrow screens instead of
 * squeezing the action buttons off the edge, which is what the old fixed
 * `flex items-center justify-between` did on a phone.
 */
export function Row({
  title,
  meta,
  badge,
  actions,
  index,
  handle,
  dropProps,
}: {
  title: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  index?: number;
  /** Drag handle, rendered at the row's leading edge. */
  handle?: ReactNode;
  /**
   * Drop-target wiring for a sortable list. Spread onto the <li> rather than
   * making the whole row draggable -- a draggable row swallows clicks on the
   * links and buttons inside it.
   */
  dropProps?: React.DragEventHandler<HTMLLIElement> extends never
    ? never
    : {
        onDragOver?: React.DragEventHandler<HTMLLIElement>;
        onDrop?: React.DragEventHandler<HTMLLIElement>;
        "data-dragging"?: boolean;
      };
}) {
  return (
    <li
      {...dropProps}
      className="flex flex-col gap-3 px-5 py-4 transition-colors duration-200 ease-out hover:bg-ink/[0.02] data-[dragging=true]:opacity-40 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
    >
      {handle}
      {typeof index === "number" && (
        <Meta className="shrink-0 text-ink/20">{String(index + 1).padStart(2, "0")}</Meta>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="truncate font-medium text-ink">{title}</p>
          {badge}
        </div>
        {meta && <div className="mt-1 text-sm text-ink/40">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </li>
  );
}

/** Secondary action, e.g. Edit. Matches DeleteButton's dimensions. */
export function RowLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "rounded-pill border border-ink/15 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/60 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** A published/draft style pill. */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "live" | "muted";
}) {
  const tones = {
    live: "border-accent-build/40 text-accent-build",
    muted: "border-ink/12 text-ink/35",
    neutral: "border-ink/15 text-ink/55",
  } as const;

  return (
    <span
      className={`rounded-pill border px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/12 bg-frame/40 px-6 py-16 text-center">
      <p className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
        {title}
      </p>
      {description && <p className="max-w-sm text-sm leading-relaxed text-ink/40">{description}</p>}
      {action}
    </div>
  );
}

/** "Back to the list" control for the new/edit form wrappers. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/40 transition-colors duration-200 ease-out hover:text-ink"
    >
      <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
        &larr;
      </span>
      <span>{children}</span>
    </Link>
  );
}
