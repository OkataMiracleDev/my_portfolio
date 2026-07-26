import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const VALID_MODES = ["build", "animate"] as const;
type ContactMode = (typeof VALID_MODES)[number];

function resolveMode(mode: unknown): ContactMode {
  return VALID_MODES.includes(mode as ContactMode) ? (mode as ContactMode) : "build";
}

export async function POST(request: Request) {
  try {
    const { fullName, email, message, mode } = await request.json();

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const safeMode = resolveMode(mode);
    const modeLabel = safeMode === "animate" ? "Animate" : "Build";

    // Create a transporter (use your Gmail credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    // Compose the email
    await transporter.sendMail({
      from: email,
      to: "okatamiracle.dev@gmail.com",
      subject: `New Contact Form Submission from ${fullName} (via ${modeLabel})`,
      text: message,
      html: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mode:</strong> ${modeLabel}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    return NextResponse.json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
