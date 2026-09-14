import { notFound } from "next/navigation";
import { getMotionProject } from "@/lib/actions/motion-projects";
import MotionProjectForm from "@/components/Admin/MotionProjects/MotionProjectForm";
import { updateMotionProjectAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditMotionProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMotionProject(id);
  if (!project) notFound();

  const boundAction = updateMotionProjectAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Motion projects"
        title={<>Edit {project.title}</>}
        action={<BackLink href="/admin/projects/animate">All motion projects</BackLink>}
      />
      <MotionProjectForm project={project} action={boundAction} />
    </div>
  );
}
