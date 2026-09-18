import { z } from "zod";

/**
 * Lives outside lib/actions/plugins.ts because that file is "use server",
 * which may only export async functions -- the form action in
 * app/admin/plugins/actions.ts needs the schema itself so it can safeParse
 * and report which field failed instead of letting a throw reach the user.
 */
export const pluginSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1, "add at least one tag."),
  thumbnailUrl: z.string().url("upload a thumbnail before saving."),
  fileUrl: z.string().url("upload the plugin .zip before saving."),
  priceAmount: z.number().int().min(0),
  pwywEnabled: z.boolean(),
  published: z.boolean(),
});

export type PluginInput = z.infer<typeof pluginSchema>;
