import FunFactForm from "@/components/Admin/FunFacts/FunFactForm";
import { createFunFactAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewFunFactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Fun facts"
        title={<>New Fun Fact</>}
        action={<BackLink href="/admin/landing">All fun facts</BackLink>}
      />
      <FunFactForm action={createFunFactAction} />
    </div>
  );
}
