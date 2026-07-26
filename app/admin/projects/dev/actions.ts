"use server";

import { redirect } from "next/navigation";
import {
  createDevProject,
  updateDevProject,
  deleteDevProject,
  reorderDevProjects,
  type DevProjectInput,
} from "@/lib/actions/dev-projects";

function parseForm(formData: FormData): DevProjectInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    subhead: (formData.get("subhead") as string) || null,
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    image2: (formData.get("image2") as string) || null,
    image3: (formData.get("image3") as string) || null,
    technology: String(formData.get("technology") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    date: (formData.get("date") as string) || null,
    type: (formData.get("type") as string) || null,
    client: (formData.get("client") as string) || null,
    link: (formData.get("link") as string) || null,
    featuredOnHome: formData.get("featuredOnHome") === "on",
  };
}

export async function createDevProjectAction(formData: FormData) {
  await createDevProject(parseForm(formData));
  redirect("/admin/projects/dev");
}

export async function updateDevProjectAction(id: string, formData: FormData) {
  await updateDevProject(id, parseForm(formData));
  redirect("/admin/projects/dev");
}

export async function deleteDevProjectAction(id: string) {
  await deleteDevProject(id);
}

export async function reorderDevProjectsAction(orderedIds: string[]) {
  await reorderDevProjects(orderedIds);
}
