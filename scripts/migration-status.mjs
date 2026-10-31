// Read-only: lists the migrations recorded in the database against those in drizzle/, so you can
// see what `npx drizzle-kit migrate` would apply. Usage: node scripts/migration-status.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const journal = JSON.parse(readFileSync("drizzle/meta/_journal.json", "utf8")).entries;
const applied = await client.execute("SELECT created_at FROM __drizzle_migrations ORDER BY created_at");
const appliedTimes = new Set(applied.rows.map((r) => Number(r.created_at)));
const pending = journal.filter((e) => !appliedTimes.has(e.when));
console.log(`recorded: ${applied.rows.length}, in drizzle/: ${journal.length}`);
console.log(pending.length ? `pending: ${pending.map((e) => e.tag).join(", ")}` : "nothing pending");
const t = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='clippro_events'");
console.log(`clippro_events table: ${t.rows.length ? "present" : "missing"}`);
