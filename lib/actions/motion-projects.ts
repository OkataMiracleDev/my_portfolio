"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { motionProjects } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const motionProjectSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  thumbnail: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  videoEmbedUrl: z.string().url().optional().nullable(),
  process: z.string().min(1),
  tools: z.array(z.string().min(1)).min(1),
});

export type MotionProjectInput = z.infer<typeof motionProjectSchema>;

function revalidateMotionProjectPaths() {
  revalidatePath("/animate");
  revalidatePath("/animate/projects");
}

export async function listMotionProjects() {
  await requireSession();
  return db.select().from(motionProjects).orderBy(asc(motionProjects.sortOrder));
}

export async function getMotionProject(id: string) {
  await requireSession();
  const [row] = await db.select().from(motionProjects).where(eq(motionProjects.id, id));
  return row ?? null;
}

export async function createMotionProject(input: MotionProjectInput) {
  await requireSession();
  const data = motionProjectSchema.parse(input);
  const [row] = await db.insert(motionProjects).values(data).returning();
  revalidateMotionProjectPaths();
  return row;
}

export async function updateMotionProject(id: string, input: MotionProjectInput) {
  await requireSession();
  const data = motionProjectSchema.parse(input);
  const [row] = await db
    .update(motionProjects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(motionProjects.id, id))
    .returning();
  revalidateMotionProjectPaths();
  return row;
}

export async function deleteMotionProject(id: string) {
  await requireSession();
  await db.delete(motionProjects).where(eq(motionProjects.id, id));
  revalidateMotionProjectPaths();
}

export async function reorderMotionProjects(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(motionProjects).set({ sortOrder: index }).where(eq(motionProjects.id, id))
    )
  );
  revalidateMotionProjectPaths();
}
