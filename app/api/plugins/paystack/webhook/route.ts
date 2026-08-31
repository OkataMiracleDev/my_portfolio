import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/plugins/paystack";
import { markPurchasePaid, markPurchaseCancelled, getPurchaseByReference, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";

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
    if (purchase && justPaid && purchase.downloadToken) {
      const plugin = await getPluginById(purchase.pluginId);
      if (plugin) {
        const origin = new URL(request.url).origin;
        try {
          await sendPluginReceiptEmail({
            toEmail: purchase.email,
            pluginTitle: plugin.title,
            amountPaid: purchase.amountPaid,
            downloadUrl: `${origin}/api/plugins/download/${purchase.downloadToken}`,
          });
        } catch (emailError) {
          console.error("Plugin receipt email failed (purchase was still marked paid):", emailError);
        }
      }
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
