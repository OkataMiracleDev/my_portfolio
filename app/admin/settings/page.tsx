export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Settings
      </h1>
      <div className="rounded-card bg-base-raised p-6">
        <h2 className="mb-3 text-lg font-semibold">Changing the admin password</h2>
        <p className="mb-4 text-sm text-ink/70">
          The password hash is stored in an environment variable, not the database — this is
          deliberate (spec §6, §9 Q4), so there is no in-app form for this. To change it:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-ink/70">
          <li>
            Run <code className="rounded bg-ink/10 px-1.5 py-0.5">npx tsx scripts/hash-password.ts &quot;&lt;new password&gt;&quot;</code> locally.
          </li>
          <li>Copy the printed bcrypt hash.</li>
          <li>
            In the Vercel dashboard, open this project&apos;s Settings → Environment Variables, and
            update <code className="rounded bg-ink/10 px-1.5 py-0.5">ADMIN_PASSWORD_HASH</code> for
            the Production environment.
          </li>
          <li>Redeploy the project so the new value takes effect.</li>
        </ol>
      </div>
    </div>
  );
}
