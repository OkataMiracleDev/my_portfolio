import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { loginAttempts } from "@/lib/db/schema";

const WINDOW_MINUTES = 15;
const MAX_FAILED_ATTEMPTS = 5;

export async function isLockedOut(ipAddress: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const rows = await db
    .select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipAddress, ipAddress),
        eq(loginAttempts.success, false),
        gt(loginAttempts.attemptedAt, windowStart)
      )
    );
  return rows.length >= MAX_FAILED_ATTEMPTS;
}

export async function recordLoginAttempt(ipAddress: string, success: boolean) {
  await db.insert(loginAttempts).values({ ipAddress, success });
}
