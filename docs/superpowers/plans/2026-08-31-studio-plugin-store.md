# Studio Plugin Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Gumroad-style storefront ("Mimi Studio") for self-made plugins — fixed price or pay-what-you-want down to ₦0, real Paystack checkout, gated downloads via Vercel Blob — living alongside (not replacing) the existing external-resources feature.

**Architecture:** Two new Drizzle tables (`studioPlugins`, `pluginPurchases`); a `lib/plugins/` module holding pure pricing/idempotency logic (unit-tested), a Paystack API wrapper, DB access, and email; new public routes under `/animate/resources/plugins/*` for checkout, success, download, and redownload; new `/admin/plugins/*` admin CRUD mirroring the existing `/admin/resources` pattern; a large-file client-upload path via `@vercel/blob/client` for plugin zips.

**Tech Stack:** Next.js 15 App Router, Drizzle ORM (libSQL/Turso), Vercel Blob (server `put` for thumbnails, client `upload()` for plugin zips), Paystack REST API (Standard/redirect, real mode), nodemailer (Gmail), Vitest.

**Design spec:** `docs/superpowers/specs/2026-08-31-studio-plugin-store-design.md`

---

## Before you start

- `PAYSTACK_SECRET_KEY` must be set in `.env.local` (a Paystack **test-mode** secret key to start — dashboard → Settings → API Keys & Webhooks). This plan cannot be smoke-tested end-to-end without it. Nothing here writes that value for you — add it yourself.
- All other env vars this plan needs (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `EMAIL_USER`, `EMAIL_PASS`, `SESSION_SECRET`) already exist in this project's `.env.local` — nothing new needed there.
- `@vercel/blob/client` (the browser-side `upload()` helper) ships inside the already-installed `@vercel/blob@^2.6.1` package — no new `npm install` required anywhere in this plan.

---

### Task 1: Database schema

**Files:**
- Modify: `lib/db/schema.ts`

- [ ] **Step 1: Append the two new tables**

Add this to the end of `lib/db/schema.ts` (after `brandmydellPayments`):

```ts
// ============================================================================
// Studio Plugin Store — Gumroad-style storefront for self-made plugins,
// separate from the `resources` table above (which stays reserved for
// links to third-party resources the user didn't make). See
// docs/superpowers/specs/2026-08-31-studio-plugin-store-design.md.
// ============================================================================

export const studioPlugins = sqliteTable("studio_plugins", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  thumbnailUrl: text("thumbnail_url").notNull(), // 1:1 image
  fileUrl: text("file_url").notNull(), // Blob URL — never selected by public-facing queries
  priceAmount: integer("price_amount").notNull(), // ₦, major units (not kobo)
  pwywEnabled: integer("pwyw_enabled", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// One row per checkout attempt. status starts "pending" on init, becomes
// "paid" (with downloadToken minted) once Paystack confirms the charge, or
// "cancelled" if Paystack reports it failed/abandoned. See
// lib/plugins/purchase-status.ts for the pending -> paid transition guard
// that makes marking a purchase paid idempotent.
export const pluginPurchases = sqliteTable("plugin_purchases", {
  reference: text("reference").primaryKey(), // "plg_" + uuid
  pluginId: text("plugin_id").notNull().references(() => studioPlugins.id),
  email: text("email").notNull(),
  amountPaid: integer("amount_paid").notNull(), // ₦, major units
  status: text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
  downloadToken: text("download_token").unique(), // set only when status -> paid
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});
```

- [ ] **Step 2: Generate the migration**

Run: `npx drizzle-kit generate`
Expected: a new file `drizzle/00XX_<generated-name>.sql` containing `CREATE TABLE studio_plugins` and `CREATE TABLE plugin_purchases` (with the FK on `plugin_id`), plus an updated `drizzle/meta/_journal.json` and a new `drizzle/meta/00XX_snapshot.json`.

- [ ] **Step 3: Read the generated SQL file to confirm it matches the schema above**

- [ ] **Step 4: Apply the migration to the dev database**

Run: `npx drizzle-kit migrate`
Expected: output confirming the new migration was applied, no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts drizzle/
git commit -m "feat(plugins): add studio_plugins and plugin_purchases tables"
```

---

### Task 2: Pricing validation (TDD)

Pure logic — no DB, no network. Decides whether a buyer-supplied amount is acceptable for a given plugin's pricing mode.

**Files:**
- Create: `lib/plugins/pricing.ts`
- Test: `lib/plugins/__tests__/pricing.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { validateAmount } from "../pricing";

