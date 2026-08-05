import ClientForm from "@/components/Admin/Clients/ClientForm";
import { createClientAction } from "../actions";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Client
      </h1>
      <ClientForm action={createClientAction} />
    </div>
  );
}
