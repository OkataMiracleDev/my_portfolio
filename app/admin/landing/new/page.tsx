import FunFactForm from "@/components/Admin/FunFacts/FunFactForm";
import { createFunFactAction } from "../actions";

export default function NewFunFactPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Fun Fact
      </h1>
      <FunFactForm action={createFunFactAction} />
    </div>
  );
}
