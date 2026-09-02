// Mock Paystack checkout — dev-only. Reached by clicking the "Pay" button
// in the bid dialog after a successful bid POST. Looks up the pending
// payment by reference, renders the styled frame, and POSTs the
// cancel/pay decision to the server action which sets status and redirects
// back to /brandmydell/.
//
// This page inherits the root layout's <html>/<body> but overrides the
// body styles locally so the dark portfolio chrome doesn't show through.
// The `force-dynamic` keeps it out of any static cache.

import type { Metadata } from "next";
import { getPayment } from "@/lib/brandmydell/repo";
import { completeMockPaystack } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "brandmydell · mock paystack checkout",
  robots: { index: false, follow: false }
};

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);

export default async function MockPaystackPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  if (!reference) {
    return (
      <main style={missingStyle}>
        <p>Missing reference.</p>
      </main>
    );
  }
  const payment = await getPayment(reference);
  const amount = payment?.amount ?? 0;
  const email = payment?.email ?? "";
  const amountDisplay = fmtUSD(amount);

  return (
    <>
      <style>{mockPaystackCSS}</style>
      <main className="page">
        <div className="frame" role="dialog" aria-label="Mock Paystack checkout">
          <header className="frame__head">
            <div className="frame__brand">
              <div className="frame__title">brandmydell</div>
              <div className="frame__sub">mimi&apos;s Dell Latitude 7320 · bid</div>
            </div>
            <div className="frame__tag">Paystack · test mode</div>
          </header>
          <div className="frame__rows">
            <div className="row">
              <span className="row__k">Reference</span>
              <span className="row__v">{reference}</span>
            </div>
            <div className="row">
              <span className="row__k">Email</span>
              <span className="row__v">{email || "—"}</span>
            </div>
            <div className="row">
              <span className="row__k">Reference ttl</span>
              <span className="row__v">15 min</span>
            </div>
          </div>
          <div className="total">
            <span className="total__k">Amount due</span>
            <span className="total__v">{amountDisplay}</span>
          </div>
          <form className="frame__actions" action={completeMockPaystack}>
            <input type="hidden" name="reference" value={reference} />
            <button type="submit" name="decision" value="cancel" className="cancel">
              Cancel
            </button>
            <button type="submit" name="decision" value="pay" className="pay">
              Pay {amountDisplay}
            </button>
          </form>
          <div className="frame__foot">dev-only · no card details · no real charge</div>
        </div>
      </main>
    </>
  );
}

const missingStyle: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "var(--font-mono, monospace)",
  color: "var(--text-strong, #111)"
};

const mockPaystackCSS = `
.page {
  --hue-paper: 80;
  --hue-ink:   80;
  --hue-amber: 75;
  --surface-0:  oklch(98% 0.005 var(--hue-paper));
  --surface-1:  oklch(96% 0.006 var(--hue-paper));
  --surface-2:  oklch(93% 0.008 var(--hue-paper));
  --ink:        oklch(18% 0.010 var(--hue-ink));
  --ink-2:      oklch(28% 0.012 var(--hue-ink));
  --muted:      oklch(46% 0.014 var(--hue-ink));
  --faint:      oklch(58% 0.012 var(--hue-ink));
  --line:       oklch(86% 0.010 var(--hue-ink));
  --line-soft:  oklch(91% 0.008 var(--hue-ink));
  --accent:     oklch(68% 0.180 var(--hue-amber));
  --accent-ink: oklch(20% 0.040 var(--hue-amber));
  --font-body:  "Söhne", "Atlas Grotesk", "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono:  "JetBrains Mono", "Berkeley Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  --rad-1: 2px;
  --rad-2: 4px;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
  background: var(--surface-0);
  color: var(--ink-2);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
}
.frame {
  width: 100%;
  max-width: 460px;
  background: var(--surface-1);
  border: 1px solid var(--line);
  border-radius: var(--rad-2);
}
.frame__head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--line);
}
.frame__brand { display: flex; flex-direction: column; gap: 2px; }
.frame__title { font-family: var(--font-body); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color: var(--ink); }
.frame__sub { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.frame__tag {
  font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--accent-ink); background: var(--accent);
  padding: 4px 8px; border-radius: var(--rad-1);
}
.frame__rows { padding: 4px 24px; }
.row {
  display: grid; grid-template-columns: 1fr auto; gap: 16px;
  padding: 12px 0; border-bottom: 1px solid var(--line-soft);
  font-family: var(--font-mono); font-size: 13px;
}
.row:last-of-type { border-bottom: 0; }
.row__k { color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }
.row__v { color: var(--ink); font-variant-numeric: tabular-nums lining-nums; }
.total {
  display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: baseline;
  padding: 16px 24px; background: var(--surface-2);
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
}
.total__k { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink); }
.total__v { font-size: 17px; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums lining-nums; }
.frame__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--line); }
.frame__actions button {
  appearance: none; border: 0; padding: 16px 20px;
  font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;
  cursor: pointer; background: var(--surface-0); color: var(--ink); border-radius: 0;
}
.frame__actions .cancel { border-right: 1px solid var(--line); }
.frame__actions .pay { background: var(--accent); color: var(--accent-ink); font-weight: 700; }
.frame__actions .pay:hover { background: oklch(60% 0.190 var(--hue-amber)); }
.frame__actions .cancel:hover { background: var(--surface-2); }
.frame__foot {
  padding: 14px 24px 18px;
  font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--faint); text-align: center;
}
`;
