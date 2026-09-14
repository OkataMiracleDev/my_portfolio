import CredentialForm from "@/components/Admin/Credentials/CredentialForm";
import { createCredentialAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewCredentialPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Bragging rights"
        title={<>New Credential</>}
        action={<BackLink href="/admin/credentials">All bragging rights</BackLink>}
      />
      <CredentialForm action={createCredentialAction} />
    </div>
  );
}
