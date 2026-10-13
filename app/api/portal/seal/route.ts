import { NextResponse } from "next/server";
import { sealRateCard } from "@/lib/portal/seal";

/**
 * Called by the brief pages (public/okata-studios-*-brief.html) once the
 * client has sent their brief or printed it to PDF. The brief carries the
 * portal token and card id in its own query string, put there by the
 * portal's "Accept & get started" button.
 *
 * Unauthenticated by design -- the portal share token is the credential,
 * exactly as it is for the portal page itself.
 */
export async function POST(request: Request) {
  let body: { portal?: unknown; card?: unknown; selection?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { portal, card, selection } = body;
  if (typeof portal !== "string" || !portal || typeof card !== "string" || !card) {
    return NextResponse.json({ error: "portal and card are required" }, { status: 400 });
  }

  const result = await sealRateCard({
    shareToken: portal,
    cardId: card,
    selection: typeof selection === "string" && selection.trim() ? selection.trim() : null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Portal or card not found" }, { status: 404 });
  }

  return NextResponse.json({ sealed: true, alreadySealed: result.alreadySealed });
}
