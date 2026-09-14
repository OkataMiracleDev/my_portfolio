import { notFound } from "next/navigation";
import { getResource } from "@/lib/actions/resources";
import ResourceForm from "@/components/Admin/Resources/ResourceForm";
import { updateResourceAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  const boundAction = updateResourceAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Resources"
        title={<>Edit {resource.title}</>}
        action={<BackLink href="/admin/resources">All resources</BackLink>}
      />
      <ResourceForm resource={resource} action={boundAction} />
    </div>
  );
}
