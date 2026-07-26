import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nAdd this to .env.local and to the Vercel dashboard's Production env vars as ADMIN_PASSWORD_HASH:\n");
  console.log(hash);
  console.log("\nNever commit this value or paste it anywhere outside an env var.\n");
});
