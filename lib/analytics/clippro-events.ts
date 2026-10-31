import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { clipproEvents } from "@/lib/db/schema";

/**
 * ClipPro analytics, server side. Events arrive from the browser (lib/clippro-track.ts, via
 * POST /api/clippro/events) and from the download redirect (/api/clippro/download).
 *
 * Privacy: no cookies and no raw IPs. A visitor is sha256(IP + user agent + day + salt), so one
 * person is one visitor within a UTC day and can't be followed across days. Country comes from
 * Vercel's edge header, browser and device from the user agent. Bots are dropped.
 */

export const SURFACES = ["build", "animate", "resources", "page"] as const;
export type Surface = (typeof SURFACES)[number];

export const clientEventSchema = z.object({
  type: z.enum(["view", "impression", "dwell", "scroll", "time", "click"]),
  surface: z.enum(SURFACES),
  label: z.string().max(40).optional(),
  value: z.number().int().min(0).max(6 * 60 * 60 * 1000).optional(),
});

export const clientBatchSchema = z.object({
  sessionId: z.string().min(8).max(64),
  path: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  utm: z
    .object({ source: z.string().max(100).optional(), medium: z.string().max(100).optional(), campaign: z.string().max(100).optional() })
    .optional(),
  events: z.array(clientEventSchema).min(1).max(25),
});

export type ClientBatch = z.infer<typeof clientBatchSchema>;

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget|python|vercel-screenshot|facebookexternalhit|embedly/i;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /samsungbrowser/i.test(ua)
          ? "Samsung Internet"
          : /chrome|crios/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /iphone|ipad|ios/i.test(ua)
      ? "iOS"
      : /mac os/i.test(ua)
        ? "macOS"
        : /android/i.test(ua)
          ? "Android"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";
  return { device, browser, os };
}

/** Just the host of a referrer, and nothing for links within this site. */
export function referrerHost(referrer: string | undefined, ownHost: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (ownHost && host === ownHost.replace(/^www\./, "")) return null;
    return host || null;
  } catch {
    return null;
  }
}

interface RequestContext {
  visitorHash: string;
  country: string | null;
  device: string;
  browser: string;
  os: string;
  host: string | null;
  bot: boolean;
}

async function requestContext(): Promise<RequestContext> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const day = todayUtc();
  const salt = process.env.ANALYTICS_SALT ?? process.env.SESSION_SECRET ?? "okata";
  const visitorHash = crypto.createHash("sha256").update(`${ip}|${ua}|${day}|${salt}`).digest("hex").slice(0, 32);
  return {
    visitorHash,
    country: h.get("x-vercel-ip-country"),
    ...parseUserAgent(ua),
    host: h.get("host"),
    bot: !ua || BOT.test(ua),
  };
}

/** Stores a batch from the browser. Never throws: analytics must not break anything. */
export async function recordClientBatch(batch: ClientBatch): Promise<void> {
  try {
    const ctx = await requestContext();
    if (ctx.bot) return;
    const day = todayUtc();
    await db.insert(clipproEvents).values(
      batch.events.map((e) => ({
        day,
        type: e.type,
        surface: e.surface,
        label: e.label ?? null,
        value: e.value ?? null,
        sessionId: batch.sessionId,
        visitorHash: ctx.visitorHash,
        path: batch.path ?? null,
        referrer: referrerHost(batch.referrer, ctx.host),
        utmSource: batch.utm?.source ?? null,
        utmMedium: batch.utm?.medium ?? null,
        utmCampaign: batch.utm?.campaign ?? null,
        country: ctx.country,
        device: ctx.device,
        browser: ctx.browser,
        os: ctx.os,
      }))
    );
  } catch {
    // Analytics must never take a request down with it.
  }
}

/** Records one download (from the redirect route). Never throws. */
export async function recordDownload(surface: Surface, version: string, sessionId: string | null, referrer: string | null): Promise<void> {
  try {
    const ctx = await requestContext();
    if (ctx.bot) return;
    await db.insert(clipproEvents).values({
      day: todayUtc(),
      type: "download",
      surface,
      label: version,
      sessionId: sessionId || `dl-${ctx.visitorHash.slice(0, 16)}`,
      visitorHash: ctx.visitorHash,
      referrer: referrerHost(referrer ?? undefined, ctx.host),
      country: ctx.country,
      device: ctx.device,
      browser: ctx.browser,
      os: ctx.os,
    });
  } catch {
    // Never block the download.
  }
}
