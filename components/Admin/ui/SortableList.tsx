"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteButton from "./DeleteButton";
import { Badge, DataList, Row, RowLink } from "./Shell";
import { Meta } from "@/components/Shared/brand/Hud";

export interface SortableRow {
  id: string;
  title: string;
  meta?: string;
  badge?: { label: string; tone?: "live" | "muted" | "neutral" };
  editHref: string;
  /** Value matched against the active filter chip. */
  filterValue?: string;
}

/**
 * The reorderable admin list, once.
 *
 * Eight sections shipped their own copy of this -- dev projects, motion
 * projects, resources, credentials, fun facts, experience, plugins,
 * testimonials -- identical apart from which field they printed and which
 * server action they called. Two of them additionally had their own copy of
 * the filter-chip logic.
 *
 * Three things are fixed here rather than reproduced eight times:
 *
 * 1. Reordering worked with a mouse and nothing else. It was built on the
 *    HTML5 drag events (`draggable` + `onDragStart` + `onDrop`), which touch
 *    devices do not fire at all, and which no keyboard can reach. So the order
 *    of everything on the public site could only be changed from a desktop
 *    with a pointer. Every row now also has explicit move up/down buttons,
 *    which work on a phone and from the keyboard; dragging still works where
 *    it works.
 * 2. The reorder call was fired without `await` and its result never checked.
 *    A failed write left the screen showing the new order and the database
 *    holding the old one, with nothing to tell you. It is now awaited, and a
 *    failure puts the list back where it was and says so.
 * 3. Reordering while a filter was active moved rows by their index in the
 *    full list while you were looking at a subset, which is close to
 *    impossible to predict. Reordering is now disabled while filtered, and
 *    says why.
 */
export default function SortableList({
  rows,
  label,
  reorderAction,
  deleteAction,
  filters,
  editLabel = "Edit",
}: {
  rows: SortableRow[];
  /** Noun for confirm and error copy: "project", "resource". */
  label: string;
  reorderAction: (orderedIds: string[]) => Promise<unknown>;
  deleteAction: (id: string) => Promise<unknown>;
  filters?: Array<{ value: string; label: string }>;
  editLabel?: string;
}) {
  const [order, setOrder] = useState(rows);
  const [filter, setFilter] = useState("all");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // After a delete refreshes the route, the server sends a new list; adopt it
  // rather than keeping stale local order.
  useEffect(() => {
    setOrder(rows);
  }, [rows]);

  const filtering = Boolean(filters) && filter !== "all";
  const visible = filtering ? order.filter((row) => row.filterValue === filter) : order;

  function persist(next: SortableRow[]) {
    const previous = order;
    setOrder(next);

    startTransition(async () => {
      try {
        await reorderAction(next.map((row) => row.id));
        router.refresh();
      } catch (error) {
        console.error(error);
        // Put it back. Showing an order the database does not have is worse
        // than showing the drag not taking.
        setOrder(previous);
        toast.error("Could not save the new order.");
      }
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next);
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null) return;
    move(dragIndex, dropIndex);
    setDragIndex(null);
  }

  return (
    <div>
      {filters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.map((chip) => {
            const active = filter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFilter(chip.value)}
                aria-pressed={active}
                className={`rounded-pill border px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200 ease-out ${
                  active
                    ? "border-transparent bg-ink text-base"
                    : "border-ink/12 text-ink/45 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
          {filtering && (
            <Meta className="text-ink/25">Reordering is off while filtered</Meta>
          )}
        </div>
      )}

      <DataList>
        {visible.map((row) => {
          const index = order.indexOf(row);
          return (
            <Row
              key={row.id}
              title={row.title}
              meta={row.meta}
              badge={row.badge && <Badge tone={row.badge.tone}>{row.badge.label}</Badge>}
              dropProps={
                filtering
                  ? undefined
                  : {
                      onDragOver: (event) => event.preventDefault(),
                      onDrop: () => handleDrop(index),
                      "data-dragging": dragIndex === index,
                    }
              }
              handle={
                filtering ? undefined : (
                  <span
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragEnd={() => setDragIndex(null)}
                    aria-hidden="true"
                    title="Drag to reorder"
                    className="hidden shrink-0 cursor-grab select-none px-1 text-ink/20 transition-colors duration-200 ease-out hover:text-ink/50 active:cursor-grabbing sm:block"
                  >
                    &#10086;
                  </span>
                )
              }
              actions={
                <>
                  {!filtering && (
                    <span className="flex items-center gap-1">
                      <MoveButton
                        direction="up"
                        disabled={index === 0 || pending}
                        onClick={() => move(index, index - 1)}
                        title={row.title}
                      />
                      <MoveButton
                        direction="down"
                        disabled={index === order.length - 1 || pending}
                        onClick={() => move(index, index + 1)}
                        title={row.title}
                      />
                    </span>
                  )}
                  <RowLink href={row.editHref}>{editLabel}</RowLink>
                  <DeleteButton action={deleteAction.bind(null, row.id)} label={label} />
                </>
              }
            />
          );
        })}
      </DataList>
    </div>
  );
}

function MoveButton({
  direction,
  disabled,
  onClick,
  title,
}: {
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Move ${title} ${direction}`}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/12 text-ink/45 transition-colors duration-200 ease-out hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-ink/12 disabled:hover:text-ink/45"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={direction === "down" ? "rotate-180" : undefined}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
