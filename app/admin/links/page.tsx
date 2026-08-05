import ShareableLinksList from "@/components/Admin/Links/ShareableLinksList";

export default function LinksAdminPage() {
  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Shareable Links
      </h1>
      <p className="mb-6 max-w-xl text-sm text-ink/50">
        Quick links to send clients or drop in a message — for per-client portal links (progress +
        custom rate card), go to a client&apos;s page under Clients instead.
      </p>
      <ShareableLinksList />
    </div>
  );
}