describe("validateAmount", () => {
  const fixedPlugin = { priceAmount: 5000, pwywEnabled: false };
  const pwywPlugin = { priceAmount: 5000, pwywEnabled: true };

  it("accepts an amount matching the fixed price", () => {
    expect(validateAmount(fixedPlugin, 5000)).toEqual({ ok: true });
  });

  it("rejects an amount that doesn't match the fixed price", () => {
    expect(validateAmount(fixedPlugin, 4000)).toEqual({
      ok: false,
      error: "amount must equal 5000",
    });
  });

  it("accepts ₦0 when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, 0)).toEqual({ ok: true });
  });

  it("accepts any non-negative amount when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, 12000)).toEqual({ ok: true });
  });

  it("rejects a negative amount even when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, -1)).toEqual({
      ok: false,
      error: "amount cannot be negative",
    });
  });

  it("rejects a non-integer amount", () => {
    expect(validateAmount(pwywPlugin, 49.99)).toEqual({
      ok: false,
      error: "amount must be a whole number",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/plugins/__tests__/pricing.test.ts`
Expected: FAIL — `Cannot find module '../pricing'`

- [ ] **Step 3: Write the implementation**

```ts
// lib/plugins/pricing.ts
export interface PriceablePlugin {
  priceAmount: number;
  pwywEnabled: boolean;
}

export type AmountValidation = { ok: true } | { ok: false; error: string };

export function validateAmount(plugin: PriceablePlugin, amount: number): AmountValidation {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    return { ok: false, error: "amount must be a whole number" };
  }
  if (amount < 0) {
    return { ok: false, error: "amount cannot be negative" };
  }
  if (!plugin.pwywEnabled && amount !== plugin.priceAmount) {
    return { ok: false, error: `amount must equal ${plugin.priceAmount}` };
  }
  return { ok: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/plugins/__tests__/pricing.test.ts`
Expected: PASS — 6 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/plugins/pricing.ts lib/plugins/__tests__/pricing.test.ts
git commit -m "feat(plugins): add amount validation logic"
```

---

### Task 3: Idempotency guard (TDD)

Pure logic that decides whether a purchase is allowed to transition to `paid`. This is what makes the webhook safe to replay and safe to race against the success-page callback.

**Files:**
- Create: `lib/plugins/purchase-status.ts`
- Test: `lib/plugins/__tests__/purchase-status.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { canTransitionToPaid } from "../purchase-status";

describe("canTransitionToPaid", () => {
  it("allows a pending purchase to become paid", () => {
    expect(canTransitionToPaid("pending")).toBe(true);
  });

  it("blocks an already-paid purchase from being processed again", () => {
    expect(canTransitionToPaid("paid")).toBe(false);
  });

  it("blocks a cancelled purchase from becoming paid", () => {
    expect(canTransitionToPaid("cancelled")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/plugins/__tests__/purchase-status.test.ts`
Expected: FAIL — `Cannot find module '../purchase-status'`

- [ ] **Step 3: Write the implementation**

```ts
// lib/plugins/purchase-status.ts
export type PurchaseStatus = "pending" | "paid" | "cancelled";

// Only a pending purchase may transition to paid. This is the single
// source of truth that makes lib/plugins/repo.ts's markPurchasePaid()
// safe to call twice for the same reference — once from the Paystack
// webhook, once from the success-page callback verify, in either order,
// any number of times.
export function canTransitionToPaid(status: PurchaseStatus): boolean {
  return status === "pending";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/plugins/__tests__/purchase-status.test.ts`
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/plugins/purchase-status.ts lib/plugins/__tests__/purchase-status.test.ts
git commit -m "feat(plugins): add purchase idempotency guard"
```

---

### Task 4: Paystack API wrapper (TDD for signature verification)

**Files:**
- Create: `lib/plugins/paystack.ts`
- Test: `lib/plugins/__tests__/paystack.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "../paystack";

describe("verifyWebhookSignature", () => {
  const secret = "test_secret_key";

  beforeEach(() => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", secret);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function sign(body: string) {
    return crypto.createHmac("sha512", secret).update(body).digest("hex");
  }

  it("accepts a correctly signed body", () => {
    const body = JSON.stringify({ event: "charge.success" });
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const tampered = JSON.stringify({ event: "charge.failed" });
    expect(verifyWebhookSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a missing signature", () => {
    const body = JSON.stringify({ event: "charge.success" });
    expect(verifyWebhookSignature(body, null)).toBe(false);
  });

  it("rejects a signature produced with the wrong secret", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const wrongSignature = crypto.createHmac("sha512", "wrong_secret").update(body).digest("hex");
    expect(verifyWebhookSignature(body, wrongSignature)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/plugins/__tests__/paystack.test.ts`
Expected: FAIL — `Cannot find module '../paystack'`

- [ ] **Step 3: Write the implementation**

```ts
// lib/plugins/paystack.ts
import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializeTransaction(
  input: InitializeTransactionInput
): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Paystack initialize failed");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export interface VerifyTransactionResult {
  status: string; // "success" | "failed" | "abandoned" | ...
  reference: string;
  amountKobo: number;
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Paystack verify failed");
  }

  return {
    status: data.data.status,
    reference: data.data.reference,
    amountKobo: data.data.amount,
  };
}

// Paystack signs each webhook payload with HMAC-SHA512 over the raw
// request body, keyed with the secret key, sent as the
// `x-paystack-signature` header. Comparison is timing-safe.
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const secret = process.env.PAYSTACK_SECRET_KEY as string;
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const givenBuffer = Buffer.from(signature, "hex");
  if (expectedBuffer.length !== givenBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, givenBuffer);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/plugins/__tests__/paystack.test.ts`
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/plugins/paystack.ts lib/plugins/__tests__/paystack.test.ts
git commit -m "feat(plugins): add Paystack API wrapper with webhook signature verification"
```

---

### Task 5: Purchase/plugin data access layer

DB-backed reads/writes for the checkout, webhook, download, and redownload flows. No unit tests for this file, consistent with this codebase's existing DB access layers (`lib/brandmydell/repo.ts`, `lib/actions/resources.ts`) — the logic worth unit-testing was already extracted into Tasks 2–3.

**Files:**
- Create: `lib/plugins/repo.ts`

- [ ] **Step 1: Write the implementation**

```ts
// lib/plugins/repo.ts
import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { studioPlugins, pluginPurchases } from "@/lib/db/schema";
import { canTransitionToPaid } from "./purchase-status";

// Full row, including fileUrl. Only ever call this from server-side code
// on the checkout/download path (init route, download route, webhook,
// success page) — never expose the result directly to the client.
export async function getPluginById(id: string) {
  const [row] = await db.select().from(studioPlugins).where(eq(studioPlugins.id, id));
  return row ?? null;
}

// The only place fileUrl is read for actual file delivery.
export async function getPluginFileUrl(pluginId: string): Promise<string | null> {
  const [row] = await db
    .select({ fileUrl: studioPlugins.fileUrl })
    .from(studioPlugins)
    .where(eq(studioPlugins.id, pluginId));
  return row?.fileUrl ?? null;
}

export interface CreatePendingPurchaseInput {
  pluginId: string;
  email: string;
  amountPaid: number;
}

export async function createPendingPurchase(input: CreatePendingPurchaseInput): Promise<string> {
  const reference = "plg_" + crypto.randomUUID();
  await db.insert(pluginPurchases).values({
    reference,
    pluginId: input.pluginId,
    email: input.email,
    amountPaid: input.amountPaid,
    status: "pending",
  });
  return reference;
}

export async function getPurchaseByReference(reference: string) {
  const [row] = await db.select().from(pluginPurchases).where(eq(pluginPurchases.reference, reference));
  return row ?? null;
}

export async function getPurchaseByToken(token: string) {
  const [row] = await db.select().from(pluginPurchases).where(eq(pluginPurchases.downloadToken, token));
  return row ?? null;
}

export async function getPaidPurchasesByEmail(email: string) {
  return db
    .select()
    .from(pluginPurchases)
    .where(and(eq(pluginPurchases.email, email), eq(pluginPurchases.status, "paid")));
}

export interface MarkPurchasePaidResult {
  purchase: typeof pluginPurchases.$inferSelect | null;
  justPaid: boolean;
}

// Idempotent: safe to call for the same reference from both the webhook
// and the success-page callback, in either order, any number of times —
// see lib/plugins/purchase-status.ts.
//
// amountPaidConfirmed is whatever Paystack itself reports as charged
// (from verifyTransaction or the webhook payload), never client input.
// It's compared against the amount stored when the purchase was created
// (which was already validated by validateAmount() at init time, and is
// exactly what we told Paystack to charge) — a mismatch means something
// is wrong (tampering, a Paystack-side anomaly) and the purchase is left
// pending rather than silently completed.
export async function markPurchasePaid(
  reference: string,
  amountPaidConfirmed: number
): Promise<MarkPurchasePaidResult> {
  const existing = await getPurchaseByReference(reference);
  if (!existing) return { purchase: null, justPaid: false };

  if (!canTransitionToPaid(existing.status)) {
    return { purchase: existing, justPaid: false };
  }

  if (amountPaidConfirmed !== existing.amountPaid) {
    return { purchase: existing, justPaid: false };
  }

  const downloadToken = crypto.randomBytes(24).toString("hex");
  await db
    .update(pluginPurchases)
    .set({ status: "paid", downloadToken })
    .where(eq(pluginPurchases.reference, reference));

  const updated = await getPurchaseByReference(reference);
  return { purchase: updated, justPaid: true };
}

export async function markPurchaseCancelled(reference: string): Promise<void> {
  const existing = await getPurchaseByReference(reference);
  if (!existing || existing.status !== "pending") return;
  await db.update(pluginPurchases).set({ status: "cancelled" }).where(eq(pluginPurchases.reference, reference));
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/plugins/repo.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/plugins/repo.ts
git commit -m "feat(plugins): add purchase/plugin data access layer"
```

---

### Task 6: Receipt email

**Files:**
- Create: `lib/plugins/email.ts`

- [ ] **Step 1: Write the implementation**

```ts
// lib/plugins/email.ts
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export interface SendPluginReceiptEmailInput {
  toEmail: string;
  pluginTitle: string;
  amountPaid: number;
  downloadUrl: string;
}

export async function sendPluginReceiptEmail(input: SendPluginReceiptEmailInput): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: input.toEmail,
    subject: `Your download: ${input.pluginTitle}`,
    text: `Thanks for your purchase of ${input.pluginTitle} (₦${input.amountPaid.toLocaleString()}).\n\nDownload it here: ${input.downloadUrl}\n\nLost this link later? Request it again at https://www.okata-miracle.site/animate/resources/plugins/redownload`,
    html: `
      <p>Thanks for your purchase of <strong>${input.pluginTitle}</strong> (₦${input.amountPaid.toLocaleString()}).</p>
      <p><a href="${input.downloadUrl}">Download it here</a></p>
      <p>Lost this link later? <a href="https://www.okata-miracle.site/animate/resources/plugins/redownload">Request it again</a>.</p>
    `,
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/plugins/email.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/plugins/email.ts
git commit -m "feat(plugins): add purchase receipt email"
```

---

### Task 7: Public content type

**Files:**
- Modify: `types/content.ts`

- [ ] **Step 1: Append the new type**

Add to `types/content.ts`:

```ts
export interface StudioPluginContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  priceAmount: number;
  pwywEnabled: boolean;
}
```

Note: deliberately no `fileUrl` — this type is what public pages receive, and it must never carry the file URL (see Task 8).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add types/content.ts
git commit -m "feat(plugins): add StudioPluginContent type"
```

---

### Task 8: Public plugin queries

**Files:**
- Modify: `lib/data/public.ts`

- [ ] **Step 1: Add imports**

At the top of `lib/data/public.ts`, extend the existing imports:

```ts
import { studioPlugins } from "@/lib/db/schema"; // add to the existing schema import line
```

(Add `studioPlugins` into the existing `import { devProjects, motionProjects, resources, ... } from "@/lib/db/schema";` list rather than a second import line.)

Also extend the type import line:

```ts
import type { ResourceContent, TestimonialContent, MotionProjectContent, StudioPluginContent } from "@/types/content";
```

- [ ] **Step 2: Add the query functions**

Add near `getResources`/`getResourceBySlug`:

```ts
// Published plugins only, and never selects fileUrl — the file is only
// ever resolved server-side for actual delivery (lib/plugins/repo.ts).
export async function getStudioPlugins(): Promise<StudioPluginContent[]> {
  const rows = await db
    .select({
      id: studioPlugins.id,
      slug: studioPlugins.slug,
      title: studioPlugins.title,
      description: studioPlugins.description,
      tags: studioPlugins.tags,
      thumbnailUrl: studioPlugins.thumbnailUrl,
      priceAmount: studioPlugins.priceAmount,
      pwywEnabled: studioPlugins.pwywEnabled,
    })
    .from(studioPlugins)
    .where(eq(studioPlugins.published, true))
    .orderBy(asc(studioPlugins.sortOrder));
  return rows;
}

export async function getStudioPluginBySlug(slug: string): Promise<StudioPluginContent | null> {
  const rows = await getStudioPlugins();
  return rows.find((row) => row.slug === slug) ?? null;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/data/public.ts`

- [ ] **Step 4: Commit**

```bash
git add lib/data/public.ts
git commit -m "feat(plugins): add public plugin listing queries"
```

---

### Task 9: Admin CRUD actions

Mirrors `lib/actions/resources.ts`.

**Files:**
- Create: `lib/actions/plugins.ts`

- [ ] **Step 1: Write the implementation**

```ts
"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { studioPlugins } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

const pluginSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  thumbnailUrl: z.string().url("Upload a thumbnail before saving."),
  fileUrl: z.string().url("Upload a plugin file before saving."),
  priceAmount: z.number().int().min(0),
  pwywEnabled: z.boolean(),
  published: z.boolean(),
});

export type PluginInput = z.infer<typeof pluginSchema>;

function revalidatePluginPaths() {
  revalidatePath("/animate/resources");
  revalidatePath("/animate");
}

export async function listPlugins() {
  await requireSession();
  return db.select().from(studioPlugins).orderBy(asc(studioPlugins.sortOrder));
}

export async function getPlugin(id: string) {
  await requireSession();
  const [row] = await db.select().from(studioPlugins).where(eq(studioPlugins.id, id));
  return row ?? null;
}

export async function createPlugin(input: PluginInput) {
  await requireSession();
  const data = pluginSchema.parse(input);
  const [row] = await db.insert(studioPlugins).values(data).returning();
  revalidatePluginPaths();
  return row;
}

export async function updatePlugin(id: string, input: PluginInput) {
  await requireSession();
  const data = pluginSchema.parse(input);
  const [row] = await db.update(studioPlugins).set(data).where(eq(studioPlugins.id, id)).returning();
  revalidatePluginPaths();
  return row;
}

export async function deletePlugin(id: string) {
  await requireSession();
  await db.delete(studioPlugins).where(eq(studioPlugins.id, id));
  revalidatePluginPaths();
}

export async function reorderPlugins(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) => db.update(studioPlugins).set({ sortOrder: index }).where(eq(studioPlugins.id, id)))
  );
  revalidatePluginPaths();
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/actions/plugins.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/actions/plugins.ts
git commit -m "feat(plugins): add admin CRUD actions"
```

---

### Task 10: Admin list page

Mirrors `app/admin/resources/`.

**Files:**
- Create: `app/admin/plugins/actions.ts`
- Create: `app/admin/plugins/page.tsx`
- Create: `components/Admin/Plugins/PluginsList.tsx`

- [ ] **Step 1: Write `app/admin/plugins/actions.ts`**

```ts
"use server";

import { redirect } from "next/navigation";
import {
  createPlugin,
  updatePlugin,
  deletePlugin,
  reorderPlugins,
  type PluginInput,
} from "@/lib/actions/plugins";

function parseForm(formData: FormData): PluginInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? ""),
    fileUrl: String(formData.get("fileUrl") ?? ""),
    priceAmount: Number(formData.get("priceAmount") ?? 0),
    pwywEnabled: formData.get("pwywEnabled") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createPluginAction(formData: FormData) {
  await createPlugin(parseForm(formData));
  redirect("/admin/plugins");
}

export async function updatePluginAction(id: string, formData: FormData) {
  await updatePlugin(id, parseForm(formData));
  redirect("/admin/plugins");
}

export async function deletePluginAction(id: string) {
  await deletePlugin(id);
}

export async function reorderPluginsAction(orderedIds: string[]) {
  await reorderPlugins(orderedIds);
}
```

- [ ] **Step 2: Write `components/Admin/Plugins/PluginsList.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { studioPlugins } from "@/lib/db/schema";
import { deletePluginAction, reorderPluginsAction } from "@/app/admin/plugins/actions";

type Plugin = typeof studioPlugins.$inferSelect;

export default function PluginsList({ initialItems }: { initialItems: Plugin[] }) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setItems(next);
    setDragIndex(null);
    reorderPluginsAction(next.map((item) => item.id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plugin? This cannot be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deletePluginAction(id);
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-card bg-base-raised">
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className="flex cursor-grab items-center justify-between gap-4 px-6 py-4"
        >
          <span className="text-ink/30">⠿</span>
          <div className="flex-1">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="text-sm text-ink/50">
              {item.published ? "Published" : "Draft"} · ₦{item.priceAmount.toLocaleString()}
              {item.pwywEnabled ? " (PWYW)" : ""} · {item.slug}
            </p>
          </div>
          <Link
            href={`/admin/plugins/${item.id}`}
            className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded-pill border border-red-600/30 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600/5"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Write `app/admin/plugins/page.tsx`**

```tsx
import Link from "next/link";
import { listPlugins } from "@/lib/actions/plugins";
import PluginsList from "@/components/Admin/Plugins/PluginsList";

export const dynamic = "force-dynamic";

export default async function PluginsAdminPage() {
  const items = await listPlugins();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">Plugins</h1>
        <Link
          href="/admin/plugins/new"
          className="rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? <p className="text-ink/50">No plugins yet.</p> : <PluginsList initialItems={items} />}
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these three files

- [ ] **Step 5: Commit**

```bash
git add app/admin/plugins/actions.ts app/admin/plugins/page.tsx components/Admin/Plugins/PluginsList.tsx
git commit -m "feat(plugins): add admin plugin list page"
```

---

### Task 11: Large-file client-upload route (Blob token endpoint)

Server route that authorizes and configures direct browser-to-Blob uploads for plugin zips, bypassing our server for the large transfer (see spec §5).

**Files:**
- Create: `app/api/admin/plugins/blob-upload/route.ts`

- [ ] **Step 1: Write the implementation**

```ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("plugin-files/") || !pathname.toLowerCase().endsWith(".zip")) {
          throw new Error("Only .zip files can be uploaded here.");
        }
        return {
          allowedContentTypes: ["application/zip", "application/x-zip-compressed"],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No DB write here — the admin form receives the Blob URL directly
        // from the client-side upload() call and stores it when the
        // plugin form is submitted (see PluginFileWidget.tsx / PluginForm.tsx).
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/plugins/blob-upload/route.ts
git commit -m "feat(plugins): add authorized client-upload token route for plugin files"
```

---

### Task 12: Plugin file upload widget

**Files:**
- Create: `components/Admin/Plugins/PluginFileWidget.tsx`

- [ ] **Step 1: Write the implementation**

```tsx
"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

interface PluginFileWidgetProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
}

export default function PluginFileWidget({ value, onChange }: PluginFileWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Only .zip files are accepted.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const blob = await upload(`plugin-files/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/plugins/blob-upload",
        onUploadProgress: (event) => setProgress(Math.round(event.percentage)),
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Plugin file (.zip)</label>
      {value && <p className="mb-3 truncate text-sm text-ink/60">{value}</p>}
      <input
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-pill file:border-0 file:bg-ink/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading && <p className="mt-2 text-sm text-ink/50">Uploading… {progress}%</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add components/Admin/Plugins/PluginFileWidget.tsx
git commit -m "feat(plugins): add plugin zip client-upload widget"
```

---

### Task 13: Admin plugin form + new/edit pages

**Files:**
- Create: `components/Admin/Plugins/PluginForm.tsx`
- Create: `app/admin/plugins/new/page.tsx`
- Create: `app/admin/plugins/[id]/page.tsx`

- [ ] **Step 1: Write `components/Admin/Plugins/PluginForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import PluginFileWidget from "./PluginFileWidget";
import type { studioPlugins } from "@/lib/db/schema";

type Plugin = typeof studioPlugins.$inferSelect;

interface PluginFormProps {
  plugin?: Plugin;
  action: (formData: FormData) => void;
}

export default function PluginForm({ plugin, action }: PluginFormProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState(plugin?.thumbnailUrl ?? "");
  const [fileUrl, setFileUrl] = useState(plugin?.fileUrl ?? "");
  const [pwywEnabled, setPwywEnabled] = useState(plugin?.pwywEnabled ?? false);
  const [published, setPublished] = useState(plugin?.published ?? false);
  const [thumbnailWarning, setThumbnailWarning] = useState<string | null>(null);

  // UploadWidget is shared with resources/testimonials/etc, so the 1:1
  // check lives here rather than inside it — a non-blocking warning only,
  // since a slightly-off thumbnail shouldn't stop a save.
  function handleThumbnailChange(url: string) {
    setThumbnailUrl(url);
    setThumbnailWarning(null);
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        setThumbnailWarning("This image isn't square (1:1) — it'll be cropped in the grid.");
      }
    };
    img.src = url;
  }

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
      <input type="hidden" name="fileUrl" value={fileUrl} />
      <input type="hidden" name="pwywEnabled" value={pwywEnabled ? "on" : ""} />
      <input type="hidden" name="published" value={published ? "on" : ""} />

      <Field label="Title" name="title" defaultValue={plugin?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={plugin?.slug}
        required
        pattern="[a-z0-9-]+"
        patternTitle="Lowercase letters, numbers, and hyphens only"
      />
      <TextArea label="Description" name="description" defaultValue={plugin?.description} required />
      <Field label="Tags (comma-separated)" name="tags" defaultValue={plugin?.tags.join(", ")} required />

      <div>
        <UploadWidget label="Thumbnail (1:1)" value={thumbnailUrl} onChange={handleThumbnailChange} kind="image" />
        {thumbnailWarning && <p className="mt-2 text-sm text-amber-600">{thumbnailWarning}</p>}
      </div>

      <PluginFileWidget value={fileUrl} onChange={setFileUrl} />

      <Field
        label="Price (₦)"
        name="priceAmount"
        type="number"
        defaultValue={plugin ? String(plugin.priceAmount) : "0"}
        required
      />

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input
          type="checkbox"
          checked={pwywEnabled}
          onChange={(e) => setPwywEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-ink/30"
        />
        Allow pay what you want (buyers can pay ₦0)
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-ink/30"
        />
        Published (visible on the live site)
      </label>

      <button
        type="submit"
        className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  pattern,
  patternTitle,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
  pattern?: string;
  patternTitle?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        pattern={pattern}
        title={patternTitle}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={5}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}
```

- [ ] **Step 2: Write `app/admin/plugins/new/page.tsx`**

```tsx
import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { createPluginAction } from "../actions";

export default function NewPluginPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">New Plugin</h1>
      <PluginForm action={createPluginAction} />
    </div>
  );
}
```

- [ ] **Step 3: Write `app/admin/plugins/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getPlugin } from "@/lib/actions/plugins";
import PluginForm from "@/components/Admin/Plugins/PluginForm";
import { updatePluginAction } from "../actions";

export default async function EditPluginPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plugin = await getPlugin(id);
  if (!plugin) notFound();

  const boundAction = updatePluginAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">Edit {plugin.title}</h1>
      <PluginForm plugin={plugin} action={boundAction} />
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these three files

- [ ] **Step 5: Commit**

```bash
git add components/Admin/Plugins/PluginForm.tsx app/admin/plugins/new/page.tsx "app/admin/plugins/[id]/page.tsx"
git commit -m "feat(plugins): add admin plugin create/edit form"
```

---

### Task 14: Admin nav links

**Files:**
- Modify: `app/admin/AdminSidebar.tsx`

- [ ] **Step 1: Add the two new nav entries**

In `NAV_ITEMS`, add after the `"/admin/resources"` entry:

```ts
  { href: "/admin/plugins", label: "Plugins" },
  { href: "/admin/plugins/sales", label: "Plugin Sales" },
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/admin/AdminSidebar.tsx
git commit -m "feat(plugins): add plugins nav links to admin sidebar"
```

---

### Task 15: Admin sales list

**Files:**
- Create: `app/admin/plugins/sales/page.tsx`

- [ ] **Step 1: Write the implementation**

```tsx
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pluginPurchases, studioPlugins } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function PluginSalesPage() {
  await requireSession();

  const rows = await db
    .select({
      reference: pluginPurchases.reference,
      pluginTitle: studioPlugins.title,
      email: pluginPurchases.email,
      amountPaid: pluginPurchases.amountPaid,
      status: pluginPurchases.status,
      createdAt: pluginPurchases.createdAt,
    })
    .from(pluginPurchases)
    .leftJoin(studioPlugins, eq(pluginPurchases.pluginId, studioPlugins.id))
    .orderBy(desc(pluginPurchases.createdAt));

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">Plugin Sales</h1>
      {rows.length === 0 ? (
        <p className="text-ink/50">No sales yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card bg-base-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-ink/50">
              <tr>
                <th className="px-6 py-3 font-medium">Plugin</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((row) => (
                <tr key={row.reference}>
                  <td className="px-6 py-3 text-ink">{row.pluginTitle ?? "(deleted plugin)"}</td>
                  <td className="px-6 py-3 text-ink/70">{row.email}</td>
                  <td className="px-6 py-3 text-ink/70">₦{row.amountPaid.toLocaleString()}</td>
                  <td className="px-6 py-3 text-ink/70">{row.status}</td>
                  <td className="px-6 py-3 text-ink/70">{row.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add "app/admin/plugins/sales/page.tsx"
git commit -m "feat(plugins): add admin sales list"
```

---

### Task 16: Checkout init route

**Files:**
- Create: `app/api/plugins/paystack/init/route.ts`

- [ ] **Step 1: Write the implementation**

```ts
import { NextResponse } from "next/server";
import { getPluginById, createPendingPurchase } from "@/lib/plugins/repo";
import { validateAmount } from "@/lib/plugins/pricing";
import { initializeTransaction } from "@/lib/plugins/paystack";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { pluginId, email, amount } = await request.json();

  if (!pluginId || typeof pluginId !== "string") {
    return NextResponse.json({ error: "pluginId is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (typeof amount !== "number") {
    return NextResponse.json({ error: "amount is required" }, { status: 400 });
  }

  const plugin = await getPluginById(pluginId);
  if (!plugin || !plugin.published) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  const validation = validateAmount(plugin, amount);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const reference = await createPendingPurchase({ pluginId: plugin.id, email, amountPaid: amount });

  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/animate/resources/plugins/${plugin.slug}/success`;

  try {
    const { authorizationUrl } = await initializeTransaction({
      email,
      amountKobo: amount * 100, // only place amount is converted to kobo
      reference,
      callbackUrl,
    });
    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add "app/api/plugins/paystack/init/route.ts"
git commit -m "feat(plugins): add Paystack checkout init route"
```

---

### Task 17: Webhook route

**Files:**
- Create: `app/api/plugins/paystack/webhook/route.ts`

- [ ] **Step 1: Write the implementation**

```ts
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/plugins/paystack";
import { markPurchasePaid, markPurchaseCancelled, getPurchaseByReference, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;
    const amountPaid = Math.round((event.data.amount as number) / 100);

    const { purchase, justPaid } = await markPurchasePaid(reference, amountPaid);
    if (purchase && justPaid && purchase.downloadToken) {
      const plugin = await getPluginById(purchase.pluginId);
      if (plugin) {
        const origin = new URL(request.url).origin;
        await sendPluginReceiptEmail({
          toEmail: purchase.email,
          pluginTitle: plugin.title,
          amountPaid: purchase.amountPaid,
          downloadUrl: `${origin}/api/plugins/download/${purchase.downloadToken}`,
        });
      }
    }
  }

  if (event.event === "charge.failed" || event.event === "charge.abandoned") {
    const reference = event.data.reference as string;
    const existing = await getPurchaseByReference(reference);
    if (existing && existing.status === "pending") {
      await markPurchaseCancelled(reference);
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add "app/api/plugins/paystack/webhook/route.ts"
git commit -m "feat(plugins): add Paystack webhook handler"
```

---

### Task 18: Success page (callback verify path)

**Files:**
- Create: `app/animate/resources/plugins/[slug]/success/page.tsx`

- [ ] **Step 1: Write the implementation**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getStudioPluginBySlug } from "@/lib/data/public";
import { verifyTransaction } from "@/lib/plugins/paystack";
import { markPurchasePaid, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order status | Mimi Studios" };

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reference?: string }>;
};

export default async function PluginSuccessPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { reference } = await searchParams;
  const plugin = await getStudioPluginBySlug(slug);

  if (!plugin) return <StatusShell title="Plugin not found" slug={slug} />;
  if (!reference) return <StatusShell title="Missing payment reference" slug={slug} />;

  let downloadToken: string | null = null;
  let failed = false;

  try {
    const verified = await verifyTransaction(reference);
    if (verified.status === "success") {
      const { purchase, justPaid } = await markPurchasePaid(reference, Math.round(verified.amountKobo / 100));
      if (purchase?.downloadToken) {
        downloadToken = purchase.downloadToken;
        if (justPaid) {
          const fullPlugin = await getPluginById(purchase.pluginId);
          if (fullPlugin) {
            await sendPluginReceiptEmail({
              toEmail: purchase.email,
              pluginTitle: fullPlugin.title,
              amountPaid: purchase.amountPaid,
              downloadUrl: `https://www.okata-miracle.site/api/plugins/download/${purchase.downloadToken}`,
            });
          }
        }
      }
    } else {
      failed = true;
    }
  } catch {
    failed = true;
  }

  if (failed || !downloadToken) {
    return <StatusShell title="Payment didn't go through" slug={slug} />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-32 text-center">
      <div className="max-w-lg mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">
          Thanks — you&apos;re all set
        </h1>
        <p className="mb-8 text-ink/70">
          A receipt with your download link is on its way to your inbox. You can also grab it right now:
        </p>
        <a
          href={`/api/plugins/download/${downloadToken}`}
          className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Download {plugin.title}
        </a>
      </div>
    </div>
  );
}

