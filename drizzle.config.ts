import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit runs as a standalone CLI, outside Next.js, so it never sees
 * the .env.local that `next dev`/`next build` load automatically. Without
 * this the documented workflow in README.md ("npx drizzle-kit migrate")
 * fails with `url: undefined` on a machine that is otherwise set up
 * correctly — the credentials are right there in .env.local, drizzle-kit
 * just isn't looking.
 *
 * Reads the file directly rather than adding a dotenv dependency for one
 * call site. A real environment variable still wins, so CI (which sets
 * TURSO_* directly and has no .env.local) is unaffected.
 */
function loadEnvLocal(): void {
  let contents: string;
  try {
    contents = readFileSync(".env.local", "utf8");
  } catch {
    return; // No .env.local — rely on the ambient environment.
  }

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
