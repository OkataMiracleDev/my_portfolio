// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const { createBriefSubmission, sendMail } = vi.hoisted(() => ({
  createBriefSubmission: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("@/lib/actions/brief-submissions", () => ({ createBriefSubmission }));
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

import { createBriefRoute } from "../route";
import { CONTACT_EMAIL } from "@/lib/site";

const POST = createBriefRoute({
  briefType: "saas-ad",
  briefLabel: "SaaS ad brief",
  legacyNameKey: "productName",
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/saas-ad-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

const answers = [
  { question: "Product or company name", answer: "Acme", section: "The product" },
  { question: "What does it do?", answer: "Tracks churn\nin real time", section: "The product" },
];

beforeEach(() => {
  createBriefSubmission.mockReset().mockResolvedValue({});
  sendMail.mockReset().mockResolvedValue({});
});

describe("createBriefRoute", () => {
  it("saves the brief exactly as sent and emails it to the contact address", async () => {
    const res = await post({ subjectName: "Acme", answers, selectedPackage: "Launch", selectedPrice: "$900" });

    expect(res.status).toBe(200);
    expect(createBriefSubmission).toHaveBeenCalledWith({
      briefType: "saas-ad",
      briefLabel: "SaaS ad brief",
      subjectName: "Acme",
      answers,
      selectedPackage: "Launch",
      selectedPrice: "$900",
    });
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: CONTACT_EMAIL }));
  });

  it("falls back to the legacy name key from an older cached page", async () => {
    await post({ productName: "Old Acme", answers });
    expect(createBriefSubmission).toHaveBeenCalledWith(expect.objectContaining({ subjectName: "Old Acme" }));
  });

  it("still succeeds when the email fails, because the brief is saved", async () => {
    sendMail.mockRejectedValue(new Error("gmail down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ subjectName: "Acme", answers });
    expect(res.status).toBe(200);
  });

  it("still succeeds when saving fails but the email went out", async () => {
    createBriefSubmission.mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ subjectName: "Acme", answers });
    expect(res.status).toBe(200);
  });

  it("fails only when neither the save nor the email landed", async () => {
    createBriefSubmission.mockRejectedValue(new Error("db down"));
    sendMail.mockRejectedValue(new Error("gmail down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ subjectName: "Acme", answers });
    expect(res.status).toBe(500);
  });

  it("rejects a brief with no answers", async () => {
    const res = await post({ subjectName: "Acme", answers: [] });
    expect(res.status).toBe(400);
    expect(createBriefSubmission).not.toHaveBeenCalled();
  });
});
