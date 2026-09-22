import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/plugins/paystack";
import { markPurchasePaid, markPurchaseCancelled, getPurchaseByReference } from "@/lib/plugins/repo";
import { sendReceiptForPurchase } from "@/lib/plugins/receipt";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("Plugin webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data?: { reference?: string; amount?: number } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data) {
    const reference = event.data.reference as string;
    const amountPaid = Math.round((event.data.amount as number) / 100);

    const { purchase, justPaid } = await markPurchasePaid(reference, amountPaid);
    if (purchase && justPaid) {
      await sendReceiptForPurchase(purchase);
    }
  }

  if ((event.event === "charge.failed" || event.event === "charge.abandoned") && event.data) {
    const reference = event.data.reference as string;
    const existing = await getPurchaseByReference(reference);
    if (existing && existing.status === "pending") {
      await markPurchaseCancelled(reference);
    }
  }

  return NextResponse.json({ received: true });
}
