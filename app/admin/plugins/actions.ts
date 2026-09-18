"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import {
  createPlugin,
  updatePlugin,
  deletePlugin,
  reorderPlugins,
} from "@/lib/actions/plugins";
import { pluginSchema, type PluginInput } from "@/lib/schemas/plugin";

// A "use server" module may only export async functions, so the type lives
// here (types are erased) and the idle value lives in PluginForm.tsx.
export type PluginFormState = { error?: string };

function parseForm(formData: FormData): Partial<PluginInput> {
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

const FIELD_LABELS: Record<string, string> = {
  slug: "Slug",
  title: "Title",
  description: "Description",
  tags: "Tags",
  thumbnailUrl: "Thumbnail",
  fileUrl: "Plugin file",
  priceAmount: "Price",
};

/**
 * Names the field that failed, because the alternative was an error page.
 *
 * Saving with an empty thumbnail or plugin file -- which is exactly what
 * happens when an upload fails and you hit Save anyway -- threw a ZodError
 * straight out of the server action. Next has nowhere to put that, so the
 * whole screen became "Application error: a server-side exception has
 * occurred" and the form's other fields were gone. Now it comes back as a
 * line above the Save button and everything typed so far survives.
 */
function describe(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues
      .slice(0, 3)
      .map((issue) => {
        const field = String(issue.path[0] ?? "");
        const label = FIELD_LABELS[field];
        return label ? `${label}: ${issue.message}` : issue.message;
      })
      .join("; ");
  }
  if (error instanceof Error && /UNIQUE|constraint/i.test(error.message)) {
    return "that slug is already taken.";
  }
  return error instanceof Error ? error.message : "something went wrong.";
}

export async function createPluginAction(
  _state: PluginFormState,
  formData: FormData
): Promise<PluginFormState> {
  const parsed = pluginSchema.safeParse(parseForm(formData));
  if (!parsed.success) return { error: `Not saved — ${describe(parsed.error)}` };

  try {
    await createPlugin(parsed.data);
  } catch (error) {
    return { error: `Not saved — ${describe(error)}` };
  }
  // Outside the try: redirect() signals by throwing, and catching it here
  // would turn a successful save into an error message.
  redirect("/admin/plugins");
}

export async function updatePluginAction(
  id: string,
  _state: PluginFormState,
  formData: FormData
): Promise<PluginFormState> {
  const parsed = pluginSchema.safeParse(parseForm(formData));
  if (!parsed.success) return { error: `Not saved — ${describe(parsed.error)}` };

  try {
    await updatePlugin(id, parsed.data);
  } catch (error) {
    return { error: `Not saved — ${describe(error)}` };
  }
  redirect("/admin/plugins");
}

export async function deletePluginAction(id: string) {
  await deletePlugin(id);
}

export async function reorderPluginsAction(orderedIds: string[]) {
  await reorderPlugins(orderedIds);
}
