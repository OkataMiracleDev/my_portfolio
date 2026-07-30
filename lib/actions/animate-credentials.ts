"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { animateCredentials } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const credentialSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(200),
});

export type CredentialInput = z.infer<typeof credentialSchema>;

export async function listCredentials() {
  await requireSession();
  return db.select().from(animateCredentials).orderBy(asc(animateCredentials.sortOrder));
}

export async function getCredential(id: string) {
  await requireSession();
  const [row] = await db.select().from(animateCredentials).where(eq(animateCredentials.id, id));
  return row ?? null;
}

export async function createCredential(input: CredentialInput) {
  await requireSession();
  const data = credentialSchema.parse(input);
  const [row] = await db.insert(animateCredentials).values(data).returning();
  revalidatePath("/animate");
  return row;
}

export async function updateCredential(id: string, input: CredentialInput) {
  await requireSession();
  const data = credentialSchema.parse(input);
  const [row] = await db.update(animateCredentials).set(data).where(eq(animateCredentials.id, id)).returning();
  revalidatePath("/animate");
  return row;
}

export async function deleteCredential(id: string) {
  await requireSession();
  await db.delete(animateCredentials).where(eq(animateCredentials.id, id));
  revalidatePath("/animate");
}

export async function reorderCredentials(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(animateCredentials).set({ sortOrder: index }).where(eq(animateCredentials.id, id))
    )
  );
  revalidatePath("/animate");
}
