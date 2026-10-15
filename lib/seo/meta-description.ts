/**
 * Fits free-text copy into a meta description.
 *
 * Case-study and post descriptions are written for the page, not for
 * search results — the Kuda case study's runs to 680 characters. Google
 * cuts snippets off around 155–160 characters, mid-word, so this trims at
 * the last word boundary under the limit and marks the cut.
 */
export function metaDescription(text: string | null | undefined, max = 155): string | undefined {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—–-]+$/, "");
  return `${trimmed}…`;
}
