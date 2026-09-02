import PluginCard from "./PluginCard";
import type { StudioPluginContent } from "@/types/content";

export default function StudioPluginsGrid({ plugins }: { plugins: StudioPluginContent[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {plugins.map((plugin) => (
        <li key={plugin.id}>
          <PluginCard plugin={plugin} />
        </li>
      ))}
    </ul>
  );
}
