"use server";

import { z } from "zod";
import { eq, asc, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { retainerClients, retainerProjects, retainerUpdates } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { RETAINER_PHASES, RETAINER_STATUSES } from "@/lib/constants/retainer-phases";

// --- Retainer clients ----------------------------------------------------

const retainerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  status: z.enum(RETAINER_STATUSES),
  notes: z.string().optional().nullable(),
});

export type RetainerInput = z.infer<typeof retainerSchema>;

function revalidateRetainerPaths(id?: string) {
  revalidatePath("/admin/retainers");
  if (id) revalidatePath(`/admin/retainers/${id}`);
}

export async function listRetainers() {
  await requireSession();
  return db
    .select()
    .from(retainerClients)
    .orderBy(asc(retainerClients.sortOrder), desc(retainerClients.createdAt));
}

export async function getRetainer(id: string) {
  await requireSession();
  const [row] = await db.select().from(retainerClients).where(eq(retainerClients.id, id));
  return row ?? null;
}

export async function createRetainer(input: RetainerInput) {
  await requireSession();
  const data = retainerSchema.parse(input);
  const [row] = await db.insert(retainerClients).values(data).returning();
  revalidateRetainerPaths();
  return row;
}

export async function updateRetainer(id: string, input: RetainerInput) {
  await requireSession();
  const data = retainerSchema.parse(input);
  const [row] = await db
    .update(retainerClients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(retainerClients.id, id))
    .returning();
  revalidateRetainerPaths(id);
  return row;
}

export async function deleteRetainer(id: string) {
  await requireSession();

  // No DB-level cascade in libSQL here, so dependants are cleaned up
  // explicitly -- and updates hang off projects, not off the client, so the
  // project ids have to be resolved first or their updates are orphaned.
  const projects = await db
    .select({ id: retainerProjects.id })
    .from(retainerProjects)
    .where(eq(retainerProjects.retainerClientId, id));

  if (projects.length > 0) {
    await db.delete(retainerUpdates).where(
      inArray(
        retainerUpdates.retainerProjectId,
        projects.map((project) => project.id)
      )
    );
  }

  await db.delete(retainerProjects).where(eq(retainerProjects.retainerClientId, id));
  await db.delete(retainerClients).where(eq(retainerClients.id, id));
  revalidateRetainerPaths();
}

export async function rotateRetainerShareToken(id: string) {
  await requireSession();
  const crypto = await import("node:crypto");
  const token = crypto.randomBytes(16).toString("hex");
  await db
    .update(retainerClients)
    .set({ shareToken: token, updatedAt: new Date() })
    .where(eq(retainerClients.id, id));
  revalidateRetainerPaths(id);
  return token;
}

// --- Projects ------------------------------------------------------------

const projectSchema = z.object({
  retainerClientId: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  phase: z.enum(RETAINER_PHASES),
});

export type RetainerProjectInput = z.infer<typeof projectSchema>;

export async function listRetainerProjects(retainerClientId: string) {
  await requireSession();
  return db
    .select()
    .from(retainerProjects)
    .where(eq(retainerProjects.retainerClientId, retainerClientId))
    .orderBy(asc(retainerProjects.sortOrder), desc(retainerProjects.createdAt));
}

export async function getRetainerProject(id: string) {
  await requireSession();
  const [row] = await db.select().from(retainerProjects).where(eq(retainerProjects.id, id));
  return row ?? null;
}

export async function createRetainerProject(input: RetainerProjectInput) {
  await requireSession();
  const data = projectSchema.parse(input);
  const [row] = await db.insert(retainerProjects).values(data).returning();
  revalidateRetainerPaths(data.retainerClientId);
  return row;
}

export async function updateRetainerProject(id: string, input: RetainerProjectInput) {
  await requireSession();
  const data = projectSchema.parse(input);
  const [row] = await db
    .update(retainerProjects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(retainerProjects.id, id))
    .returning();
  revalidateRetainerPaths(data.retainerClientId);
  revalidatePath(`/admin/retainers/${data.retainerClientId}/projects/${id}`);
  return row;
}

/** Phase-only change, for the inline selector on the projects list. */
export async function updateRetainerProjectPhase(id: string, phase: (typeof RETAINER_PHASES)[number]) {
  await requireSession();
  const parsed = z.enum(RETAINER_PHASES).parse(phase);
  const [row] = await db
    .update(retainerProjects)
    .set({ phase: parsed, updatedAt: new Date() })
    .where(eq(retainerProjects.id, id))
    .returning();
  if (row) revalidateRetainerPaths(row.retainerClientId);
  return row;
}

