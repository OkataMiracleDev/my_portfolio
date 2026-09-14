import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { createPluginAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewPluginPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Plugins"
        title="New plugin"
        action={<BackLink href="/admin/plugins">All plugins</BackLink>}
      />
      <PluginForm action={createPluginAction} />
    </div>
  );
}
