import DevProjectForm from "@/components/Admin/DevProjects/DevProjectForm";
import { createDevProjectAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewDevProjectPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Dev projects"
        title={<>New Dev Project</>}
        action={<BackLink href="/admin/projects/dev">All dev projects</BackLink>}
      />
      <DevProjectForm action={createDevProjectAction} />
    </div>
  );
}
