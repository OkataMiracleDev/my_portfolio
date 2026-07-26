"use server";

import { redirect } from "next/navigation";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  type TestimonialInput,
} from "@/lib/actions/testimonials";

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
