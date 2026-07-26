import MotionProjectForm from "@/components/Admin/MotionProjects/MotionProjectForm";
import { createMotionProjectAction } from "../actions";

export default function NewMotionProjectPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Motion Project
      </h1>
      <MotionProjectForm action={createMotionProjectAction} />
    </div>
  );
}
