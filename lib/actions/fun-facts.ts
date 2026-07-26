"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { funFactCards } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const funFactSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(200),
});

export type FunFactInput = z.infer<typeof funFactSchema>;

export async function listFunFacts() {
  await requireSession();
  return db.select().from(funFactCards).orderBy(asc(funFactCards.sortOrder));
}

export async function getFunFact(id: string) {
  await requireSession();
  const [row] = await db.select().from(funFactCards).where(eq(funFactCards.id, id));
  return row ?? null;
}

export async function createFunFact(input: FunFactInput) {
  await requireSession();
  const data = funFactSchema.parse(input);
  const [row] = await db.insert(funFactCards).values(data).returning();
  revalidatePath("/");
  return row;
}

export async function updateFunFact(id: string, input: FunFactInput) {
  await requireSession();
  const data = funFactSchema.parse(input);
  const [row] = await db.update(funFactCards).set(data).where(eq(funFactCards.id, id)).returning();
  revalidatePath("/");
  return row;
}

export async function deleteFunFact(id: string) {
  await requireSession();
  await db.delete(funFactCards).where(eq(funFactCards.id, id));
  revalidatePath("/");
}

export async function reorderFunFacts(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(funFactCards).set({ sortOrder: index }).where(eq(funFactCards.id, id))
    )
  );
  revalidatePath("/");
}
