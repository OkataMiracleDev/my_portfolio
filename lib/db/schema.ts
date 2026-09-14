import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import crypto from "node:crypto";

// libSQL/SQLite has no UUID-generating default and no array/boolean column
// types (spec §4's Postgres sketch used both) — ids are generated in
// application code via crypto.randomUUID(), string arrays are stored as
// JSON-text columns (Drizzle's `$type<string[]>()` still gives back a real
// string[] at the TypeScript level), and booleans are stored as 0/1
// integers via `{ mode: "boolean" }`.

// Unifies data/data.ts's three overlapping arrays (projectsData,
// homeprojectsData, projectsSliderData) into one table. featuredOnHome
// replaces homeprojectsData's separate array; projectsSliderData's "link"
// field already exists here, so the public slider needs no extra table.
export const devProjects = sqliteTable("dev_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subhead: text("subhead"),
  description: text("description").notNull(),
  image: text("image").notNull(),
  image2: text("image2"),
  image3: text("image3"),
  technology: text("technology", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  date: text("date"),
  type: text("type"),
  client: text("client"),
  link: text("link"),
  featuredOnHome: integer("featured_on_home", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const motionProjects = sqliteTable("motion_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  videoEmbedUrl: text("video_embed_url"), // null = "coming soon" state, unchanged from today
  processSteps: text("process_steps", { mode: "json" })
    .$type<{ title: string; body: string }[]>()
    .notNull()
    .default(sql`'[]'`),
  tools: text("tools", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  storyboardImages: text("storyboard_images", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  featuredOnHome: integer("featured_on_home", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const resources = sqliteTable("resources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["download", "tutorial", "tool-link"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url"),
  externalUrl: text("external_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// role is nullable, unlike the spec §4 sketch: the current build-side
// testimonialData (data/data.ts) has no role field, only image/name/review.
export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  route: text("route", { enum: ["build", "animate"] }).notNull(),
  name: text("name").notNull(),
  role: text("role"),
  quote: text("quote").notNull(),
  avatar: text("avatar").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// New content type — /build/blog currently renders static "No articles
// available yet" copy (app/build/blog/page.tsx). Starts empty; nothing to
// migrate for this one in Task 13.
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  route: text("route", { enum: ["build", "animate", "general"] }).notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  bodyMarkdown: text("body_markdown").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// In scope for v1 per §9 Q2 resolution — full CRUD, not a data file.
export const experienceEntries = sqliteTable("experience_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  year: text("year").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Also in scope for v1 per §9 Q2. Renamed from data/landing.ts's
// "FunFactCard" naming convention to match this file's table-naming style.
export const funFactCards = sqliteTable("fun_fact_cards", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Stat readout on /animate (components/Animate/SpecSheet.tsx)
// — same label/value shape as funFactCards but scoped to the animate route,
// kept as its own table rather than overloading fun_fact_cards with a route
// column since the two are unrelated content on different routes.
export const animateCredentials = sqliteTable("animate_credentials", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// No adminSessions table — §9 Q3 resolved to a pure signed-cookie session
// (iron-session), nothing tracked server-side. A login_attempts table for
// rate-limiting is added later, in Task 14.

// Backs rate-limiting on /admin/login (Task 14). Keyed by IP, not by any
// account concept — there's only one admin account, so "who's attacking"
// only ever means "which IP is guessing."
export const loginAttempts = sqliteTable("login_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ipAddress: text("ip_address").notNull(),
  attemptedAt: integer("attempted_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  success: integer("success", { mode: "boolean" }).notNull().default(false),
});

// Per-route daily unique-visitor tracking for /, /build, and /animate. ipAddress
// is stored as a SHA-256 hash, not raw — we only ever need to dedupe, never
// to recover the actual IP. The unique index on (visitDate, route, ipHash)
// is the dedup mechanism itself: a second visit from the same IP to the same
// route on the same day hits the constraint and is dropped via
// onConflictDoNothing, so counting rows for a (date, route) pair IS the
// unique-visitor count — no separate aggregation needed.
export const siteVisits = sqliteTable(
  "site_visits",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    visitDate: text("visit_date").notNull(), // "YYYY-MM-DD", UTC
    route: text("route", { enum: ["build", "animate", "landing"] }).notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("site_visits_unique_visit").on(table.visitDate, table.route, table.ipHash)]
);

// --- Client pipeline / CRM ---------------------------------------------
// Kept deliberately simple (a single flat `stage` column, not a separate
// stage-history table) — this is a one-person studio tracking a handful of
// active clients at a time, not a sales team needing audit trails.

// shareToken is a separate, unguessable value from `id` specifically so the
// public portal link (/portal/[token]) never exposes or depends on the
// internal record id, and can be rotated independently if it ever leaks.
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  stage: text("stage", {
    enum: ["lead", "conversation", "meeting", "proposal_sent", "deposit_paid", "in_progress", "completed", "lost"],
  })
    .notNull()
    .default("lead"),
  notes: text("notes"), // internal only — never rendered on the public portal
  shareToken: text("share_token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomBytes(16).toString("hex")),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Manually-posted progress entries shown on a client's public portal —
// text plus optional images (Vercel Blob URLs, same as everywhere else)
// and an optional video embed. No FK cascade relied on at the DB level;
// lib/actions/clients.ts deletes these explicitly when a client is deleted.
export const clientUpdates = sqliteTable("client_updates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  videoEmbedUrl: text("video_embed_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// clientId null = a reusable generic/template rate card (e.g. the public
// /animate/rates page could eventually read from here); non-null = a
// bespoke card generated for one client, viewable on their portal.
export const rateCards = sqliteTable("rate_cards", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id"),
  title: text("title").notNull(),
  // "flat" = one plain list of line items; "sectioned" = items grouped under
  // named tracks (e.g. "Project work", "Retainer") like the public /animate/rates page.
  layout: text("layout", { enum: ["flat", "sectioned"] }).notNull().default("flat"),
  // ISO-ish code (USD, NGN, EUR, ...) shown as a badge — prices themselves stay
  // free text so ranges/units ("$300 – $800", "/mo") keep working as-is.
  currency: text("currency").notNull().default("USD"),
  lineItems: text("line_items", { mode: "json" })
    .$type<{ section?: string; title: string; description: string; price: string; unit: string }[]>()
    .notNull()
    .default(sql`'[]'`),
  // Public bullet list rendered under the line items (deposit terms, revision
  // policy, etc.) — separate from `notes` below, which stays internal-only.
  terms: text("terms", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  // Where "Accept & get started" sends the client — typically a brief page.
  // Null falls back to a mailto link.
  ctaUrl: text("cta_url"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Raw incoming submissions from the public /animate/testimonial form —
// curated/edited in admin before promoting a subset into `testimonials`,
// the table that actually renders on the site.
export const testimonialSubmissions = sqliteTable("testimonial_submissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  company: text("company"),
  project: text("project"),
  problem: text("problem"),
  process: text("process"),
  result: text("result"),
  quote: text("quote"),
  consent: integer("consent", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["new", "promoted", "archived"] }).notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

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

// ---------------------------------------------------------------------------
// Public /animate/rates page content.
//
// Distinct from `rateCards` above: that table holds per-client cards rendered
// behind a portal token, one row per client. These four tables back the single
// public rate card at /animate/rates, which was previously hardcoded as
// SERVICES/ADDONS/TERMS consts in the page and a TIERS const in
// components/Animate/RateCard/RetainerPricing.tsx. Split by section rather
// than stuffed into one JSON blob so each row is individually editable and
// reorderable in admin, matching how every other content table here works.
//
// lib/constants/rate-card-defaults.ts keeps the original hardcoded values as
// the seed source and as a fallback for any section whose table is empty, so
// the public page can never render a blank section.
// ---------------------------------------------------------------------------

// Track 01 — monthly retainer tiers.
export const rateRetainerTiers = sqliteTable("rate_retainer_tiers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // Display code in the card's top-left ("R01"), not a sort key — sortOrder is.
  code: text("code").notNull(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  // The only real number on this page: stored as an integer so the yearly
  // price (x10 months) stays derivable. Everything else is free text.
  monthly: integer("monthly").notNull(),
  features: text("features", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  // Drives the "Most chosen" badge and the raised dark treatment. Nothing
  // enforces that only one row has it — that is the admin's call.
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Track 02 — one-off project work.
export const rateServices = sqliteTable("rate_services", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // The SMPTE-style label above each card ("00:00:01:00").
  timecode: text("timecode").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  // Free text, not a number: these are ranges ("$300 - $800").
  price: text("price").notNull(),
  unit: text("unit").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Track 03 — add-ons stacked onto any project.
export const rateAddons = sqliteTable("rate_addons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  // Free text so "+25%", "$150 / round" and "$100" all work.
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// "Terms, at a glance" — the numbered list at the foot of the page.
export const rateTerms = sqliteTable("rate_terms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  body: text("body").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});
