import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "../paystack";

describe("verifyWebhookSignature", () => {
  const secret = "test_secret_key";

  beforeEach(() => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", secret);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function sign(body: string) {
    return crypto.createHmac("sha512", secret).update(body).digest("hex");
  }

  it("accepts a correctly signed body", () => {
    const body = JSON.stringify({ event: "charge.success" });
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const tampered = JSON.stringify({ event: "charge.failed" });
    expect(verifyWebhookSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a missing signature", () => {
    const body = JSON.stringify({ event: "charge.success" });
    expect(verifyWebhookSignature(body, null)).toBe(false);
  });

  it("rejects a signature produced with the wrong secret", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const wrongSignature = crypto.createHmac("sha512", "wrong_secret").update(body).digest("hex");
    expect(verifyWebhookSignature(body, wrongSignature)).toBe(false);
  });

  it("rejects when PAYSTACK_SECRET_KEY is unset", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    const body = JSON.stringify({ event: "charge.success" });
    expect(verifyWebhookSignature(body, "anything")).toBe(false);
  });
});
