"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { resources } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const resourceSchema = z
  .object({
    slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    type: z.enum(["download", "tutorial", "tool-link"]),
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    fileUrl: z.string().url().optional().nullable(),
    externalUrl: z.string().url().optional().nullable(),
    tags: z.array(z.string().min(1)).min(1),
  })
  .refine((data) => data.type !== "download" || !!data.fileUrl, {
    message: "Downloads require a file upload.",
    path: ["fileUrl"],
  })
  .refine((data) => data.type !== "tool-link" || !!data.externalUrl, {
    message: "Tool links require an external URL.",
    path: ["externalUrl"],
  });

export type ResourceInput = z.infer<typeof resourceSchema>;

function revalidateResourcePaths() {
  revalidatePath("/animate/resources");
}

export async function listResources() {
  await requireSession();
  return db.select().from(resources).orderBy(asc(resources.sortOrder));
}

export async function getResource(id: string) {
  await requireSession();
  const [row] = await db.select().from(resources).where(eq(resources.id, id));
  return row ?? null;
}

export async function createResource(input: ResourceInput) {
  await requireSession();
  const data = resourceSchema.parse(input);
  const [row] = await db.insert(resources).values(data).returning();
  revalidateResourcePaths();
  return row;
}

export async function updateResource(id: string, input: ResourceInput) {
  await requireSession();
  const data = resourceSchema.parse(input);
  const [row] = await db.update(resources).set(data).where(eq(resources.id, id)).returning();
  revalidateResourcePaths();
  return row;
}

export async function deleteResource(id: string) {
  await requireSession();
  await db.delete(resources).where(eq(resources.id, id));
  revalidateResourcePaths();
}

export async function reorderResources(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(resources).set({ sortOrder: index }).where(eq(resources.id, id))
    )
  );
  revalidateResourcePaths();
}
