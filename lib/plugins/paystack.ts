import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializeTransaction(
  input: InitializeTransactionInput
): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Paystack initialize failed");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export interface VerifyTransactionResult {
  status: string; // "success" | "failed" | "abandoned" | ...
  reference: string;
  amountKobo: number;
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Paystack verify failed");
  }

  return {
    status: data.data.status,
    reference: data.data.reference,
    amountKobo: data.data.amount,
  };
}

// Paystack signs each webhook payload with HMAC-SHA512 over the raw
// request body, keyed with the secret key, sent as the
// `x-paystack-signature` header. Comparison is timing-safe.
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  let expectedBuffer: Buffer;
  let givenBuffer: Buffer;
  try {
    expectedBuffer = Buffer.from(expected, "hex");
    givenBuffer = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  if (expectedBuffer.length !== givenBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, givenBuffer);
}
