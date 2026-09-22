import type { pluginPurchases } from "@/lib/db/schema";
import { getPluginById } from "./repo";
import { sendPluginReceiptEmail } from "./email";
import { getSiteUrl } from "./site-url";

type Purchase = typeof pluginPurchases.$inferSelect;

/**
 * Emails the receipt and download link for a purchase that has just been
 * marked paid.
 *
 * There are now three ways a purchase reaches that state -- the Paystack
 * webhook, the success-page callback, and a free (₦0) order fulfilled
 * directly at init -- and each was building the same email with its own
 * copy of the plugin lookup, URL assembly and swallow-the-error block. One
 * copy here keeps the free path from drifting away from the paid ones.
 *
 * Never throws: the money (if any) has already changed hands and the
 * download token is already issued, so a mail failure must not turn a
 * completed purchase into an error. The buyer still gets the link on the
 * success page, and can re-request it from /redownload.
 */
export async function sendReceiptForPurchase(purchase: Purchase): Promise<void> {
  if (!purchase.downloadToken) return;

  try {
    const plugin = await getPluginById(purchase.pluginId);
    if (!plugin) return;

    await sendPluginReceiptEmail({
      toEmail: purchase.email,
      pluginTitle: plugin.title,
      amountPaid: purchase.amountPaid,
      downloadUrl: `${getSiteUrl()}/api/plugins/download/${purchase.downloadToken}`,
    });
  } catch (error) {
    console.error("Plugin receipt email failed (purchase was still marked paid):", error);
  }
}
