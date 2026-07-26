"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const testimonialSchema = z.object({
  route: z.enum(["build", "animate"]),
  name: z.string().min(1).max(200),
  role: z.string().max(200).optional().nullable(),
  quote: z.string().min(1),
  avatar: z.string().min(1),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

function revalidateTestimonialPaths() {
  revalidatePath("/build");
  revalidatePath("/animate");
}

export async function listTestimonials() {
  await requireSession();
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}

export async function getTestimonial(id: string) {
  await requireSession();
  const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id));
  return row ?? null;
}

export async function createTestimonial(input: TestimonialInput) {
  await requireSession();
  const data = testimonialSchema.parse(input);
  const [row] = await db.insert(testimonials).values(data).returning();
  revalidateTestimonialPaths();
  return row;
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await requireSession();
  const data = testimonialSchema.parse(input);
  const [row] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
  revalidateTestimonialPaths();
  return row;
}

export async function deleteTestimonial(id: string) {
  await requireSession();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidateTestimonialPaths();
}

export async function reorderTestimonials(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(testimonials).set({ sortOrder: index }).where(eq(testimonials.id, id))
    )
  );
  revalidateTestimonialPaths();
}
