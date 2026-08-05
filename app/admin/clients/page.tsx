import Link from "next/link";
import { listClients } from "@/lib/actions/clients";
import ClientsList from "@/components/Admin/Clients/ClientsList";

export const dynamic = "force-dynamic";

export default async function ClientsAdminPage() {
  const items = await listClients();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Clients
        </h1>
        <Link
          href="/admin/clients/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      <ClientsList initialItems={items} />
    </div>
  );
}
