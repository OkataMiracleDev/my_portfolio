import Image from "next/image";
import Link from "next/link";
import { FrameTicks, Meta } from "./brand/Hud";
import type { MotionProjectContent } from "@/types/content";

/**
 * A project as a film frame rather than a content card.
 *
 * The hover treatment is a clip-path wipe on the caption bar plus a slow push
 * on the image -- both compositor-only -- and the whole thing is gated behind
 * (hover: hover) so a tap on a phone does not leave the card stuck in its
 * hovered state, which is what happens when you attach this to :hover alone.
 */
export default function MotionProjectCard({
  project,
  index,
}: {
  project: MotionProjectContent;
  index: number;
}) {
  return (
    <Link
      href={project.href}
      data-testid="motion-project-card"
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-animate"
    >
      <article className="rounded-[1.75rem] border border-ink/10 bg-frame/50 p-1.5 transition-colors duration-300 ease-out group-hover:border-ink/25">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-stage">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={85}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stage/85 via-transparent to-stage/25" />
          <FrameTicks className="m-3.5" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <Meta className="text-ink/45">{String(index + 1).padStart(2, "0")}</Meta>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-ink/10 text-ink opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:opacity-100 [@media(hover:hover)and(pointer:fine)]:-translate-y-1.5 [@media(hover:hover)and(pointer:fine)]:group-hover:translate-y-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <Meta className="text-accent-animate">
              {project.tags[0] ?? "Motion"}
            </Meta>
          </div>
        </div>

        <div className="px-4 pb-4 pt-5">
          <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold leading-tight tracking-tight text-ink md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/45">
            {project.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tools.slice(0, 3).map((tool) => (
              <li
                key={tool}
                className="rounded-pill border border-ink/10 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-ink/35"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Link>
  );
}
