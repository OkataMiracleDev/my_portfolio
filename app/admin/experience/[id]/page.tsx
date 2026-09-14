import { notFound } from "next/navigation";
import { getExperienceEntry } from "@/lib/actions/experience";
import ExperienceForm from "@/components/Admin/Experience/ExperienceForm";
import { updateExperienceAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getExperienceEntry(id);
  if (!entry) notFound();

  const boundAction = updateExperienceAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Experience"
        title={<>Edit {entry.role}</>}
        action={<BackLink href="/admin/experience">All experience</BackLink>}
      />
      <ExperienceForm entry={entry} action={boundAction} />
    </div>
  );
}
