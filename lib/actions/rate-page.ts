"use server";

import { z } from "zod";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BatchItem } from "drizzle-orm/batch";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "@/lib/db/client";
import { rateRetainerTiers, rateServices, rateAddons, rateTerms } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

/**
 * Editing for the public /animate/rates page.
 *
 * Unlike the other content types in this folder, these save a whole section at
 * once instead of one row per request. The page is four short lists that get
 * retuned together -- bump the Growth tier, add an add-on, reword a term --
 * and a per-row create/edit/delete flow would mean a page load per change.
 * So each admin section posts its full list and the action replaces the
 * table's contents with it, which also makes reordering fall out for free:
 * array position becomes sortOrder.
 *
 * Replacement is delete-then-insert inside a libSQL batch, so a failed insert
 * (a Zod-valid but constraint-violating row, a dropped connection mid-write)
 * cannot leave the section empty. See replaceSection below.
 */

const tierSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(60),
  tagline: z.string().min(1).max(200),
  // Coerced because it arrives as a string from a number input.
  monthly: z.coerce.number().int().min(0).max(1_000_000),
  features: z.array(z.string().min(1).max(200)).max(20),
  featured: z.boolean(),
});

const serviceSchema = z.object({
  timecode: z.string().min(1).max(30),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(400),
  price: z.string().min(1).max(60),
  unit: z.string().min(1).max(60),
});

const addonSchema = z.object({
  name: z.string().min(1).max(160),
  value: z.string().min(1).max(60),
});

const termSchema = z.object({
  body: z.string().min(1).max(500),
});

export type RetainerTierInput = z.infer<typeof tierSchema>;
export type RateServiceInput = z.infer<typeof serviceSchema>;
export type RateAddonInput = z.infer<typeof addonSchema>;
export type RateTermInput = z.infer<typeof termSchema>;

// A section holds at most a handful of rows, so capping the list keeps a
// malformed or malicious payload from turning one save into a bulk insert.
const MAX_ROWS = 24;

async function replaceSection<T extends SQLiteTable>(table: T, rows: T["$inferInsert"][]) {
  // db.batch() sends the whole thing as one libSQL transaction: either the
  // delete and every insert land, or none do. Without it, a delete that
  // succeeded followed by an insert that failed would wipe the section.
  const statements = [
    db.delete(table),
    ...rows.map((row) => db.insert(table).values(row)),
  ] as const;
  // batch() wants a non-empty tuple; the leading delete guarantees one, but
  // that is not something the spread above can prove to the type system.
  await db.batch(statements as unknown as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
  revalidatePath("/animate/rates");
}

export async function listRetainerTiers() {
  await requireSession();
  return db.select().from(rateRetainerTiers).orderBy(asc(rateRetainerTiers.sortOrder));
}

export async function saveRetainerTiers(input: RetainerTierInput[]) {
  await requireSession();
  const rows = z.array(tierSchema).max(MAX_ROWS).parse(input);
  await replaceSection(
    rateRetainerTiers,
    rows.map((row, index) => ({ ...row, sortOrder: index }))
  );
}

export async function listRateServices() {
  await requireSession();
  return db.select().from(rateServices).orderBy(asc(rateServices.sortOrder));
}

export async function saveRateServices(input: RateServiceInput[]) {
  await requireSession();
  const rows = z.array(serviceSchema).max(MAX_ROWS).parse(input);
  await replaceSection(
    rateServices,
    rows.map((row, index) => ({ ...row, sortOrder: index }))
  );
}

export async function listRateAddons() {
  await requireSession();
  return db.select().from(rateAddons).orderBy(asc(rateAddons.sortOrder));
}

export async function saveRateAddons(input: RateAddonInput[]) {
  await requireSession();
  const rows = z.array(addonSchema).max(MAX_ROWS).parse(input);
  await replaceSection(
    rateAddons,
    rows.map((row, index) => ({ ...row, sortOrder: index }))
  );
}

export async function listRateTerms() {
  await requireSession();
  return db.select().from(rateTerms).orderBy(asc(rateTerms.sortOrder));
}

export async function saveRateTerms(input: RateTermInput[]) {
  await requireSession();
  const rows = z.array(termSchema).max(MAX_ROWS).parse(input);
  await replaceSection(
    rateTerms,
    rows.map((row, index) => ({ ...row, sortOrder: index }))
  );
}