function StatusShell({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32 text-center">
      <div className="max-w-lg mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">{title}</h1>
        <Link
          href={`/animate/resources/plugins/${slug}`}
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          ← Back to plugin
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add "app/animate/resources/plugins/[slug]/success/page.tsx"
git commit -m "feat(plugins): add checkout success page with callback verification"
```

---

### Task 19: Download route

**Files:**
- Create: `app/api/plugins/download/[token]/route.ts`

- [ ] **Step 1: Write the implementation**

```ts
import { NextResponse } from "next/server";
import { getPurchaseByToken, getPluginFileUrl } from "@/lib/plugins/repo";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const purchase = await getPurchaseByToken(token);

  if (!purchase) {
    return NextResponse.json({ error: "Download link not found" }, { status: 404 });
  }
  if (purchase.status !== "paid") {
    return NextResponse.json({ error: "This purchase hasn't been completed" }, { status: 403 });
  }

  const fileUrl = await getPluginFileUrl(purchase.pluginId);
  if (!fileUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.redirect(fileUrl, 307);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file

- [ ] **Step 3: Commit**

```bash
git add "app/api/plugins/download/[token]/route.ts"
git commit -m "feat(plugins): add gated download route"
```

---

### Task 20: Redownload flow

**Files:**
- Create: `lib/actions/plugin-redownload.ts`
- Create: `app/animate/resources/plugins/redownload/page.tsx`

- [ ] **Step 1: Write `lib/actions/plugin-redownload.ts`**

```ts
"use server";

import { getPaidPurchasesByEmail, getPluginById } from "@/lib/plugins/repo";
import { sendPluginReceiptEmail } from "@/lib/plugins/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Deliberately returns nothing and behaves identically whether or not a
// match is found — the caller (the redownload page) always shows the
// same generic message, so this can't be used to enumerate other buyers'
// purchase history by guessing emails.
export async function requestRedownload(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) return;

  const purchases = await getPaidPurchasesByEmail(email);
  for (const purchase of purchases) {
    if (!purchase.downloadToken) continue;
    const plugin = await getPluginById(purchase.pluginId);
    if (!plugin) continue;
    await sendPluginReceiptEmail({
      toEmail: email,
      pluginTitle: plugin.title,
      amountPaid: purchase.amountPaid,
      downloadUrl: `https://www.okata-miracle.site/api/plugins/download/${purchase.downloadToken}`,
    });
  }
}
```

- [ ] **Step 2: Write `app/animate/resources/plugins/redownload/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { requestRedownload } from "@/lib/actions/plugin-redownload";

