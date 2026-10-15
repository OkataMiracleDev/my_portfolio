/**
 * The site's public identity — one place, so a rebrand is a one-line change.
 *
 * Before this existed the domain was hardcoded in ~40 places (canonicals,
 * Open Graph, JSON-LD, the sitemap, robots.txt, email footers) and the
 * contact address in ~10 (every form route's `to:` plus the portal mailto).
 * Moving to okata.space meant finding all of them by hand.
 *
 * SITE_URL is the canonical origin: `www.okata.space`, because that is the
 * host Vercel serves — the apex `okata.space` 308s to it. Canonical tags,
 * the sitemap and structured data must all name the host that actually
 * answers with a 200, or search engines treat them as pointing at a redirect.
 *
 * Static files under public/ (the brief pages) can't import this and repeat
 * the address literally.
 */
export const SITE_URL = "https://www.okata.space";

export const CONTACT_EMAIL = "miracle@okata.space";

/**
 * Where the studio is. Feeds structured data, so it must match what the
 * site says in visible copy — search engines cross-check the two, and a
 * mismatch reads as an unreliable listing.
 */
export const STUDIO_LOCATION = {
  locality: "Port Harcourt",
  region: "Rivers",
  country: "Nigeria",
  countryCode: "NG",
} as const;

/**
 * Public profiles that are unambiguously this person/studio. Emitted as
 * schema.org `sameAs`, which is how search engines (and AI assistants)
 * connect the site to the rest of your presence and decide you are one
 * entity rather than several people with similar names.
 *
 * Motion-specific profiles — Behance, Dribbble, Instagram, LinkedIn,
 * YouTube, Vimeo — carry the most weight for motion-design searches. Add
 * them here and they appear in every page's structured data.
 */
export const SAME_AS: string[] = [
  "https://x.com/mimi_codes",
  "https://github.com/OkataMiracleDev",
];

/** Builds an absolute canonical URL for a site path. */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
