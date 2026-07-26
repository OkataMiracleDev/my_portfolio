"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { devProjects } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

// Existing slugs (e.g. "NEM") predate this system and use mixed case —
// the pattern stays permissive rather than forcing a URL-breaking rename.
const devProjectSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-zA-Z0-9-]+$/, "Letters, numbers, and hyphens only"),
  name: z.string().min(1).max(200),
  subhead: z.string().max(500).optional().nullable(),
  description: z.string().min(1),
  image: z.string().min(1),
  image2: z.string().optional().nullable(),
  image3: z.string().optional().nullable(),
  technology: z.array(z.string().min(1)).min(1),
  date: z.string().max(20).optional().nullable(),
  type: z.string().max(100).optional().nullable(),
  client: z.string().max(200).optional().nullable(),
  link: z.string().url().optional().nullable(),
  featuredOnHome: z.boolean().default(false),
});

export type DevProjectInput = z.infer<typeof devProjectSchema>;

function revalidateDevProjectPaths() {
  revalidatePath("/build");
  revalidatePath("/build/projects");
}

export async function listDevProjects() {
  await requireSession();
  return db.select().from(devProjects).orderBy(asc(devProjects.sortOrder));
}

export async function getDevProject(id: string) {
  await requireSession();
  const [row] = await db.select().from(devProjects).where(eq(devProjects.id, id));
  return row ?? null;
}

export async function createDevProject(input: DevProjectInput) {
  await requireSession();
  const data = devProjectSchema.parse(input);
  const [row] = await db.insert(devProjects).values(data).returning();
  revalidateDevProjectPaths();
  return row;
}

export async function updateDevProject(id: string, input: DevProjectInput) {
  await requireSession();
  const data = devProjectSchema.parse(input);
  const [row] = await db
    .update(devProjects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(devProjects.id, id))
    .returning();
  revalidateDevProjectPaths();
  return row;
}

export async function deleteDevProject(id: string) {
  await requireSession();
  await db.delete(devProjects).where(eq(devProjects.id, id));
  revalidateDevProjectPaths();
}

export async function reorderDevProjects(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(devProjects).set({ sortOrder: index }).where(eq(devProjects.id, id))
    )
  );
  revalidateDevProjectPaths();
}
