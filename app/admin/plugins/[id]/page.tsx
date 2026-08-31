import { notFound } from "next/navigation";
import { getPlugin } from "@/lib/actions/plugins";
import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { updatePluginAction } from "../actions";

export default async function EditPluginPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plugin = await getPlugin(id);
  if (!plugin) notFound();

  const boundAction = updatePluginAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">Edit {plugin.title}</h1>
      <PluginForm plugin={plugin} action={boundAction} />
    </div>
  );
}
