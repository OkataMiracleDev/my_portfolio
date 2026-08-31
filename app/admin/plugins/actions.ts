"use server";

import { redirect } from "next/navigation";
import {
  createPlugin,
  updatePlugin,
  deletePlugin,
  reorderPlugins,
  type PluginInput,
} from "@/lib/actions/plugins";

function parseForm(formData: FormData): PluginInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? ""),
    fileUrl: String(formData.get("fileUrl") ?? ""),
    priceAmount: Number(formData.get("priceAmount") ?? 0),
    pwywEnabled: formData.get("pwywEnabled") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createPluginAction(formData: FormData) {
  await createPlugin(parseForm(formData));
  redirect("/admin/plugins");
}

export async function updatePluginAction(id: string, formData: FormData) {
  await updatePlugin(id, parseForm(formData));
  redirect("/admin/plugins");
}

export async function deletePluginAction(id: string) {
  await deletePlugin(id);
}

export async function reorderPluginsAction(orderedIds: string[]) {
  await reorderPlugins(orderedIds);
}
