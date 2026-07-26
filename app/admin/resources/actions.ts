"use server";

import { redirect } from "next/navigation";
import {
  createResource,
  updateResource,
  deleteResource,
  reorderResources,
  type ResourceInput,
} from "@/lib/actions/resources";

function parseForm(formData: FormData): ResourceInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    type: formData.get("type") as ResourceInput["type"],
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    fileUrl: (formData.get("fileUrl") as string) || null,
    externalUrl: (formData.get("externalUrl") as string) || null,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export async function createResourceAction(formData: FormData) {
  await createResource(parseForm(formData));
  redirect("/admin/resources");
}

export async function updateResourceAction(id: string, formData: FormData) {
  await updateResource(id, parseForm(formData));
  redirect("/admin/resources");
}

export async function deleteResourceAction(id: string) {
  await deleteResource(id);
}

export async function reorderResourcesAction(orderedIds: string[]) {
  await reorderResources(orderedIds);
}