export async function deleteRetainerProject(id: string) {
  await requireSession();
  const [row] = await db.select().from(retainerProjects).where(eq(retainerProjects.id, id));
  await db.delete(retainerUpdates).where(eq(retainerUpdates.retainerProjectId, id));
  await db.delete(retainerProjects).where(eq(retainerProjects.id, id));
  if (row) revalidateRetainerPaths(row.retainerClientId);
}

export async function reorderRetainerProjects(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(retainerProjects).set({ sortOrder: index }).where(eq(retainerProjects.id, id))
    )
  );
  revalidatePath("/admin/retainers");
}

// --- Updates -------------------------------------------------------------

const updateSchema = z.object({
  retainerProjectId: z.string().min(1),
  phase: z.enum(RETAINER_PHASES),
  title: z.string().min(1).max(200),
  body: z.string().optional().nullable(),
  images: z.array(z.string().min(1)).default([]),
  videoEmbedUrl: z.string().url().optional().nullable(),
});

export type RetainerUpdateInput = z.infer<typeof updateSchema>;

export async function listRetainerUpdates(retainerProjectId: string) {
  await requireSession();
  return db
    .select()
    .from(retainerUpdates)
    .where(eq(retainerUpdates.retainerProjectId, retainerProjectId))
    .orderBy(desc(retainerUpdates.createdAt));
}

/**
 * Posting an update also advances the project to that phase.
 *
 * Otherwise the two drift immediately: you post "storyboards are in" while the
 * project header still says Scripting, and the client sees a contradiction on
 * their own portal. The update keeps its own phase snapshot, so the history
 * stays accurate even after the project moves on again.
 *
 * It never moves a project backwards -- posting a late note about an earlier
 * phase is normal and should not un-progress the work.
 */
export async function createRetainerUpdate(input: RetainerUpdateInput) {
  await requireSession();
  const data = updateSchema.parse(input);
  const [row] = await db.insert(retainerUpdates).values(data).returning();

  const [project] = await db
    .select()
    .from(retainerProjects)
    .where(eq(retainerProjects.id, data.retainerProjectId));

  if (project) {
    const current = RETAINER_PHASES.indexOf(project.phase);
    const posted = RETAINER_PHASES.indexOf(data.phase);
    if (posted > current) {
      await db
        .update(retainerProjects)
        .set({ phase: data.phase, updatedAt: new Date() })
        .where(eq(retainerProjects.id, project.id));
    }
    revalidateRetainerPaths(project.retainerClientId);
    revalidatePath(`/admin/retainers/${project.retainerClientId}/projects/${project.id}`);
  }

  return row;
}

export async function deleteRetainerUpdate(id: string, retainerProjectId: string) {
  await requireSession();
  await db.delete(retainerUpdates).where(eq(retainerUpdates.id, id));
  const [project] = await db
    .select()
    .from(retainerProjects)
    .where(eq(retainerProjects.id, retainerProjectId));
  if (project) {
    revalidatePath(`/admin/retainers/${project.retainerClientId}/projects/${retainerProjectId}`);
  }
}

// --- Public portal (no session -- gated by an unguessable token) ----------

/**
 * Everything the portal renders, in one round trip.
 *
 * Mirrors getClientByShareToken's discipline: this runs unauthenticated, so
 * it hands back only what the client is meant to see. notes, email, the share
 * token itself and every internal id stay on this side of the boundary.
 */
export async function getRetainerByShareToken(token: string) {
  const [row] = await db
    .select()
    .from(retainerClients)
    .where(eq(retainerClients.shareToken, token));

  if (!row) return null;

  const projects = await db
    .select()
    .from(retainerProjects)
    .where(eq(retainerProjects.retainerClientId, row.id))
    .orderBy(asc(retainerProjects.sortOrder), desc(retainerProjects.createdAt));

  const updates =
    projects.length > 0
      ? await db
          .select()
          .from(retainerUpdates)
          .where(
            inArray(
              retainerUpdates.retainerProjectId,
              projects.map((project) => project.id)
            )
          )
          .orderBy(desc(retainerUpdates.createdAt))
      : [];

  return {
    client: {
      name: row.name,
      company: row.company,
      status: row.status,
    },
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      phase: project.phase,
      updatedAt: project.updatedAt,
      updates: updates
        .filter((update) => update.retainerProjectId === project.id)
        .map((update) => ({
          id: update.id,
          phase: update.phase,
          title: update.title,
          body: update.body,
          images: update.images,
          videoEmbedUrl: update.videoEmbedUrl,
          createdAt: update.createdAt,
        })),
    })),
  };
}
