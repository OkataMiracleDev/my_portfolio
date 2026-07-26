"use server";

import { redirect } from "next/navigation";
import {
  createExperienceEntry,
  updateExperienceEntry,
  deleteExperienceEntry,
  reorderExperienceEntries,
  type ExperienceInput,
} from "@/lib/actions/experience";

function parseForm(formData: FormData): ExperienceInput {
  return {
    year: String(formData.get("year") ?? ""),
    role: String(formData.get("role") ?? ""),
    company: String(formData.get("company") ?? ""),
    description: String(formData.get("description") ?? ""),
    technologies: String(formData.get("technologies") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export async function createExperienceAction(formData: FormData) {
  await createExperienceEntry(parseForm(formData));
  redirect("/admin/experience");
}

export async function updateExperienceAction(id: string, formData: FormData) {
  await updateExperienceEntry(id, parseForm(formData));
  redirect("/admin/experience");
}

export async function deleteExperienceAction(id: string) {
  await deleteExperienceEntry(id);
}

export async function reorderExperienceAction(orderedIds: string[]) {
  await reorderExperienceEntries(orderedIds);
}
