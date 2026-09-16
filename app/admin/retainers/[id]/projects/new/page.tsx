import { notFound } from "next/navigation";
import { getRetainer } from "@/lib/actions/retainers";
import { createRetainerProjectAction } from "../../../actions";
import RetainerProjectForm from "@/components/Admin/Retainers/RetainerProjectForm";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function NewRetainerProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const retainer = await getRetainer(id);
  if (!retainer) notFound();

  return (
    <div>
      <PageHeader
        eyebrow={retainer.name}
        title="New project"
        action={<BackLink href={`/admin/retainers/${id}`}>Back to {retainer.name}</BackLink>}
      />
      <RetainerProjectForm retainerClientId={id} action={createRetainerProjectAction} />
    </div>
  );
}
