import type { Metadata } from "next";
import Link from "next/link";
import { getStudioPluginBySlug } from "@/lib/data/public";
import { verifyTransaction } from "@/lib/plugins/paystack";
import { markPurchasePaid, getPurchaseByReference } from "@/lib/plugins/repo";
import { sendReceiptForPurchase } from "@/lib/plugins/receipt";

export const dynamic = "force-dynamic";

// Per-order receipt pages (?reference=...) — every one is unique and
// private, so none of them belong in an index.
export const metadata: Metadata = {
  title: "Order status | Okata Studios",
  robots: { index: false, follow: false },
};

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

  const existing = await getPurchaseByReference(reference);

  // Settled already? Then there is nothing to ask Paystack about. This is
  // the only path a free (₦0) order ever takes -- it was fulfilled at init
  // and Paystack has never heard of the reference, so verifying it would
  // fail and tell the buyer their payment didn't go through. It also saves
  // a redundant round trip when the webhook won the race on a paid order.
  if (existing?.status === "paid" && existing.downloadToken) {
    downloadToken = existing.downloadToken;
  } else if (!existing) {
    failed = true;
  } else {
    try {
      const verified = await verifyTransaction(reference);
      if (verified.status === "success") {
        const { purchase, justPaid } = await markPurchasePaid(reference, Math.round(verified.amountKobo / 100));
        if (purchase?.downloadToken) {
          downloadToken = purchase.downloadToken;
          if (justPaid) await sendReceiptForPurchase(purchase);
        }
      } else {
        failed = true;
      }
    } catch (err) {
      console.error("Plugin success page verification failed:", err);
      failed = true;
    }
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
