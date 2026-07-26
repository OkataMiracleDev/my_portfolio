import DevProjectForm from "@/components/Admin/DevProjects/DevProjectForm";
import { createDevProjectAction } from "../actions";

export default function NewDevProjectPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Dev Project
      </h1>
      <DevProjectForm action={createDevProjectAction} />
    </div>
  );
}