export default function RedownloadPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    await requestRedownload(formData);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-md mx-auto rounded-card bg-base-raised p-8 text-center md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">
          Lost your download link?
        </h1>
        <p className="mb-8 text-ink/70">
          Enter the email you used at checkout and we&apos;ll resend any download links to your inbox.
        </p>
        {submitted ? (
          <p className="text-ink/70">
            If we found a purchase for that email, check your inbox in the next few minutes.
          </p>
        ) : (
          <form action={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
            <button
              type="submit"
              className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
            >
              Resend my links
            </button>
          </form>
        )}
        <div className="mt-8">
          <Link href="/animate/resources" className="text-sm text-ink/60 hover:text-ink">
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these two files

- [ ] **Step 4: Commit**

```bash
git add lib/actions/plugin-redownload.ts "app/animate/resources/plugins/redownload/page.tsx"
git commit -m "feat(plugins): add redownload-by-email flow"
```

---

### Task 21: Public plugin detail + buy page

**Files:**
- Create: `components/Animate/PluginBuyForm.tsx`
- Create: `app/animate/resources/plugins/[slug]/page.tsx`

- [ ] **Step 1: Write `components/Animate/PluginBuyForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { StudioPluginContent } from "@/types/content";

export default function PluginBuyForm({ plugin }: { plugin: StudioPluginContent }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(plugin.priceAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/plugins/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId: plugin.id, email, amount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not start checkout");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Your email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      {plugin.pwywEnabled ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">Name your price (₦, minimum ₦0)</label>
          <input
            type="number"
            min={0}
            step={1}
            required
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Math.round(Number(e.target.value))))}
            className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
          />
        </div>
      ) : (
        <p className="text-lg font-semibold text-ink">₦{plugin.priceAmount.toLocaleString()}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] disabled:opacity-60"
      >
        {loading ? "Redirecting to checkout…" : amount === 0 ? "Get it free" : "Buy"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 2: Write `app/animate/resources/plugins/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getStudioPluginBySlug } from "@/lib/data/public";
