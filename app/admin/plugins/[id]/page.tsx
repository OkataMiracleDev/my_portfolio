import { notFound } from "next/navigation";
import { getPlugin } from "@/lib/actions/plugins";
import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { updatePluginAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditPluginPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plugin = await getPlugin(id);
  if (!plugin) notFound();

  const boundAction = updatePluginAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Plugins"
        title={<>Edit {plugin.title}</>}
        action={<BackLink href="/admin/plugins">All plugins</BackLink>}
      />
      <PluginForm plugin={plugin} action={boundAction} />
    </div>
  );
}
