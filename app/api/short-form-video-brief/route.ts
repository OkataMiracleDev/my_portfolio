import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface BriefAnswer {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const { brandName, answers } = (await request.json()) as {
      brandName?: string;
      answers?: BriefAnswer[];
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const fallback = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : "(not given)");
    const subjectName = fallback(brandName);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: "okatamiracle.dev@gmail.com",
      from: process.env.EMAIL_USER,
      subject: `Short-form video brief — ${subjectName}`,
      text: answers.map(({ question, answer }) => `${question}\n${fallback(answer)}`).join("\n\n"),
      html: `
        <h2>Short-form video brief — ${subjectName}</h2>
        ${answers
          .map(
            ({ question, answer }) =>
              `<p><strong>${question}</strong><br>${fallback(answer).replace(/\n/g, "<br>")}</p>`
          )
          .join("\n")}
      `,
    });

    return NextResponse.json({ success: "Brief sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send brief" }, { status: 500 });
  }
}
