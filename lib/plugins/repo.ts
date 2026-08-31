import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { studioPlugins, pluginPurchases } from "@/lib/db/schema";
import { canTransitionToPaid } from "./purchase-status";

// Full row, including fileUrl. Only ever call this from server-side code
// on the checkout/download path (init route, download route, webhook,
// success page) — never expose the result directly to the client.
export async function getPluginById(id: string) {
  const [row] = await db.select().from(studioPlugins).where(eq(studioPlugins.id, id));
  return row ?? null;
}

// The only place fileUrl is read for actual file delivery.
export async function getPluginFileUrl(pluginId: string): Promise<string | null> {
  const [row] = await db
    .select({ fileUrl: studioPlugins.fileUrl })
    .from(studioPlugins)
    .where(eq(studioPlugins.id, pluginId));
  return row?.fileUrl ?? null;
}

export interface CreatePendingPurchaseInput {
  pluginId: string;
  email: string;
  amountPaid: number;
}

export async function createPendingPurchase(input: CreatePendingPurchaseInput): Promise<string> {
  const reference = "plg_" + crypto.randomUUID();
  await db.insert(pluginPurchases).values({
    reference,
    pluginId: input.pluginId,
    email: input.email,
    amountPaid: input.amountPaid,
    status: "pending",
  });
  return reference;
}

export async function getPurchaseByReference(reference: string) {
  const [row] = await db.select().from(pluginPurchases).where(eq(pluginPurchases.reference, reference));
  return row ?? null;
}

export async function getPurchaseByToken(token: string) {
  const [row] = await db.select().from(pluginPurchases).where(eq(pluginPurchases.downloadToken, token));
  return row ?? null;
}

export async function getPaidPurchasesByEmail(email: string) {
  return db
    .select()
    .from(pluginPurchases)
    .where(and(eq(pluginPurchases.email, email), eq(pluginPurchases.status, "paid")));
}

export interface MarkPurchasePaidResult {
  purchase: typeof pluginPurchases.$inferSelect | null;
  justPaid: boolean;
}

// Idempotent: safe to call for the same reference from both the webhook
// and the success-page callback, in either order, any number of times —
// see lib/plugins/purchase-status.ts.
//
// amountPaidConfirmed is whatever Paystack itself reports as charged
// (from verifyTransaction or the webhook payload), never client input.
// It's compared against the amount stored when the purchase was created
// (which was already validated by validateAmount() at init time, and is
// exactly what we told Paystack to charge) — a mismatch means something
// is wrong (tampering, a Paystack-side anomaly) and the purchase is left
// pending rather than silently completed.
export async function markPurchasePaid(
  reference: string,
  amountPaidConfirmed: number
): Promise<MarkPurchasePaidResult> {
  const existing = await getPurchaseByReference(reference);
  if (!existing) return { purchase: null, justPaid: false };

  if (!canTransitionToPaid(existing.status)) {
    return { purchase: existing, justPaid: false };
  }

  if (amountPaidConfirmed !== existing.amountPaid) {
    return { purchase: existing, justPaid: false };
  }

  const downloadToken = crypto.randomBytes(24).toString("hex");
  const updated = await db
    .update(pluginPurchases)
    .set({ status: "paid", downloadToken })
    .where(and(eq(pluginPurchases.reference, reference), eq(pluginPurchases.status, "pending")))
    .returning();

  if (updated.length === 0) {
    // Lost the race to a concurrent call — re-fetch and report not-just-paid.
    const fresh = await getPurchaseByReference(reference);
    return { purchase: fresh, justPaid: false };
  }

  return { purchase: updated[0], justPaid: true };
}

export async function markPurchaseCancelled(reference: string): Promise<void> {
  await db
    .update(pluginPurchases)
    .set({ status: "cancelled" })
    .where(and(eq(pluginPurchases.reference, reference), eq(pluginPurchases.status, "pending")));
}
