"use server";

import { redirect } from "next/navigation";
import {
  createMotionProject,
  updateMotionProject,
  deleteMotionProject,
  reorderMotionProjects,
  type MotionProjectInput,
} from "@/lib/actions/motion-projects";

function parseForm(formData: FormData): MotionProjectInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    thumbnail: String(formData.get("thumbnail") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    videoEmbedUrl: (formData.get("videoEmbedUrl") as string) || null,
    processSteps: formData
      .getAll("processStepTitle")
      .map(String)
      .map((title, i) => ({
        title,
        body: String(formData.getAll("processStepBody")[i] ?? ""),
      }))
      .filter((step) => step.title.trim() || step.body.trim()),
    tools: String(formData.get("tools") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    storyboardImages: formData.getAll("storyboardImages").map(String).filter(Boolean),
    featuredOnHome: formData.get("featuredOnHome") === "on",
  };
}

export async function createMotionProjectAction(formData: FormData) {
  await createMotionProject(parseForm(formData));
  redirect("/admin/projects/animate");
}

export async function updateMotionProjectAction(id: string, formData: FormData) {
  await updateMotionProject(id, parseForm(formData));
  redirect("/admin/projects/animate");
}

export async function deleteMotionProjectAction(id: string) {
  await deleteMotionProject(id);
}

export async function reorderMotionProjectsAction(orderedIds: string[]) {
  await reorderMotionProjects(orderedIds);
}
