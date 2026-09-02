import { NextResponse } from "next/server";
import { getPurchaseByToken, getPluginFileUrl } from "@/lib/plugins/repo";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const purchase = await getPurchaseByToken(token);

  if (!purchase) {
    return NextResponse.json({ error: "Download link not found" }, { status: 404 });
  }
  if (purchase.status !== "paid") {
    return NextResponse.json({ error: "This purchase hasn't been completed" }, { status: 403 });
  }

  const fileUrl = await getPluginFileUrl(purchase.pluginId);
  if (!fileUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.redirect(fileUrl, 307);
}
