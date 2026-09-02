import Link from "next/link";
import Image from "next/image";
import type { StudioPluginContent } from "@/types/content";

export default function StudioPluginsGrid({ plugins }: { plugins: StudioPluginContent[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {plugins.map((plugin) => (
        <li key={plugin.id}>
          <Link
            href={`/animate/resources/plugins/${plugin.slug}`}
            className="block h-full overflow-hidden rounded-card bg-base-raised transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <div className="relative aspect-square">
              <Image src={plugin.thumbnailUrl} alt={plugin.title} fill quality={90} className="object-cover" />
            </div>
            <div className="p-6">
              <p className="font-semibold text-ink">{plugin.title}</p>
              <p className="mt-2 text-sm text-ink/70">{plugin.description}</p>
              <p className="mt-3 text-sm font-medium text-accent-animate">
                {plugin.pwywEnabled ? "Pay what you want" : `₦${plugin.priceAmount.toLocaleString()}`}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
