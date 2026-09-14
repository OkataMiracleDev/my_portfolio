import { notFound } from "next/navigation";
import { getDevProject } from "@/lib/actions/dev-projects";
import DevProjectForm from "@/components/Admin/DevProjects/DevProjectForm";
import { updateDevProjectAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditDevProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getDevProject(id);
  if (!project) notFound();

  const boundAction = updateDevProjectAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Dev projects"
        title={<>Edit {project.name}</>}
        action={<BackLink href="/admin/projects/dev">All dev projects</BackLink>}
      />
      <DevProjectForm project={project} action={boundAction} />
    </div>
  );
}
