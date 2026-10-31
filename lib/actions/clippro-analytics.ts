"use server";

import { desc, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { clipproEvents } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { allReleases, getClipProReleases } from "@/lib/clippro";
import { computeClipProStats, type ClipProStats, type Row } from "@/lib/analytics/clippro-stats";

/** Admin → ClipPro: the last `days` days of ClipPro events, aggregated. */
export async function getClipProStats(days = 30): Promise<ClipProStats> {
  await requireSession();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (days - 1));
  let rows: Row[] = [];
  let tableMissing = false;
  try {
    rows = await db
      .select()
      .from(clipproEvents)
      .where(gte(clipproEvents.day, since.toISOString().slice(0, 10)))
      .orderBy(desc(clipproEvents.createdAt));
  } catch {
    // The migration that creates clippro_events hasn't been applied yet.
    tableMissing = true;
  }
  const releases = await getClipProReleases();
  return computeClipProStats(rows, allReleases(releases), days, tableMissing);
}
