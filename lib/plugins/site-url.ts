// Resolves the base URL to use for links that must point at wherever this
// app is actually running right now (plugin download links sent by email)
// — unlike SEO/canonical URLs (JSON-LD, <link rel="canonical">) elsewhere
// in this codebase, which intentionally stay hardcoded to production
// regardless of environment, since they describe the canonical identity
// of the content, not the current request.
//
// Without this, a smoke test run on localhost or a Vercel preview deploy
// (per the plan's own pre-launch testing step) would email a download
// link pointing at production instead of the environment that actually
// processed the payment.
//
// Priority: an explicit SITE_URL override, then Vercel's auto-populated
// deployment URL (covers preview deployments), then localhost for local
// dev, then production as the final fallback.
export function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://www.okata-miracle.site";
}
