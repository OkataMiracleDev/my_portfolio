import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { clients, rateCards } from "@/lib/db/schema";

export type SealResult =
  | { ok: true; alreadySealed: boolean }
  | { ok: false; reason: "not-found" };

/**
 * Locks a client's rate card to the package they committed to.
 *
 * Called from the brief page once the client has actually finished with it
 * -- either sending it back or printing it to PDF. Until that happens the
 * portal keeps the packages selectable, because a client who is still
 * deciding should be able to change their mind.
 *
 * Authorisation is the portal share token itself: whoever holds the link is
 * the client, and sealing is their own action on their own card. The card is
 * matched against the token's client so one client's link can never seal
 * another's card.
 *
 * Idempotent, and deliberately first-write-wins: the `isNull(sealedAt)`
 * guard means a second send, a print after a send, or a double-click cannot
 * rewrite a selection that is already locked. Re-sealing would let a client
 * quietly swap packages after the fact, which is the whole thing this
 * prevents.
 */
export async function sealRateCard(input: {
  shareToken: string;
  cardId: string;
  selection: string | null;
}): Promise<SealResult> {
  const [client] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.shareToken, input.shareToken));
  if (!client) return { ok: false, reason: "not-found" };

  const [card] = await db
    .select({ id: rateCards.id, sealedAt: rateCards.sealedAt })
    .from(rateCards)
    .where(and(eq(rateCards.id, input.cardId), eq(rateCards.clientId, client.id)));
  if (!card) return { ok: false, reason: "not-found" };

  if (card.sealedAt) return { ok: true, alreadySealed: true };

  const updated = await db
    .update(rateCards)
    .set({ sealedAt: new Date(), sealedSelection: input.selection })
    .where(and(eq(rateCards.id, card.id), isNull(rateCards.sealedAt)))
    .returning({ id: rateCards.id });

  // Lost the race to a concurrent seal — the other write won, which is the
  // same outcome from the client's point of view.
  return { ok: true, alreadySealed: updated.length === 0 };
}
