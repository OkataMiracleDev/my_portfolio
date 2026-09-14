import Image from "next/image";
import Link from "next/link";
import { FrameTicks, Meta } from "@/components/Shared/brand/Hud";

/**
 * One piece of work, framed.
 *
 * Shared by /animate's motion projects and /build's dev projects, which is why
 * it takes loose primitives rather than either route's row type -- the two come
 * from different tables with different column names and there is no shared
 * shape worth inventing for four fields.
 *
 * The hover treatment is a slow push on the image plus a corner arrow, both
 * compositor-only, and both gated behind (hover: hover) so a tap on a phone
 * does not leave the card stuck in its hovered state.
 */
export default function WorkCard({
  href,
  image,
  title,
  description,
  index,
  eyebrow,
  tags = [],
  accent,
  external = false,
}: {
  href: string;
  image: string;
  title: string;
  description: string;
  index: number;
  /** Small accent label over the image. Falls back to the first tag. */
  eyebrow?: string;
  tags?: string[];
  accent: "animate" | "build";
  /** Renders an <a target="_blank"> instead of a client-side Link. */
  external?: boolean;
}) {
  const accentText = accent === "build" ? "text-accent-build" : "text-accent-animate";
  const accentOutline =
    accent === "build" ? "focus-visible:outline-accent-build" : "focus-visible:outline-accent-animate";

  const body = (
    <article className="h-full rounded-[1.75rem] border border-ink/10 bg-frame/50 p-1.5 transition-colors duration-300 ease-out group-hover:border-ink/25">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-stage">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={75}
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

        {(eyebrow ?? tags[0]) && (
          <div className="absolute inset-x-0 bottom-0 p-5">
            <Meta className={accentText}>{eyebrow ?? tags[0]}</Meta>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-5">
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold leading-tight tracking-tight text-ink md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/45">{description}</p>
        {tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-pill border border-ink/10 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-ink/35"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );

  const className = `group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 ${accentOutline}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} data-testid="work-card" className={className}>
      {body}
    </Link>
  );
}
