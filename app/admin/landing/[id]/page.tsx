import { notFound } from "next/navigation";
import { getFunFact } from "@/lib/actions/fun-facts";
import FunFactForm from "@/components/Admin/FunFacts/FunFactForm";
import { updateFunFactAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditFunFactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fact = await getFunFact(id);
  if (!fact) notFound();

  const boundAction = updateFunFactAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Fun facts"
        title={<>Edit {fact.label}</>}
        action={<BackLink href="/admin/landing">All fun facts</BackLink>}
      />
      <FunFactForm fact={fact} action={boundAction} />
    </div>
  );
}
