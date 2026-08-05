"use server";

import { z } from "zod";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { clients, clientUpdates, rateCards } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

export const CLIENT_STAGES = [
  "lead",
  "conversation",
  "meeting",
  "proposal_sent",
  "deposit_paid",
  "in_progress",
  "completed",
  "lost",
] as const;

const clientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  stage: z.enum(CLIENT_STAGES),
  notes: z.string().optional().nullable(),
});

export type ClientInput = z.infer<typeof clientSchema>;

function revalidateClientPaths() {
  revalidatePath("/admin/clients");
}

export async function listClients() {
  await requireSession();
  return db.select().from(clients).orderBy(asc(clients.sortOrder), desc(clients.createdAt));
}

export async function getClient(id: string) {
  await requireSession();
  const [row] = await db.select().from(clients).where(eq(clients.id, id));
  return row ?? null;
}

export async function createClient(input: ClientInput) {
  await requireSession();
  const data = clientSchema.parse(input);
  const [row] = await db.insert(clients).values(data).returning();
  revalidateClientPaths();
  return row;
}

export async function updateClient(id: string, input: ClientInput) {
  await requireSession();
  const data = clientSchema.parse(input);
  const [row] = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning();
  revalidateClientPaths();
  return row;
}

export async function updateClientStage(id: string, stage: (typeof CLIENT_STAGES)[number]) {
  await requireSession();
  await db.update(clients).set({ stage, updatedAt: new Date() }).where(eq(clients.id, id));
  revalidateClientPaths();
}

export async function deleteClient(id: string) {
  await requireSession();
  // No DB-level cascade — clean up dependents explicitly.
  await db.delete(clientUpdates).where(eq(clientUpdates.clientId, id));
  await db.delete(rateCards).where(eq(rateCards.clientId, id));
  await db.delete(clients).where(eq(clients.id, id));
  revalidateClientPaths();
}

export async function rotateShareToken(id: string) {
  await requireSession();
  const crypto = await import("node:crypto");
  const token = crypto.randomBytes(16).toString("hex");
  await db.update(clients).set({ shareToken: token, updatedAt: new Date() }).where(eq(clients.id, id));
  revalidateClientPaths();
  return token;
}

// --- Client updates (public portal timeline) ----------------------------

const clientUpdateSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1).max(200),
  body: z.string().optional().nullable(),
  images: z.array(z.string().min(1)).default([]),
  videoEmbedUrl: z.string().url().optional().nullable(),
});

export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;

export async function listClientUpdates(clientId: string) {
  await requireSession();
  return db
    .select()
    .from(clientUpdates)
    .where(eq(clientUpdates.clientId, clientId))
    .orderBy(desc(clientUpdates.createdAt));
}

export async function createClientUpdate(input: ClientUpdateInput) {
  await requireSession();
  const data = clientUpdateSchema.parse(input);
  const [row] = await db.insert(clientUpdates).values(data).returning();
  revalidatePath(`/admin/clients/${data.clientId}`);
  return row;
}

export async function deleteClientUpdate(id: string, clientId: string) {
  await requireSession();
  await db.delete(clientUpdates).where(eq(clientUpdates.id, id));
  revalidatePath(`/admin/clients/${clientId}`);
}

// --- Public portal (no session required — gated by unguessable token) ---

export async function getClientByShareToken(token: string) {
  const [row] = await db.select().from(clients).where(eq(clients.shareToken, token));
  if (!row) return null;

  const [updates, cards] = await Promise.all([
    db.select().from(clientUpdates).where(eq(clientUpdates.clientId, row.id)).orderBy(desc(clientUpdates.createdAt)),
    db.select().from(rateCards).where(eq(rateCards.clientId, row.id)).orderBy(desc(rateCards.createdAt)),
  ]);

  // notes/email/shareToken are internal — this is an unauthenticated page,
  // so only hand back what the client is meant to see.
  return {
    client: { id: row.id, name: row.name, company: row.company, stage: row.stage },
    updates,
    rateCards: cards,
  };
}
