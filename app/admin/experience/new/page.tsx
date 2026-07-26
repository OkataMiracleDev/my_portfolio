import ExperienceForm from "@/components/Admin/Experience/ExperienceForm";
import { createExperienceAction } from "../actions";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Experience Entry
      </h1>
      <ExperienceForm action={createExperienceAction} />
    </div>
  );
}
