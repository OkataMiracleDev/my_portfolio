export interface BriefAnswer {
  question: string;
  answer: string;
  /** The brief's section heading ("The product"). Older cached briefs omit it. */
  section?: string;
}

export interface BriefEmailInput {
  /** e.g. "SaaS ad brief" — the kind of brief this is. */
  briefLabel: string;
  /** The product/channel/company name the client gave. */
  subjectName: string;
  answers: BriefAnswer[];
  selectedPackage?: string | null;
  selectedPrice?: string | null;
}

const NOT_GIVEN = "(not given)";

export function fallback(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : NOT_GIVEN;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The brief's own palette (public/okata-studios-*-brief.html).
const INK = "#0D0D10";
const SURFACE = "#161619";
const PAPER = "#F4F3EF";
const MUTED = "#8B8A91";
const LINE = "#2A2A2E";
const SIGNAL = "#4F5BFF";

/**
 * Renders a submitted brief as an email that looks like the brief itself.
 *
 * Email clients are not browsers: no external stylesheets, no <style> in
 * many of them, no flexbox or grid worth relying on, and Gmail strips
 * classes. So this is tables and inline styles only -- the dark look has to
 * survive that, which is why every colour is repeated on every element
 * rather than inherited.
 *
 * A dark body is not guaranteed either: some clients (and most dark-mode
 * auto-inverters) repaint backgrounds. The layout stays readable if that
 * happens because each panel carries its own background *and* its own text
 * colour, so they are inverted together rather than one without the other.
 */
export function renderBriefEmail(input: BriefEmailInput): string {
  const { briefLabel, subjectName, answers, selectedPackage, selectedPrice } = input;

  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
  const body = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
  const display = "'Space Grotesk', " + body;

  const answered = answers.filter((a) => a.answer && a.answer.trim()).length;

  const packageRow =
    selectedPackage && selectedPackage.trim()
      ? `
      <tr><td style="padding:0 0 24px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background:${SURFACE};border:1px solid ${SIGNAL};border-radius:6px;">
          <tr><td style="padding:20px 24px;">
            <div style="font-family:${mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${SIGNAL};padding-bottom:8px;">
              Selected package
            </div>
            <div style="font-family:${display};font-size:18px;font-weight:600;color:${PAPER};">
              ${escapeHtml(selectedPackage.trim())}${
                selectedPrice && selectedPrice.trim()
                  ? ` <span style="color:${SIGNAL};">— ${escapeHtml(selectedPrice.trim())}</span>`
                  : ""
              }
            </div>
          </td></tr>
        </table>
      </td></tr>`
      : "";

  const questionRows = answers
    .map(({ question, answer }, i) => {
      const value = fallback(answer);
      const isEmpty = value === NOT_GIVEN;
      return `
      <tr><td style="padding:0 0 18px 0;">
        <div style="font-family:${mono};font-size:11px;letter-spacing:0.08em;color:${SIGNAL};padding-bottom:6px;">
          Q${String(i + 1).padStart(2, "0")}
        </div>
        <div style="font-family:${body};font-size:15px;font-weight:600;color:${PAPER};padding-bottom:8px;line-height:1.4;">
          ${escapeHtml(question)}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background:${SURFACE};border:1px solid ${LINE};border-radius:6px;">
          <tr><td style="padding:14px 16px;font-family:${body};font-size:15px;line-height:1.6;color:${
            isEmpty ? MUTED : PAPER
          };${isEmpty ? "font-style:italic;" : ""}">
            ${isEmpty ? NOT_GIVEN : escapeHtml(value).replace(/\n/g, "<br>")}
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:${INK};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:720px;width:100%;">

      <tr><td style="padding:0 0 28px 0;border-bottom:1px solid ${LINE};">
        <div style="font-family:${mono};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};padding-bottom:14px;">
          Okata Studios — Completed Brief
        </div>
        <div style="font-family:${display};font-size:30px;font-weight:700;color:${PAPER};line-height:1.1;">
          ${escapeHtml(briefLabel)}
        </div>
        <div style="font-family:${body};font-size:16px;color:${SIGNAL};padding-top:10px;">
          ${escapeHtml(subjectName)}
        </div>
      </td></tr>

      <tr><td style="padding:20px 0 24px 0;">
        <span style="font-family:${mono};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">
          ${answered} of ${answers.length} answered
        </span>
      </td></tr>

      ${packageRow}
      ${questionRows}

      <tr><td style="padding:20px 0 0 0;border-top:1px solid ${LINE};">
        <div style="font-family:${mono};font-size:11px;letter-spacing:0.05em;color:${MUTED};">
          Submitted via okata.space
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Plain-text fallback for clients that refuse HTML. */
export function renderBriefText(input: BriefEmailInput): string {
  const header = [
    `${input.briefLabel} — ${input.subjectName}`,
    input.selectedPackage
      ? `Selected package: ${input.selectedPackage}${input.selectedPrice ? ` (${input.selectedPrice})` : ""}`
      : null,
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return header + input.answers.map(({ question, answer }) => `${question}\n${fallback(answer)}`).join("\n\n");
}
