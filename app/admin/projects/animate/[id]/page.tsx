import { notFound } from "next/navigation";
import { getMotionProject } from "@/lib/actions/motion-projects";
import MotionProjectForm from "@/components/Admin/MotionProjects/MotionProjectForm";
import { updateMotionProjectAction } from "../actions";

export default async function EditMotionProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMotionProject(id);
  if (!project) notFound();

  const boundAction = updateMotionProjectAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {project.title}
      </h1>
      <MotionProjectForm project={project} action={boundAction} />
    </div>
  );
}
