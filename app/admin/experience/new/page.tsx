import ExperienceForm from "@/components/Admin/Experience/ExperienceForm";
import { createExperienceAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewExperiencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Experience"
        title={<>New Experience Entry</>}
        action={<BackLink href="/admin/experience">All experience</BackLink>}
      />
      <ExperienceForm action={createExperienceAction} />
    </div>
  );
}
