import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  renderBriefEmail,
  renderBriefText,
  fallback,
  type BriefAnswer,
} from "@/lib/briefs/email";

const BRIEF_LABEL = "YouTube intro brief";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      subjectName?: string;
      channelName?: string;
      answers?: BriefAnswer[];
      selectedPackage?: string | null;
      selectedPrice?: string | null;
    };
    const { answers, selectedPackage, selectedPrice } = payload;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    // subjectName is what the brief sends now; the legacy per-brief key is
    // still read so a cached copy of the old page keeps working.
    const subjectName = fallback(payload.subjectName ?? payload.channelName);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const brief = { briefLabel: BRIEF_LABEL, subjectName, answers, selectedPackage, selectedPrice };

    await transporter.sendMail({
      to: "okatamiracle.dev@gmail.com",
      from: process.env.EMAIL_USER,
      subject: `${BRIEF_LABEL} — ${subjectName}`,
      text: renderBriefText(brief),
      html: renderBriefEmail(brief),
    });

    return NextResponse.json({ success: "Brief sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send brief" }, { status: 500 });
  }
}
