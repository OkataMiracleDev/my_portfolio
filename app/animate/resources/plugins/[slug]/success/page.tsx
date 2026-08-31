import type { Metadata } from "next";
import Link from "next/link";
import { getStudioPluginBySlug } from "@/lib/data/public";
import { verifyTransaction } from "@/lib/plugins/paystack";
import { markPurchasePaid, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order status | Mimi Studios" };

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reference?: string }>;
};

export default async function PluginSuccessPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { reference } = await searchParams;
  const plugin = await getStudioPluginBySlug(slug);

  if (!plugin) return <StatusShell title="Plugin not found" slug={slug} />;
  if (!reference) return <StatusShell title="Missing payment reference" slug={slug} />;

  let downloadToken: string | null = null;
  let failed = false;

  try {
    const verified = await verifyTransaction(reference);
    if (verified.status === "success") {
      const { purchase, justPaid } = await markPurchasePaid(reference, Math.round(verified.amountKobo / 100));
      if (purchase?.downloadToken) {
        downloadToken = purchase.downloadToken;
        if (justPaid) {
          const fullPlugin = await getPluginById(purchase.pluginId);
          if (fullPlugin) {
            try {
              await sendPluginReceiptEmail({
                toEmail: purchase.email,
                pluginTitle: fullPlugin.title,
                amountPaid: purchase.amountPaid,
                downloadUrl: `https://www.okata-miracle.site/api/plugins/download/${purchase.downloadToken}`,
              });
            } catch (emailError) {
              console.error("Plugin receipt email failed (purchase was still marked paid):", emailError);
            }
          }
        }
      }
    } else {
      failed = true;
    }
  } catch (err) {
    console.error("Plugin success page verification failed:", err);
    failed = true;
  }

  if (failed || !downloadToken) {
    return <StatusShell title="Payment didn't go through" slug={slug} />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-32 text-center">
      <div className="max-w-lg mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">
          Thanks — you&apos;re all set
        </h1>
        <p className="mb-8 text-ink/70">
          A receipt with your download link is on its way to your inbox. You can also grab it right now:
        </p>
        <a
          href={`/api/plugins/download/${downloadToken}`}
          className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Download {plugin.title}
        </a>
      </div>
    </div>
  );
}

function StatusShell({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32 text-center">
      <div className="max-w-lg mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">{title}</h1>
        <Link
          href={`/animate/resources/plugins/${slug}`}
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          ← Back to plugin
        </Link>
      </div>
    </div>
  );
}
