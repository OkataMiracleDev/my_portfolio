"use server";

import { z } from "zod";
import { eq, asc, isNull, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { rateCards } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const lineItemSchema = z.object({
  section: z.string().optional().default(""),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  price: z.string().min(1),
  unit: z.string().optional().default(""),
});

const rateCardSchema = z.object({
  clientId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200),
  layout: z.enum(["flat", "sectioned"]).default("flat"),
  currency: z.string().min(1).max(10).default("USD"),
  lineItems: z.array(lineItemSchema).min(1),
  terms: z.array(z.string().min(1)).optional().default([]),
  notes: z.string().optional().nullable(),
});

export type RateCardInput = z.infer<typeof rateCardSchema>;

function revalidateRateCardPaths(clientId?: string | null) {
  revalidatePath("/admin/rate-cards");
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
}

export async function listRateCards() {
  await requireSession();
  return db.select().from(rateCards).orderBy(desc(rateCards.createdAt));
}

export async function listTemplateRateCards() {
  await requireSession();
  return db.select().from(rateCards).where(isNull(rateCards.clientId)).orderBy(asc(rateCards.title));
}

export async function getRateCard(id: string) {
  await requireSession();
  const [row] = await db.select().from(rateCards).where(eq(rateCards.id, id));
  return row ?? null;
}

export async function createRateCard(input: RateCardInput) {
  await requireSession();
  const data = rateCardSchema.parse(input);
  const [row] = await db.insert(rateCards).values(data).returning();
  revalidateRateCardPaths(data.clientId);
  return row;
}

export async function updateRateCard(id: string, input: RateCardInput) {
  await requireSession();
  const data = rateCardSchema.parse(input);
  const [row] = await db
    .update(rateCards)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rateCards.id, id))
    .returning();
  revalidateRateCardPaths(data.clientId);
  return row;
}

export async function deleteRateCard(id: string, clientId?: string | null) {
  await requireSession();
  await db.delete(rateCards).where(eq(rateCards.id, id));
  revalidateRateCardPaths(clientId);
}
