"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { studioPlugins } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { pluginSchema, type PluginInput } from "@/lib/schemas/plugin";

function revalidatePluginPaths() {
  revalidatePath("/animate/resources");
  revalidatePath("/animate");
}

export async function listPlugins() {
  await requireSession();
  return db.select().from(studioPlugins).orderBy(asc(studioPlugins.sortOrder));
}

export async function getPlugin(id: string) {
  await requireSession();
  const [row] = await db.select().from(studioPlugins).where(eq(studioPlugins.id, id));
  return row ?? null;
}

export async function createPlugin(input: PluginInput) {
  await requireSession();
  const data = pluginSchema.parse(input);
  const [row] = await db.insert(studioPlugins).values(data).returning();
  revalidatePluginPaths();
  return row;
}

export async function updatePlugin(id: string, input: PluginInput) {
  await requireSession();
  const data = pluginSchema.parse(input);
  const [row] = await db.update(studioPlugins).set(data).where(eq(studioPlugins.id, id)).returning();
  revalidatePluginPaths();
  return row;
}

export async function deletePlugin(id: string) {
  await requireSession();
  await db.delete(studioPlugins).where(eq(studioPlugins.id, id));
  revalidatePluginPaths();
}

export async function reorderPlugins(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) => db.update(studioPlugins).set({ sortOrder: index }).where(eq(studioPlugins.id, id)))
  );
  revalidatePluginPaths();
}
