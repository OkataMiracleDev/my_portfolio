import { notFound } from "next/navigation";
import { getCredential } from "@/lib/actions/animate-credentials";
import CredentialForm from "@/components/Admin/Credentials/CredentialForm";
import { updateCredentialAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditCredentialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const credential = await getCredential(id);
  if (!credential) notFound();

  const boundAction = updateCredentialAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Bragging rights"
        title={<>Edit {credential.label}</>}
        action={<BackLink href="/admin/credentials">All bragging rights</BackLink>}
      />
      <CredentialForm credential={credential} action={boundAction} />
    </div>
  );
}
