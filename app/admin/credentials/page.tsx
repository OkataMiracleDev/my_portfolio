import Link from "next/link";
import { listCredentials } from "@/lib/actions/animate-credentials";
import CredentialsList from "@/components/Admin/Credentials/CredentialsList";

export const dynamic = "force-dynamic";

export default async function CredentialsAdminPage() {
  const items = await listCredentials();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Bragging Rights
        </h1>
        <Link
          href="/admin/credentials/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-ink/50">No credentials yet.</p>
      ) : (
        <CredentialsList initialItems={items} />
      )}
    </div>
  );
}
