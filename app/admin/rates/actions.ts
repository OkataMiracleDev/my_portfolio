"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  saveRetainerTiers,
  saveRateServices,
  saveRateAddons,
  saveRateTerms,
} from "@/lib/actions/rate-page";
import type { SaveState } from "@/components/Admin/RatePage/RateEditorShell";

/**
 * Form actions for /admin/rates.
 *
 * These return a SaveState instead of redirecting, unlike the rest of the
 * admin: the four sections all live on one screen and get edited in a run
 * ("bump Growth, add an add-on, reword a term"), so a redirect after each save
 * would throw away the other three sections' in-progress edits.
 *
 * Each section posts its whole list as one JSON `payload` field -- see the
 * editors for why -- so a malformed payload is a plausible failure mode rather
 * than an impossible one. Failures come back as a message on the form rather
 * than an error page, which would lose those same in-progress edits.
 */

function parsePayload(formData: FormData): unknown {
  const raw = formData.get("payload");
  if (typeof raw !== "string") throw new Error("the form data did not arrive.");
  return JSON.parse(raw);
}

/** Turns a Zod failure into something that names the offending row and field. */
function describe(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues
      .slice(0, 3)
      .map((issue) => {
        // Paths look like [1, "name"] (row 1's name) or [0, "features", 2].
        const [row, field] = issue.path;
        const where =
          typeof row === "number" ? `row ${row + 1}${field ? ` (${String(field)})` : ""}` : null;
        return where ? `${where}: ${issue.message.toLowerCase()}` : issue.message;
      })
      .join("; ");
  }
  return error instanceof Error ? error.message : "something went wrong.";
}

async function save<T>(formData: FormData, write: (rows: T) => Promise<void>): Promise<SaveState> {
  try {
    await write(parsePayload(formData) as T);
    revalidatePath("/admin/rates");
    return { status: "saved" };
  } catch (error) {
    return { status: "error", message: `Not saved — ${describe(error)}` };
  }
}

export async function saveRetainerTiersAction(
  _state: SaveState,
  formData: FormData
): Promise<SaveState> {
  return save(formData, saveRetainerTiers);
}

export async function saveRateServicesAction(
  _state: SaveState,
  formData: FormData
): Promise<SaveState> {
  return save(formData, saveRateServices);
}

export async function saveRateAddonsAction(
  _state: SaveState,
  formData: FormData
): Promise<SaveState> {
  return save(formData, saveRateAddons);
}

export async function saveRateTermsAction(
  _state: SaveState,
  formData: FormData
): Promise<SaveState> {
  return save(formData, saveRateTerms);
}
