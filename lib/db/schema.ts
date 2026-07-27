import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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
  process: text("process").notNull(),
  tools: text("tools", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  storyboardImages: text("storyboard_images", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
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