import PluginBuyForm from "@/components/Animate/PluginBuyForm";
import JsonLd from "@/components/Shared/JsonLd";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getStudioPluginBySlug(slug);
  if (!plugin) return { title: "Plugin not found | Mimi Studios" };

  const title = `${plugin.title} | Mimi Studio`;
  const url = `https://www.okata-miracle.site/animate/resources/plugins/${plugin.slug}`;
  return {
    title,
    description: plugin.description,
    keywords: plugin.tags,
    openGraph: {
      title,
      description: plugin.description,
      url,
      type: "website",
      images: [{ url: plugin.thumbnailUrl }],
    },
    alternates: { canonical: url },
  };
}

export default async function PluginDetailPage({ params }: Props) {
  const { slug } = await params;
  const plugin = await getStudioPluginBySlug(slug);

  if (!plugin) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Plugin not found
        </h1>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: plugin.title,
    description: plugin.description,
    image: plugin.thumbnailUrl,
    offers: { "@type": "Offer", price: plugin.priceAmount, priceCurrency: "NGN" },
    creator: { "@type": "Person", name: "Okata Miracle", url: "https://www.okata-miracle.site" },
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto grid gap-10 rounded-card bg-base-raised p-8 md:grid-cols-2 md:p-12">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image src={plugin.thumbnailUrl} alt={plugin.title} fill quality={90} className="object-cover" />
        </div>
        <div>
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
            Mimi Studio
          </p>
          <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">
            {plugin.title}
          </h1>
          <p className="mb-8 text-ink/70">{plugin.description}</p>
          <PluginBuyForm plugin={plugin} />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-3xl">
        <Link
          href="/animate/resources"
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          <span>←</span>
          <span>Back to Resources</span>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these two files

- [ ] **Step 4: Commit**

```bash
git add components/Animate/PluginBuyForm.tsx "app/animate/resources/plugins/[slug]/page.tsx"
git commit -m "feat(plugins): add public plugin detail and buy page"
```

---

### Task 22: "Mimi Studio" section on the resources page

**Files:**
- Create: `components/Animate/StudioPluginsGrid.tsx`
- Modify: `app/animate/resources/page.tsx`

- [ ] **Step 1: Write `components/Animate/StudioPluginsGrid.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import type { StudioPluginContent } from "@/types/content";

export default function StudioPluginsGrid({ plugins }: { plugins: StudioPluginContent[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {plugins.map((plugin) => (
        <li key={plugin.id}>
          <Link
            href={`/animate/resources/plugins/${plugin.slug}`}
            className="block h-full overflow-hidden rounded-card bg-base-raised transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <div className="relative aspect-square">
              <Image src={plugin.thumbnailUrl} alt={plugin.title} fill quality={90} className="object-cover" />
            </div>
            <div className="p-6">
              <p className="font-semibold text-ink">{plugin.title}</p>
              <p className="mt-2 text-sm text-ink/70">{plugin.description}</p>
              <p className="mt-3 text-sm font-medium text-accent-animate">
                {plugin.pwywEnabled ? "Pay what you want" : `₦${plugin.priceAmount.toLocaleString()}`}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Rewrite `app/animate/resources/page.tsx`**

```tsx
import type { Metadata } from "next";
import ResourceFilter from "@/components/Animate/ResourceFilter";
import StudioPluginsGrid from "@/components/Animate/StudioPluginsGrid";
import { getResources, getStudioPlugins } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Motion Design Resources | Mimi Studios",
  description: "Free downloads, tutorials, and tool recommendations for motion designers.",
  openGraph: {
    title: "Free Motion Design Resources | Mimi Studios",
    description: "Free downloads, tutorials, and tool recommendations for motion designers.",
    url: "https://www.okata-miracle.site/animate/resources",
    siteName: "Mimi Studios",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate/resources",
  },
};

