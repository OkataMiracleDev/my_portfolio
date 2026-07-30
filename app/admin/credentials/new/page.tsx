import CredentialForm from "@/components/Admin/Credentials/CredentialForm";
import { createCredentialAction } from "../actions";

export default function NewCredentialPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Credential
      </h1>
      <CredentialForm action={createCredentialAction} />
    </div>
  );
}
