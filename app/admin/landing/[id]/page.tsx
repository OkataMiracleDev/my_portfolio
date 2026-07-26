import { notFound } from "next/navigation";
import { getFunFact } from "@/lib/actions/fun-facts";
import FunFactForm from "@/components/Admin/FunFacts/FunFactForm";
import { updateFunFactAction } from "../actions";

export default async function EditFunFactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fact = await getFunFact(id);
  if (!fact) notFound();

  const boundAction = updateFunFactAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {fact.label}
      </h1>
      <FunFactForm fact={fact} action={boundAction} />
    </div>
  );
}