export default async function ResourcesPage() {
  const [resources, plugins] = await Promise.all([getResources(), getStudioPlugins()]);

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Resources
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Free for the community — no email required for downloads.
          </p>
        </div>

        {plugins.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
              Mimi Studio
            </h2>
            <StudioPluginsGrid plugins={plugins} />
          </div>
        )}

        <div>
          <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            External resources
          </h2>
          <ResourceFilter resources={resources} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these two files

- [ ] **Step 4: Commit**

```bash
git add components/Animate/StudioPluginsGrid.tsx "app/animate/resources/page.tsx"
git commit -m "feat(plugins): split resources page into Mimi Studio and external resources"
```

---

### Task 23: Homepage teaser split

**Files:**
- Modify: `components/Animate/ResourcesTeaser.tsx`
- Modify: `app/animate/page.tsx`

- [ ] **Step 1: Update `components/Animate/ResourcesTeaser.tsx`**

Extend the type import:

```ts
import type { ResourceContent, StudioPluginContent } from "@/types/content";
```

Extend the component signature and props:

```tsx
export default function ResourcesTeaser({
  resources,
  studioPlugins,
}: {
  resources: ResourceContent[];
  studioPlugins: StudioPluginContent[];
}) {
```

Insert this block inside `<div className="mx-auto max-w-4xl">`, immediately **before** the existing `<ul ref={listRef} ...>` element:

