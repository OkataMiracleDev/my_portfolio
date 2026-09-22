import { NextResponse } from "next/server";
import { getPluginById, createPendingPurchase, markPurchasePaid } from "@/lib/plugins/repo";
import { validateAmount, isFreeOrder } from "@/lib/plugins/pricing";
import { initializeTransaction } from "@/lib/plugins/paystack";
import { sendReceiptForPurchase } from "@/lib/plugins/receipt";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { pluginId?: unknown; email?: unknown; amount?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { pluginId, email, amount } = body;

  if (!pluginId || typeof pluginId !== "string") {
    return NextResponse.json({ error: "pluginId is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (typeof amount !== "number") {
    return NextResponse.json({ error: "amount is required" }, { status: 400 });
  }

  const plugin = await getPluginById(pluginId);
  if (!plugin || !plugin.published) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  const validation = validateAmount(plugin, amount);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const reference = await createPendingPurchase({ pluginId: plugin.id, email, amountPaid: amount });
  const origin = new URL(request.url).origin;
  const successUrl = `${origin}/animate/resources/plugins/${plugin.slug}/success?reference=${reference}`;

  // A free order has nothing for Paystack to charge — sending it anyway is
  // what produced "Invalid Amount Sent". Fulfil it here instead, then hand
  // the buyer to the same success page a paid order lands on, which finds
  // the purchase already paid and shows the download.
  if (isFreeOrder(amount)) {
    const { purchase } = await markPurchasePaid(reference, 0);
    if (!purchase?.downloadToken) {
      return NextResponse.json({ error: "Could not prepare your download" }, { status: 500 });
    }
    await sendReceiptForPurchase(purchase);
    return NextResponse.json({ redirectUrl: successUrl });
  }

  const callbackUrl = `${origin}/animate/resources/plugins/${plugin.slug}/success`;

  try {
    const { authorizationUrl } = await initializeTransaction({
      email,
      amountKobo: amount * 100, // only place amount is converted to kobo
      reference,
      callbackUrl,
    });
    return NextResponse.json({ redirectUrl: authorizationUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
