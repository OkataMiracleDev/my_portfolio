import ShareableLinksList from "@/components/Admin/Links/ShareableLinksList";
import { PageHeader } from "@/components/Admin/ui/Shell";

export default function LinksAdminPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Shareable links"
        description={
          <>
            Quick links to send clients or drop in a message. For per-client portal links
            (progress plus a custom rate card), open that client under Clients instead.
          </>
        }
      />
      <ShareableLinksList />
    </div>
  );
}
