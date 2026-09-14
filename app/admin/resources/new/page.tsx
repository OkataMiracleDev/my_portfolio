import ResourceForm from "@/components/Admin/Resources/ResourceForm";
import { createResourceAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewResourcePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Resources"
        title={<>New Resource</>}
        action={<BackLink href="/admin/resources">All resources</BackLink>}
      />
      <ResourceForm action={createResourceAction} />
    </div>
  );
}
