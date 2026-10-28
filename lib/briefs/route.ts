import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderBriefEmail, renderBriefText, fallback, type BriefAnswer } from "@/lib/briefs/email";
import { createBriefSubmission } from "@/lib/actions/brief-submissions";
import { CONTACT_EMAIL } from "@/lib/site";

interface BriefRouteConfig {
  /** Stable key stored on the row, e.g. "saas-ad". */
  briefType: string;
  /** e.g. "SaaS ad brief" — used in the email subject and the admin. */
  briefLabel: string;
  /**
   * The per-brief name key the page sent before `subjectName` was shared
   * (productName, channelName...). Still read so a cached copy of the old
   * page keeps working.
   */
  legacyNameKey: string;
}

/** Coerce whatever the page sent into clean strings, in form order. */
function normaliseAnswers(raw: unknown[]): BriefAnswer[] {
  return raw.map((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    const section = typeof entry.section === "string" && entry.section.trim() ? entry.section.trim() : undefined;
    return {
      question: typeof entry.question === "string" ? entry.question : "",
      answer: typeof entry.answer === "string" ? entry.answer : "",
      ...(section ? { section } : {}),
    };
  });
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * The POST handler every /api/*-brief route exports.
 *
 * The database row is the durable record (read it in /admin/briefs); the
 * email is the notification. Each is attempted independently, and the client
 * is only told the send failed when neither landed -- otherwise a Gmail
 * outage would have them re-sending a brief that is already saved.
 */
export function createBriefRoute({ briefType, briefLabel, legacyNameKey }: BriefRouteConfig) {
  return async function POST(request: Request) {
    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!Array.isArray(payload.answers) || payload.answers.length === 0) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const answers = normaliseAnswers(payload.answers);
    const subjectName = fallback(payload.subjectName ?? payload[legacyNameKey]);
    const selectedPackage = optionalString(payload.selectedPackage);
    const selectedPrice = optionalString(payload.selectedPrice);

    let saved = false;
    try {
      await createBriefSubmission({ briefType, briefLabel, subjectName, answers, selectedPackage, selectedPrice });
      saved = true;
    } catch (error) {
      console.error(`${briefLabel}: saving to the database failed`, error);
    }

    let emailed = false;
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const brief = { briefLabel, subjectName, answers, selectedPackage, selectedPrice };

      await transporter.sendMail({
        to: CONTACT_EMAIL,
        from: process.env.EMAIL_USER,
        subject: `${briefLabel} — ${subjectName}`,
        text: renderBriefText(brief),
        html: renderBriefEmail(brief),
      });
      emailed = true;
    } catch (error) {
      console.error(`${briefLabel}: email notification failed${saved ? " (brief was still saved)" : ""}`, error);
    }

    if (!saved && !emailed) {
      return NextResponse.json({ error: "Failed to send brief" }, { status: 500 });
    }
    return NextResponse.json({ success: "Brief sent successfully!" });
  };
}
