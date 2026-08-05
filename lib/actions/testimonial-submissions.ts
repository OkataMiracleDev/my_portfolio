"use server";

import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { testimonialSubmissions } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const submissionSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  result: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
  consent: z.boolean().default(false),
});

export type TestimonialSubmissionInput = z.infer<typeof submissionSchema>;

// Called from the public /api/testimonial route — no session, this is the
// intended write path for anonymous client submissions.
export async function createTestimonialSubmission(input: TestimonialSubmissionInput) {
  const data = submissionSchema.parse(input);
  const [row] = await db.insert(testimonialSubmissions).values(data).returning();
  return row;
}

export async function listTestimonialSubmissions() {
  await requireSession();
  return db.select().from(testimonialSubmissions).orderBy(desc(testimonialSubmissions.createdAt));
}

export async function getTestimonialSubmission(id: string) {
  await requireSession();
  const [row] = await db.select().from(testimonialSubmissions).where(eq(testimonialSubmissions.id, id));
  return row ?? null;
}

export async function markTestimonialSubmissionStatus(id: string, status: "new" | "promoted" | "archived") {
  await requireSession();
  await db.update(testimonialSubmissions).set({ status }).where(eq(testimonialSubmissions.id, id));
  revalidatePath("/admin/testimonials/submissions");
}
