import { NextResponse } from "next/server";
import { getPluginById, createPendingPurchase } from "@/lib/plugins/repo";
import { validateAmount } from "@/lib/plugins/pricing";
import { initializeTransaction } from "@/lib/plugins/paystack";

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
  const callbackUrl = `${origin}/animate/resources/plugins/${plugin.slug}/success`;

  try {
    const { authorizationUrl } = await initializeTransaction({
      email,
      amountKobo: amount * 100, // only place amount is converted to kobo
      reference,
      callbackUrl,
    });
    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
