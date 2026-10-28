"use server";

import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { briefSubmissions } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const answerSchema = z.object({
  question: z.string().max(1000),
  answer: z.string().max(20000),
  section: z.string().max(200).optional(),
});

const submissionSchema = z.object({
  briefType: z.string().min(1).max(100),
  briefLabel: z.string().min(1).max(200),
  subjectName: z.string().min(1).max(500),
  answers: z.array(answerSchema).min(1).max(200),
  selectedPackage: z.string().max(500).optional().nullable(),
  selectedPrice: z.string().max(200).optional().nullable(),
});

export type BriefSubmissionInput = z.infer<typeof submissionSchema>;

// Called from the public /api/*-brief routes — no session, this is the
// intended write path for anonymous client submissions.
export async function createBriefSubmission(input: BriefSubmissionInput) {
  const data = submissionSchema.parse(input);
  const [row] = await db.insert(briefSubmissions).values(data).returning();
  return row;
}

export async function listBriefSubmissions() {
  await requireSession();
  return db.select().from(briefSubmissions).orderBy(desc(briefSubmissions.createdAt));
}

export async function getBriefSubmission(id: string) {
  await requireSession();
  const [row] = await db.select().from(briefSubmissions).where(eq(briefSubmissions.id, id));
  return row ?? null;
}

export async function setBriefSubmissionStatus(id: string, status: "new" | "read" | "archived") {
  await requireSession();
  await db.update(briefSubmissions).set({ status }).where(eq(briefSubmissions.id, id));
  revalidatePath("/admin/briefs");
  revalidatePath(`/admin/briefs/${id}`);
}

// Called while rendering the detail page, where revalidatePath isn't allowed.
// The list is force-dynamic, so it picks the change up on the next visit anyway.
export async function markBriefSubmissionRead(id: string) {
  await requireSession();
  await db
    .update(briefSubmissions)
    .set({ status: "read" })
    .where(and(eq(briefSubmissions.id, id), eq(briefSubmissions.status, "new")));
}

export async function deleteBriefSubmission(id: string) {
  await requireSession();
  await db.delete(briefSubmissions).where(eq(briefSubmissions.id, id));
  revalidatePath("/admin/briefs");
}
