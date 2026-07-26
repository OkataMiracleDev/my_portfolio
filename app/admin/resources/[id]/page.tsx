import { notFound } from "next/navigation";
import { getResource } from "@/lib/actions/resources";
import ResourceForm from "@/components/Admin/Resources/ResourceForm";
import { updateResourceAction } from "../actions";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  const boundAction = updateResourceAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {resource.title}
      </h1>
      <ResourceForm resource={resource} action={boundAction} />
    </div>
  );
}
