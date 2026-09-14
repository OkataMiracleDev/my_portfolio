import Image from "next/image";

/**
 * The Okata Studios logomark.
 *
 * This renders the real brand asset. The previous version constructed the mark
 * in SVG so it could be recoloured per placement, and positioned the badge with
 * its own angle maths -- maths that put the badge about 52 degrees away from the
 * gap it was meant to sit in, so the badge landed on the stroke instead of in
 * the opening. That is what read as "misaligned" everywhere the mark appeared.
 *
 * public/okata-logomark.png is the supplied "Okata studios logo.png" trimmed to
 * the mark's true bounds and re-padded symmetrically. The supplied file needed
 * it: its content sits 3.5px off-centre and its padding is uneven (L35/R42,
 * T72/B72), so dropping it straight into a square slot leaned it off to one
 * side.
 *
 * The light-ring variant (#C4C1BB) is the right one for this site --
 * --color-base is #0d0d10 and there is no light theme. public/okata-logo.png is
 * the same mark with a near-black ring (#17140F), for light surfaces only.
 *
 * What using the raster costs: the mark can no longer be recoloured per
 * placement, and the real ring is a hairline -- the stroke is 3.2% of the
 * radius, against the ~29% the drawn version used. Below roughly 28px it reads
 * as a faint circle with an orange dot rather than as the logo, so call sites
 * size it accordingly.
 */

/** Intrinsic size of public/okata-logomark.png. */
const ASSET_SIZE = 1043;

export interface OkataRingProps {
  className?: string;
  /**
   * Supplying a title promotes the mark to an img for assistive tech. Without
   * one it stays decorative, which is right everywhere it sits behind or
   * beside text that already says the same thing.
   */
  title?: string;
  /** For the one instance above the fold. */
  priority?: boolean;
}

export default function OkataRing({ className = "", title, priority = false }: OkataRingProps) {
  return (
    <Image
      src="/okata-logomark.png"
      alt={title ?? ""}
      width={ASSET_SIZE}
      height={ASSET_SIZE}
      priority={priority}
      aria-hidden={title ? undefined : true}
      className={className}
    />
  );
}
