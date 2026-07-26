import { notFound } from "next/navigation";
import { getDevProject } from "@/lib/actions/dev-projects";
import DevProjectForm from "@/components/Admin/DevProjects/DevProjectForm";
import { updateDevProjectAction } from "../actions";

export default async function EditDevProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getDevProject(id);
  if (!project) notFound();

  const boundAction = updateDevProjectAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {project.name}
      </h1>
      <DevProjectForm project={project} action={boundAction} />
    </div>
  );
}
