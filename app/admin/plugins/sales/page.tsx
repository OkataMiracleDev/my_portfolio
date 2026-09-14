import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pluginPurchases, studioPlugins } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { PageHeader, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function PluginSalesPage() {
  await requireSession();

  const rows = await db
    .select({
      reference: pluginPurchases.reference,
      pluginTitle: studioPlugins.title,
      email: pluginPurchases.email,
      amountPaid: pluginPurchases.amountPaid,
      status: pluginPurchases.status,
      createdAt: pluginPurchases.createdAt,
    })
    .from(pluginPurchases)
    .leftJoin(studioPlugins, eq(pluginPurchases.pluginId, studioPlugins.id))
    .orderBy(desc(pluginPurchases.createdAt));

  return (
    <div>
      <PageHeader
        eyebrow="Store"
        title="Plugin sales"
        description="Every purchase that has reached Paystack, newest first."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No sales yet"
          description="Purchases appear here the moment Paystack confirms them."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-frame">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-ink/50">
              <tr>
                <th className="px-6 py-3 font-medium">Plugin</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((row) => (
                <tr key={row.reference}>
                  <td className="px-6 py-3 text-ink">{row.pluginTitle ?? "(deleted plugin)"}</td>
                  <td className="px-6 py-3 text-ink/70">{row.email}</td>
                  <td className="px-6 py-3 text-ink/70">₦{row.amountPaid.toLocaleString()}</td>
                  <td className="px-6 py-3 text-ink/70">{row.status}</td>
                  <td className="px-6 py-3 text-ink/70">{row.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
