import crypto from "node:crypto";
import { db } from "@/lib/db/client";
import { siteVisits } from "@/lib/db/schema";
import { getClientIp } from "@/lib/utils/client-ip";

type VisitRoute = "build" | "animate";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

// Fire-and-forget from a layout render — a failure here must never break the
// page, so errors are swallowed rather than surfaced.
export async function recordVisit(route: VisitRoute) {
  try {
    const ip = await getClientIp();
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    await db
      .insert(siteVisits)
      .values({ visitDate: todayUtc(), route, ipHash })
      .onConflictDoNothing();
  } catch {
    // Analytics must never take the page down with it.
  }
}
