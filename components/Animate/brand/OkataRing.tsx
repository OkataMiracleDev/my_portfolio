/**
 * The Okata Studios logomark, drawn rather than imported.
 *
 * public/okata-logo.png is the same mark as a raster, but the mark is used
 * here at everything from 20px (nav) to 90vw (hero backdrop), recoloured per
 * placement, and in one case rotated for the whole length of the page. A PNG
 * can do none of that, so the geometry lives here instead.
 *
 * Construction: one stroked circle with a dash pattern long enough to leave a
 * single gap, rotated so that gap sits at roughly four o'clock, with the badge
 * parked in the opening. That matches the brand sheet
 * (public/okata-brand-language.png) rather than approximating it.
 */

/** The badge glyph, as escapes so this file stays pure ASCII on disk. */
const BADGE_GLYPH = "\u304a\u65b9";

const VIEW = 100;
const CENTER = VIEW / 2;
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Share of the circle left open for the badge. */
const GAP_FRACTION = 0.145;
/**
 * SVG circles start their dash at three o'clock and run clockwise, which would
 * put the opening in the upper right. Rotating the whole mark drops it to the
 * lower right, where the brand sheet has it.
 */
const GAP_ROTATION = 72;
/** Centre of the opening, measured clockwise from three o'clock. */
const BADGE_ANGLE = GAP_ROTATION + (GAP_FRACTION * 360) / 2;
const BADGE_X = CENTER + RADIUS * Math.cos((BADGE_ANGLE * Math.PI) / 180);
const BADGE_Y = CENTER + RADIUS * Math.sin((BADGE_ANGLE * Math.PI) / 180);

export interface OkataRingProps {
  className?: string;
  /** Ring stroke colour. Defaults to the current text colour. */
  ringColor?: string;
  /** Badge fill. Defaults to the animate accent. */
  badgeColor?: string;
  /** Colour of the glyph inside the badge. */
  badgeInk?: string;
  /**
   * The badge glyph is unreadable much below ~64px, where it degrades into a
   * smudge. Leave it off at small sizes and the badge reads as a clean dot.
   */
  showGlyph?: boolean;
  strokeWidth?: number;
  /**
   * Supplying a title promotes the mark to an img for assistive tech. Without
   * one it stays decorative, which is right everywhere it sits behind or
   * beside text that already says the same thing.
   */
  title?: string;
}

export default function OkataRing({
  className = "",
  ringColor = "currentColor",
  badgeColor = "var(--color-accent-animate)",
  badgeInk = "var(--color-base)",
  showGlyph = false,
  strokeWidth = 11,
  title,
}: OkataRingProps) {
  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${CIRCUMFERENCE * (1 - GAP_FRACTION)} ${CIRCUMFERENCE}`}
        transform={`rotate(${GAP_ROTATION} ${CENTER} ${CENTER})`}
      />
      <circle cx={BADGE_X} cy={BADGE_Y} r={9.6} fill={badgeColor} />
      {showGlyph && (
        <text
          x={BADGE_X}
          y={BADGE_Y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={badgeInk}
          fontSize={6.4}
          fontWeight={600}
          style={{ fontFamily: "var(--font-general-sans), sans-serif" }}
        >
          {BADGE_GLYPH}
        </text>
      )}
    </svg>
  );
}
