import Link from "next/link";
import Image from "next/image";
import type { StudioPluginContent } from "@/types/content";

// Image-forward plugin card: full-bleed 1:1 thumbnail, bottom-left text
// stack over a gradient scrim, circular "open" affordance bottom-right.
// Deliberately no like/favorite icon — this isn't a saveable-listing UI.
export default function PluginCard({ plugin }: { plugin: StudioPluginContent }) {
  const kicker = plugin.tags[0];
  const priceLabel = plugin.pwywEnabled ? "Pay what you want" : `₦${plugin.priceAmount.toLocaleString()}`;

  return (
    <Link
      href={`/animate/resources/plugins/${plugin.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-card bg-base-raised transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <Image
        src={plugin.thumbnailUrl}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 90vw"
        quality={90}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-base from-15% via-base/35 via-45% to-transparent to-80%"
      />

      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && (
            <p className="mb-1 truncate font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.14em] text-ink/60">
              {kicker}
            </p>
          )}
          <p className="truncate font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
            {plugin.title}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink/75">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M8.5 2H4a2 2 0 0 0-2 2v4.5a1 1 0 0 0 .29.71l6.5 6.5a1 1 0 0 0 1.42 0l4.5-4.5a1 1 0 0 0 0-1.42l-6.5-6.5A1 1 0 0 0 8.5 2Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="6" r="1" fill="currentColor" />
            </svg>
            {priceLabel}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-base transition-colors duration-200 ease-out group-hover:bg-accent-animate group-hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
            <path
              d="M3.5 8h9M8.5 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
