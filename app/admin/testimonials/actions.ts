"use server";

import { redirect } from "next/navigation";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  type TestimonialInput,
} from "@/lib/actions/testimonials";
import { markTestimonialSubmissionStatus } from "@/lib/actions/testimonial-submissions";

function parseForm(formData: FormData): TestimonialInput {
  return {
    route: formData.get("route") as TestimonialInput["route"],
    name: String(formData.get("name") ?? ""),
    role: (formData.get("role") as string) || null,
    quote: String(formData.get("quote") ?? ""),
    avatar: String(formData.get("avatar") ?? ""),
  };
}

export async function createTestimonialAction(formData: FormData) {
  await createTestimonial(parseForm(formData));

  const fromSubmissionId = formData.get("fromSubmissionId") as string | null;
  if (fromSubmissionId) {
    await markTestimonialSubmissionStatus(fromSubmissionId, "promoted");
  }

  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  await updateTestimonial(id, parseForm(formData));
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  await deleteTestimonial(id);
}

export async function reorderTestimonialsAction(orderedIds: string[]) {
  await reorderTestimonials(orderedIds);
}