```tsx
        {studioPlugins.length > 0 && (
          <div className="mb-14">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
              Mimi Studio
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {studioPlugins.slice(0, 3).map((plugin) => (
                <li key={plugin.id}>
                  <Link
                    href={`/animate/resources/plugins/${plugin.slug}`}
                    className="group block rounded-card bg-base-raised p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
                  >
                    <span className="block font-[family-name:var(--font-cabinet-grotesk)] font-bold text-ink transition-colors duration-200 ease-out group-hover:text-accent-animate">
                      {plugin.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink/60">
                      {plugin.pwywEnabled ? "Pay what you want" : `₦${plugin.priceAmount.toLocaleString()}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

```

- [ ] **Step 2: Update `app/animate/page.tsx`**

Extend the data import:

```ts
import { getFeaturedMotionProjects, getTestimonials, getResources, getAnimateCredentials, getStudioPlugins } from "@/lib/data/public";
```

Extend the `Promise.all` and the component call:

```tsx
  const [featuredMotionProjects, testimonials, resources, credentials, studioPlugins] = await Promise.all([
    getFeaturedMotionProjects(),
    getTestimonials("animate"),
    getResources(),
    getAnimateCredentials(),
    getStudioPlugins(),
  ]);
```

```tsx
      <ResourcesTeaser resources={resources} studioPlugins={studioPlugins} />
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing these two files

