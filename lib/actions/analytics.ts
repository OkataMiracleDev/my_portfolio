"use server";

import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteVisits } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

export interface DailyRouteVisits {
  visitDate: string;
  build: number;
  animate: number;
  landing: number;
  total: number;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoUtc(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

// Counts are derived in JS from raw rows rather than a SQL count() — every
// row already represents one unique (date, route, ip) visit thanks to
// site_visits' unique index, so counting rows per date IS the unique-visitor
// count. Avoids any ambiguity over how the libSQL driver types aggregate
// query results.
export async function getVisitSummary(windowDays = 30) {
  await requireSession();

  const rows = await db.select().from(siteVisits).orderBy(desc(siteVisits.visitDate));

  const byDate = new Map<string, DailyRouteVisits>();
  for (const row of rows) {
    const entry =
      byDate.get(row.visitDate) ?? { visitDate: row.visitDate, build: 0, animate: 0, landing: 0, total: 0 };
    entry[row.route] += 1;
    entry.total += 1;
    byDate.set(row.visitDate, entry);
  }

  const allDaily = Array.from(byDate.values()).sort((a, b) => (a.visitDate < b.visitDate ? 1 : -1));
  const daily = allDaily.slice(0, windowDays);

  const today = todayUtc();
  const todayEntry: DailyRouteVisits =
    allDaily.find((d) => d.visitDate === today) ??
    { visitDate: today, build: 0, animate: 0, landing: 0, total: 0 };

  const weekStart = daysAgoUtc(6);
  const weekTotal = allDaily.filter((d) => d.visitDate >= weekStart).reduce((sum, d) => sum + d.total, 0);

  return {
    daily,
    today: todayEntry,
    weekTotal,
    allTimeTotal: rows.length,
  };
}
