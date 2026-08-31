import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { createPluginAction } from "../actions";

export default function NewPluginPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">New Plugin</h1>
      <PluginForm action={createPluginAction} />
    </div>
  );
}
