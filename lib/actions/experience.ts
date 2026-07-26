"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { experienceEntries } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const experienceSchema = z.object({
  year: z.string().min(1).max(50),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export async function listExperienceEntries() {
  await requireSession();
  return db.select().from(experienceEntries).orderBy(asc(experienceEntries.sortOrder));
}

export async function getExperienceEntry(id: string) {
  await requireSession();
  const [row] = await db.select().from(experienceEntries).where(eq(experienceEntries.id, id));
  return row ?? null;
}

export async function createExperienceEntry(input: ExperienceInput) {
  await requireSession();
  const data = experienceSchema.parse(input);
  const [row] = await db.insert(experienceEntries).values(data).returning();
  revalidatePath("/build");
  return row;
}

export async function updateExperienceEntry(id: string, input: ExperienceInput) {
  await requireSession();
  const data = experienceSchema.parse(input);
  const [row] = await db
    .update(experienceEntries)
    .set(data)
    .where(eq(experienceEntries.id, id))
    .returning();
  revalidatePath("/build");
  return row;
}

export async function deleteExperienceEntry(id: string) {
  await requireSession();
  await db.delete(experienceEntries).where(eq(experienceEntries.id, id));
  revalidatePath("/build");
}

export async function reorderExperienceEntries(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(experienceEntries).set({ sortOrder: index }).where(eq(experienceEntries.id, id))
    )
  );
  revalidatePath("/build");
}
