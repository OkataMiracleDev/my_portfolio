"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const postSchema = z.object({
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  route: z.enum(["build", "animate", "general"]),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  coverImage: z.string().optional().nullable(),
  bodyMarkdown: z.string().min(1),
  published: z.boolean().default(false),
});

export type PostInput = z.infer<typeof postSchema>;

function revalidatePostPaths() {
  revalidatePath("/build/blog");
}

export async function listPosts() {
  await requireSession();
  return db.select().from(posts).orderBy(asc(posts.createdAt));
}

export async function getPost(id: string) {
  await requireSession();
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}

export async function createPost(input: PostInput) {
  await requireSession();
  const data = postSchema.parse(input);
  const [row] = await db
    .insert(posts)
    .values({ ...data, publishedAt: data.published ? new Date() : null })
    .returning();
  revalidatePostPaths();
  return row;
}

export async function updatePost(id: string, input: PostInput) {
  await requireSession();
  const data = postSchema.parse(input);
  const existing = await getPost(id);
  const publishedAt = data.published ? existing?.publishedAt ?? new Date() : null;
  const [row] = await db
    .update(posts)
    .set({ ...data, publishedAt, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  revalidatePostPaths();
  return row;
}

export async function deletePost(id: string) {
  await requireSession();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePostPaths();
}
