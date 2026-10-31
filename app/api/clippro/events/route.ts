import { NextResponse } from "next/server";
import { clientBatchSchema, recordClientBatch } from "@/lib/analytics/clippro-events";

/**
 * ClipPro analytics events from the browser (lib/clippro-track.ts), sent with sendBeacon. Always
 * answers 204: a rejected or failed batch is dropped silently, and the page never waits on it.
 */
export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > 16_000) return new NextResponse(null, { status: 204 });
    const parsed = clientBatchSchema.safeParse(JSON.parse(text));
    if (parsed.success) await recordClientBatch(parsed.data);
  } catch {
    // Malformed body: ignore.
  }
  return new NextResponse(null, { status: 204 });
}
