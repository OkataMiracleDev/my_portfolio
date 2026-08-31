# Studio Plugin Store — Design Spec

**Date**: 2026-08-31
**Status**: Draft, pending user review
**Author**: Design session (Claude)

## 0. Why this exists

`/animate/resources` today (the `resources` table + `lib/actions/resources.ts`) is a curated list of downloads, tutorials, and tool links — some self-hosted files, some links out to tools the user didn't make. Going forward that table stays exactly what it is: a place to link to resources the user uses but didn't build. **It is not touched by this spec.**

The new need is a Gumroad-style storefront for things the user *makes* — plugins/tools sold directly from the site, with a fixed price, an optional "pay what you want" mode (down to $0/free), a thumbnail, a downloadable file, and real payment processing. This is a new, separate system: new tables, new routes, new admin pages, sitting alongside the existing resources feature rather than replacing or merging into it.

## 1. Site placement

`/animate/resources` gets split into two labeled sections on the same page, and the same split is applied to `ResourcesTeaser` on the `/animate` homepage:

- **"Mimi Studio"** — self-made products, backed by the new `studioPlugins` table.
- **"External resources"** — everything that exists today, backed by the untouched `resources` table, same query/logic as now.

New routes introduced:

| Route | Purpose |
|---|---|
| `/animate/resources/plugins/[slug]` | Plugin detail page: thumbnail, description, price picker, email field, "Buy" |
| `/animate/resources/plugins/[slug]/success` | Post-payment: verifies the transaction, shows the download button |
| `/animate/resources/plugins/redownload` | "Lost your link?" — email-lookup, resends via email |
| `/admin/plugins`, `/admin/plugins/new`, `/admin/plugins/[id]` | Admin CRUD, mirrors `/admin/resources`'s existing list/new/edit/reorder/delete pattern |
| `/admin/plugins/sales` | Read-only sales list: plugin, buyer email, amount, status, date |

## 2. Data model

Two new tables in `lib/db/schema.ts`. Money is stored as an integer in major currency units (₦, no kobo) — the same convention already used by `brandmydellSpots.currentBid` / `brandmydellPayments.amount` — and converted to kobo only at the Paystack API call boundary.

```ts
export const studioPlugins = sqliteTable("studio_plugins", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  thumbnailUrl: text("thumbnail_url").notNull(), // 1:1 image, required
  fileUrl: text("file_url").notNull(), // zip in Blob — never selected by public-facing queries
  priceAmount: integer("price_amount").notNull(), // ₦, major units
  pwywEnabled: integer("pwyw_enabled", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const pluginPurchases = sqliteTable("plugin_purchases", {
  reference: text("reference").primaryKey(), // "plg_" + uuid, same pattern as brandmydellPayments
  pluginId: text("plugin_id").notNull().references(() => studioPlugins.id),
  email: text("email").notNull(),
  amountPaid: integer("amount_paid").notNull(), // ₦, major units
  status: text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
  downloadToken: text("download_token").unique(), // set when status -> paid
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});
```

`pluginPurchases` is the single source of truth for three things: the admin sales list, the redownload-by-email lookup, and gating the download link. No separate purchases/entitlements table needed.

Public-facing reads of `studioPlugins` (listing, detail page) never select `fileUrl` — only the download-fulfillment code path (§4) reads it.

## 3. Payment flow (Paystack, real mode)

Uses Paystack's **Standard/redirect** integration (no Inline JS popup), mirroring the shape already established in `lib/brandmydell/repo.ts`'s `initPayment`/`getPayment`, but hitting the real Paystack API instead of `/mock-paystack`.

1. On the plugin page, the buyer picks an amount (read-only if `pwywEnabled` is false; a ₦0-floored number input, pre-filled with `priceAmount` as a suggestion, if true) and an email, then clicks **Buy**.
2. `POST /api/plugins/paystack/init`:
   - Validates the amount: must equal `priceAmount` exactly if PWYW is off; must be a non-negative integer if PWYW is on. Rejects if the plugin isn't `published`.
   - Inserts a `pluginPurchases` row (`status: "pending"`).
   - Calls Paystack's real `POST https://api.paystack.co/transaction/initialize` (amount × 100 for kobo, happens only here), with `callback_url` pointing at the success page.
   - Redirects the buyer to the real `authorization_url` Paystack returns.
3. Buyer pays on Paystack's hosted checkout (real cards, real money) and is redirected to `/animate/resources/plugins/[slug]/success?reference=...`.

**Confirming payment — two independent paths**, since a buyer can close the tab before returning:

- **Callback path** (fast UX): the success page calls Paystack's `GET /transaction/verify/:reference`, checks `status === "success"` *and* that the returned amount matches the stored `amountPaid` (defends against client-side tampering with the init amount), then marks the purchase `paid`, mints `downloadToken`, shows the download button, and emails a receipt with the link via the existing nodemailer/Gmail setup (`EMAIL_USER`/`EMAIL_PASS`, same transporter pattern as `app/api/contact/route.ts`).
- **Webhook path** (source of truth): `POST /api/plugins/paystack/webhook` verifies the `x-paystack-signature` header (HMAC-SHA512 of the raw body using `PAYSTACK_SECRET_KEY`) and on `charge.success` runs the same "mark paid + mint token + email" logic. Written idempotently — a no-op if the purchase is already `paid` — so it's safe regardless of which path lands first.

