import MotionProjectForm from "@/components/Admin/MotionProjects/MotionProjectForm";
import { createMotionProjectAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewMotionProjectPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Motion projects"
        title={<>New Motion Project</>}
        action={<BackLink href="/admin/projects/animate">All motion projects</BackLink>}
      />
      <MotionProjectForm action={createMotionProjectAction} />
    </div>
  );
}
