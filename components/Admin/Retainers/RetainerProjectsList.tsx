"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteButton from "@/components/Admin/ui/DeleteButton";
import { DataList, Row, RowLink } from "@/components/Admin/ui/Shell";
import PhaseTrack from "@/components/Shared/PhaseTrack";
import {
  RETAINER_PHASES,
  RETAINER_PHASE_LABELS,
} from "@/lib/constants/retainer-phases";
import {
  deleteRetainerProjectAction,
  updateRetainerProjectPhaseAction,
} from "@/app/admin/retainers/actions";
import type { retainerProjects } from "@/lib/db/schema";

type Project = typeof retainerProjects.$inferSelect;

/**
 * The projects under one retainer, each with an inline phase selector.
 *
 * Moving a project along is the single most frequent thing done in here, so it
 * is one dropdown on the list rather than a trip into the project's edit form.
 * The change is optimistic but checked -- a failed write reverts the selector
 * and says so, instead of leaving the screen disagreeing with the database.
 */
export default function RetainerProjectsList({
  retainerId,
  initialItems,
}: {
  retainerId: string;
  initialItems: Project[];
}) {
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function handlePhaseChange(id: string, phase: string) {
    const previous = items;
    setItems((current) =>
      current.map((project) =>
        project.id === id ? { ...project, phase: phase as Project["phase"] } : project
      )
    );

    startTransition(async () => {
      try {
        await updateRetainerProjectPhaseAction(id, phase);
        router.refresh();
      } catch (error) {
        console.error(error);
        setItems(previous);
        toast.error("Could not move that project.");
      }
    });
  }

  return (
    <DataList>
      {items.map((project) => (
        <Row
          key={project.id}
          title={
            <Link
              href={`/admin/retainers/${retainerId}/projects/${project.id}`}
              className="transition-colors duration-200 ease-out hover:text-accent-animate"
            >
              {project.name}
            </Link>
          }
          meta={
            <span className="flex flex-wrap items-center gap-3">
              <PhaseTrack phase={project.phase} compact />
              <span className="text-ink/35">{RETAINER_PHASE_LABELS[project.phase]}</span>
            </span>
          }
          actions={
            <>
              <label className="sr-only" htmlFor={`phase-${project.id}`}>
                Phase for {project.name}
              </label>
              <select
                id={`phase-${project.id}`}
                value={project.phase}
                disabled={pending}
                onChange={(event) => handlePhaseChange(project.id, event.target.value)}
                className="rounded-lg border border-ink/12 bg-stage px-2.5 py-1.5 text-xs text-ink/70 transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-animate disabled:opacity-50"
              >
                {RETAINER_PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {RETAINER_PHASE_LABELS[phase]}
                  </option>
                ))}
              </select>
              <RowLink href={`/admin/retainers/${retainerId}/projects/${project.id}`}>
                Open
              </RowLink>
              <DeleteButton
                action={deleteRetainerProjectAction.bind(null, project.id)}
                label="project"
              />
            </>
          }
        />
      ))}
    </DataList>
  );
}