- [ ] **Step 4: Commit**

```bash
git add components/Animate/ResourcesTeaser.tsx app/animate/page.tsx
git commit -m "feat(plugins): add Mimi Studio row to homepage resources teaser"
```

---

### Task 24: Env docs + manual end-to-end smoke test

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Document the new env var**

Add to `.env.example`:

```
# Paystack (Studio Plugin Store checkout — real mode, Standard/redirect flow)
PAYSTACK_SECRET_KEY=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: document PAYSTACK_SECRET_KEY env var"
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass, including the 13 new tests from Tasks 2–4

- [ ] **Step 4: Full typecheck**

Run: `npx tsc --noEmit`
Expected: no errors anywhere in the project

- [ ] **Step 5: Manual end-to-end smoke test** (requires `PAYSTACK_SECRET_KEY` set to a real Paystack **test-mode** key in `.env.local`)

1. Run `npm run dev`.
2. Log into `/admin`, go to `/admin/plugins/new`, create a plugin: upload a square thumbnail, upload a small `.zip` as the file, set a price (e.g. ₦1000), leave "pay what you want" off, check "Published", save.
3. Visit `/animate/resources` — confirm the "Mimi Studio" section shows the new plugin above "External resources".
4. Click into the plugin, enter a test email, click Buy — confirm redirect to Paystack's real hosted checkout (test mode).
5. Pay with a [Paystack test card](https://paystack.com/docs/payments/test-payments/) — confirm redirect back to the success page showing a working download button.
6. Click Download — confirm it redirects to the actual Blob file URL and the file downloads.
7. In `/admin/plugins/sales`, confirm the purchase shows `status: paid` with the correct amount and email.
8. Go to `/animate/resources/plugins/redownload`, enter the same email — confirm the generic "check your inbox" message appears, and confirm a receipt email actually arrives.
9. Edit the plugin, turn on "Allow pay what you want", save. Repeat a checkout with amount `0` — confirm it succeeds as a free "purchase" and still gates through the same download flow.
10. Using `curl` (or the Paystack dashboard's "Resend" on a past event), replay the same `charge.success` webhook payload twice — confirm the second delivery is a no-op (check server logs / sales list: no duplicate email, `status` stays `paid`, `downloadToken` unchanged).

No commit for this step — it's verification only. If anything fails, fix forward in a new commit before considering the feature done.
