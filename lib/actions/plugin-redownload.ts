"use server";

import { getPaidPurchasesByEmail, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";
import { getSiteUrl } from "@/lib/plugins/site-url";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Deliberately returns nothing and behaves identically whether or not a
// match is found — the caller (the redownload page) always shows the
// same generic message, so this can't be used to enumerate other buyers'
// purchase history by guessing emails.
export async function requestRedownload(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) return;

  const purchases = await getPaidPurchasesByEmail(email);
  for (const purchase of purchases) {
    if (!purchase.downloadToken) continue;
    try {
      const plugin = await getPluginById(purchase.pluginId);
      if (!plugin) continue;
      await sendPluginReceiptEmail({
        toEmail: email,
        pluginTitle: plugin.title,
        amountPaid: purchase.amountPaid,
        downloadUrl: `${getSiteUrl()}/api/plugins/download/${purchase.downloadToken}`,
      });
    } catch (err) {
      console.error("Plugin redownload email failed for one purchase (continuing):", err);
    }
  }
}
