import { notFound } from "next/navigation";
import { getCredential } from "@/lib/actions/animate-credentials";
import CredentialForm from "@/components/Admin/Credentials/CredentialForm";
import { updateCredentialAction } from "../actions";

export default async function EditCredentialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const credential = await getCredential(id);
  if (!credential) notFound();

  const boundAction = updateCredentialAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {credential.label}
      </h1>
      <CredentialForm credential={credential} action={boundAction} />
    </div>
  );
}