A `pending` purchase Paystack reports as failed/abandoned is marked `cancelled`; the success page then shows a "payment didn't go through" state linking back to the plugin, not a broken download button.

## 4. Download delivery & security

Vercel Blob (`lib/blob.ts`, confirmed from the current `uploadToBlob`) only offers "public with an unguessable random-suffixed URL" — there's no true private/signed-URL mode. So the raw blob URL for a plugin file is never returned by any public-facing query or shown in any public UI:

- `GET /api/plugins/download/[token]` looks up `pluginPurchases` by `downloadToken`, confirms `status === "paid"`, and 307-redirects to the real Blob URL (read server-side only at this point). Unknown token → 404. Token belonging to a non-paid purchase → 403.
- The token — not the underlying storage path — is the only thing that can leak if a link is shared, matching the practical threat model of Gumroad-style stores.

**Redownload flow**: `/animate/resources/plugins/redownload` takes an email, looks up that email's `paid` purchases server-side, and **emails** the links rather than displaying them on-screen. The page always shows the same generic "if we found a purchase for that email, check your inbox" response regardless of whether anything matched, so the form can't be used to enumerate other buyers' purchase history.

## 5. Large file uploads

Routing a 100–250MB plugin zip through the existing `/api/admin/upload` route would hit Vercel's ~4.5MB serverless request-body limit. Plugin files instead use **Vercel Blob's client-side upload** (`@vercel/blob/client`'s `upload()`), which goes straight from the admin's browser to Blob storage via a short-lived token issued by a new authenticated route (`requireSession()`-gated, same as today's upload route) — bypassing our server for the large transfer entirely.

- Plugin file: zip only, larger cap (target ~200MB) — new `uploadKind` alongside the existing `image`/`download` kinds in `lib/blob.ts`, using the client-upload path.
- Thumbnail: 1:1 image, stays on the existing small-file `/api/admin/upload` route unchanged, reusing `UploadWidget` with a client-side aspect-ratio check added.

## 6. Admin experience

`/admin/plugins` mirrors `/admin/resources`'s existing list/new/edit/reorder/delete UI. Form fields: title, slug, description, tags (comma-separated, same convention as resources), thumbnail (1:1 image), plugin file (new zip client-upload widget), price (₦, integer), "Allow pay what you want" toggle, "Published" toggle (defaults off, so an in-progress plugin — no file yet, price not settled — never appears on the live site).

`/admin/plugins/sales`: read-only table joining `pluginPurchases` → plugin title, newest first. Columns: plugin, email, amount, status, date. No charts, no export — a scrollable record, per the "simple sales list" decision below.

## 7. Error handling

- Init route rejects invalid/mismatched amounts and unpublished plugins before ever calling Paystack.
- Verify/webhook mismatches (amount tampering, unknown reference) are rejected rather than silently marked paid.
- Download route: 404 for unknown tokens, 403 for tokens on non-paid purchases.
- Upload widget surfaces Blob client-upload errors (bad type, too large, network failure) the same way the existing widget does today.

## 8. Testing plan

- Unit tests for amount validation (fixed vs. PWYW, ₦0 allowed only when PWYW is on) — modeled on `brandmydell/repo.ts`'s `placeBid`, which already has a clear discriminated-union error-return shape to follow.
- Webhook signature verification tested against known-good and known-bad HMAC fixtures.
- Idempotency test: replaying the same webhook event twice must not double-mint a download token or double-send the receipt email.
- Manual end-to-end smoke test against Paystack's test-mode keys (test cards) before switching `PAYSTACK_SECRET_KEY` to a live key.

## 9. Decisions made during design

1. **Payment processor**: Paystack, real mode (not the mocked flow `brandmydell` uses). Standard/redirect integration, no Inline JS.
2. **Currency**: NGN (₦) — Paystack's native currency, no extra multi-currency enablement needed on the merchant account.
3. **Site placement**: nested under `/animate/resources`, split into "Mimi Studio" (new) vs. "External resources" (existing, untouched) sections, on both the resources page and the homepage teaser.
4. **PWYW floor**: always ₦0 when enabled — one toggle per plugin, no separate minimum-price field.
5. **Lost-link recovery**: an email-lookup page that re-sends via email, never displays purchases on-screen (avoids purchase-history enumeration).
6. **File constraints**: plugin files are zip-only with a larger size cap than today's resource downloads; requires switching to Vercel Blob's client-upload flow to avoid Vercel's serverless body-size limit.
7. **Sales visibility**: a simple admin sales list (no analytics/charts/export) is in scope for v1.
8. **Gallery images**: out of scope for v1 — thumbnail only.

## 10. Open items for the implementation plan

- Exact Blob path/key convention for plugin files (parallel to `lib/blob.ts`'s existing `${kind}s/${Date.now()}-${file.name}`).
- Whether `studioPlugins.tags` gets wired into the sitewide tag-browsing feature (`lib/data/public.ts`'s tag aggregation) or stays plugin-local for v1 — leaning toward plugin-local to avoid scope creep, final call at implementation time.
- `PAYSTACK_SECRET_KEY` must be added to `.env.local` (test key first) before implementation can be smoke-tested — this is a user action, not something written by the agent.
