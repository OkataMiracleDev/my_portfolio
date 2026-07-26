import ResourceForm from "@/components/Admin/Resources/ResourceForm";
import { createResourceAction } from "../actions";

export default function NewResourcePage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Resource
      </h1>
      <ResourceForm action={createResourceAction} />
    </div>
  );
}
