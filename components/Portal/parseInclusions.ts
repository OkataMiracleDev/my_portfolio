// Rate-card line-item descriptions are stored as free text and often arrive as
// one long run-on paragraph ("Label — detail Label — detail ... Scope: a b c").
// This turns that blob into a readable checklist for the portal cards. It is
// best-effort: if no structure is found the caller falls back to plain text.

export type Inclusion = {
  /** Short bolded lead-in, e.g. "Voice over". */
  label?: string;
  /** The explanatory text. */
  text: string;
  /** Sub-points for a "scope / deliverables" style trailing clause. */
  sub?: string[];
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// A capitalised lead-in of up to ~4 words that ends right before " — ".
const FEATURE_BOUNDARY =
  /([a-z0-9)\]".,'’])\s+(?=[A-Z][\w'’/-]*(?:\s+[a-z0-9][\w'’/-]*){0,3}\s+[—–]\s)/g;

const SCOPE_HEADING =
  /\b((?:typical\s+)?(?:scope\s*(?:\/\s*deliverables)?|deliverables|what(?:'s| is) included|what you get)[^:]{0,24}):\s*/i;

const TRAILING_STOPWORD = /\b(and|or|the|a|an|to|of|in|on|with|for|at|by)$/i;

function splitFeatures(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(FEATURE_BOUNDARY, "$1\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitScope(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(/\s+(?=[A-Z][a-z]+:\s)/g, "\n")
    .replace(/\s+(?=\d+\s+(?:round|revision|format|week|day|business|hour)s?\b)/gi, "\n")
    .replace(
      /([a-z)\]])\s+(?=(?:Delivered|Format|Length|Duration|Turnaround|Timeline|Aspect|Resolution|Revisions?)\b)/g,
      "$1\n"
    )
    .split("\n")
    .map((s) => s.trim().replace(/^[·•–-]\s*/, ""))
    .filter(Boolean);
}

export function parseInclusions(description: string | null | undefined): Inclusion[] {
  if (!description || !description.trim()) return [];

  // Respect real line breaks if the author already formatted the field.
  const lines = description
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const source = lines.length > 1 ? lines : [description.replace(/\s+/g, " ").trim()];

  const out: Inclusion[] = [];

  for (const line of source) {
    let features = line;
    let scope: { heading: string; items: string[] } | null = null;

    const m = line.match(SCOPE_HEADING);
    if (m && m.index !== undefined && m.index > 0) {
      features = line.slice(0, m.index).trim();
      scope = {
        heading: capitalize(m[1].trim()),
        items: splitScope(line.slice(m.index + m[0].length).trim()),
      };
    }

    for (const seg of splitFeatures(features)) {
      const dash = seg.match(/^([^,—–]{2,48}?)\s+[—–]\s+(.+)$/);
      const label = dash?.[1]?.trim();
      if (
        dash &&
        label &&
        /^[A-Z0-9"]/.test(label) &&
        label.split(/\s+/).length <= 5 &&
        !TRAILING_STOPWORD.test(label)
      ) {
        out.push({ label, text: dash[2].trim() });
      } else {
        out.push({ text: seg.trim() });
      }
    }

    if (scope && (scope.items.length > 0 || scope.heading)) {
      out.push({ label: scope.heading, text: "", sub: scope.items });
    }
  }

  return out.filter((i) => i.text || i.label || (i.sub && i.sub.length > 0));
}
