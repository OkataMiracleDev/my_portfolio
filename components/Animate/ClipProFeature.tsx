import Image from "next/image";
import Link from "next/link";
import { FrameTicks, Meta } from "@/components/Shared/brand/Hud";
import { releaseLine } from "@/components/Shared/ClipPro/ClipProButtons";
import DownloadMenu from "@/components/Shared/ClipPro/DownloadMenu";
import { CLIPPRO, formatReleaseDate, type ClipProRelease } from "@/lib/clippro";

/**
 * ClipPro among the free resources: the plugin cards' language (image-forward, a scrim the text
 * sits on, the round accent well) stretched to a wide card, because this one is a whole app
 * rather than a preset, and it should read as the headline item of the shelf.
 *
 * Written for editors and shooters, not developers: what it does to a card of footage, not what
 * it is built with. The /build page carries the technical pitch.
 */
export default function ClipProFeature({ releases, unavailable = false }: { releases: ClipProRelease[]; unavailable?: boolean }) {
  const release = releases[0] ?? null;
  return (
    <article className="relative grid overflow-hidden rounded-card border border-ink/10 bg-base-raised md:grid-cols-12">
      <div className="relative aspect-[16/10] md:col-span-7 md:aspect-auto md:min-h-[22rem]">
        <Image
          src={CLIPPRO.shots[0].src}
          alt={CLIPPRO.shots[0].alt}
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          quality={75}
          className="object-cover object-center"
        />
        {/* Fades the screen into the card: downwards on phones, rightwards beside the text. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-base-raised via-base-raised/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:via-55% md:to-base-raised"
        />
        <FrameTicks className="m-4" />
      </div>

      <div className="relative flex flex-col justify-center gap-5 p-7 md:col-span-5 md:p-10">
        <Meta className="text-accent-animate">Free software · Windows</Meta>
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] tracking-tight text-ink md:text-4xl">
          ClipPro<span className="text-signal">.</span>
        </h3>
        <p className="leading-relaxed text-ink/65">
          Drop in a card of footage. ClipPro throws out the soft, shaky, dark and silent takes and hands Premiere,
          Resolve, Final Cut or Avid a timeline of the keepers, with markers.
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {["Focus", "Exposure", "Motion", "Sound", "Faces", "Transcripts"].map((t) => (
            <li
              key={t}
              className="rounded-pill border border-ink/10 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-ink/45"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-3">
          <DownloadMenu releases={releases} accent="animate" />
          <Link
            href={CLIPPRO.pagePath}
            className="text-sm font-medium text-ink/60 transition-colors duration-200 ease-out hover:text-ink"
          >
            Screens and notes
          </Link>
        </div>
        <Meta className="text-ink/30">{releaseLine(release, formatReleaseDate, unavailable)}</Meta>
      </div>
    </article>
  );
}
