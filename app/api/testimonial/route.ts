import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createTestimonialSubmission } from "@/lib/actions/testimonial-submissions";

export async function POST(request: Request) {
  try {
    const { name, company, project, problem, process, result, quote, consent } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // DB write is the durable record — curated later in /admin/testimonials.
    // Email is best-effort notification only; a failure there shouldn't
    // fail the whole submission since the data is already saved.
    await createTestimonialSubmission({ name, company, project, problem, process, result, quote, consent: Boolean(consent) });

    const fallback = (value: unknown) => (typeof value === "string" && value.trim() ? value : "(not given)");

    try {
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
        subject: `New testimonial — ${fallback(name)}`,
        text: [
          `Name: ${fallback(name)}`,
          `Company/role: ${fallback(company)}`,
          `Project: ${fallback(project)}`,
          "",
          `Problem going in:\n${fallback(problem)}`,
          "",
          `What it was like working together:\n${fallback(process)}`,
          "",
          `What changed:\n${fallback(result)}`,
          "",
          `One-line summary:\n${fallback(quote)}`,
          "",
          `OK to publish publicly: ${consent ? "Yes" : "No"}`,
          "",
          "Review and curate this in /admin/testimonials/submissions.",
        ].join("\n"),
        html: `
          <p><strong>Name:</strong> ${fallback(name)}</p>
          <p><strong>Company/role:</strong> ${fallback(company)}</p>
          <p><strong>Project:</strong> ${fallback(project)}</p>
          <p><strong>Problem going in:</strong><br>${fallback(problem)}</p>
          <p><strong>What it was like working together:</strong><br>${fallback(process)}</p>
          <p><strong>What changed:</strong><br>${fallback(result)}</p>
          <p><strong>One-line summary:</strong><br>${fallback(quote)}</p>
          <p><strong>OK to publish publicly:</strong> ${consent ? "Yes" : "No"}</p>
          <p>Review and curate this in /admin/testimonials/submissions.</p>
        `,
      });
    } catch (emailError) {
      console.error("Testimonial email notification failed (submission was still saved):", emailError);
    }

    return NextResponse.json({ success: "Testimonial sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send testimonial" }, { status: 500 });
  }
}
