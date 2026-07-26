import { notFound } from "next/navigation";
import { getExperienceEntry } from "@/lib/actions/experience";
import ExperienceForm from "@/components/Admin/Experience/ExperienceForm";
import { updateExperienceAction } from "../actions";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getExperienceEntry(id);
  if (!entry) notFound();

  const boundAction = updateExperienceAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {entry.role}
      </h1>
      <ExperienceForm entry={entry} action={boundAction} />
    </div>
  );
}
