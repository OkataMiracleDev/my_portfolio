import RetainerForm from "@/components/Admin/Retainers/RetainerForm";
import { createRetainerAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewRetainerPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Retainers"
        title="New retainer"
        action={<BackLink href="/admin/retainers">All retainers</BackLink>}
      />
      <RetainerForm action={createRetainerAction} />
    </div>
  );
}
