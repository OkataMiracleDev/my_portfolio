import { listBriefSubmissions, deleteBriefSubmission } from "@/lib/actions/brief-submissions";
import { PageHeader, DataList, Row, RowLink, Badge, EmptyState } from "@/components/Admin/ui/Shell";
import DeleteButton from "@/components/Admin/ui/DeleteButton";
import { formatReceived } from "./format";

export const dynamic = "force-dynamic";

export default async function BriefSubmissionsPage() {
  const items = await listBriefSubmissions();
  // Archived briefs stay reachable but sink below everything still in play.
  const ordered = [...items.filter((b) => b.status !== "archived"), ...items.filter((b) => b.status === "archived")];

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Briefs"
        description="Every brief a client sends, exactly as they filled it in. Each one is also emailed to you."
      />
      {ordered.length === 0 ? (
        <EmptyState
          title="No briefs yet"
          description="They land here as soon as a client hits “Send brief” on any of the brief pages."
        />
      ) : (
        <DataList>
          {ordered.map((brief) => {
            const answered = brief.answers.filter((a) => a.answer.trim()).length;
            return (
              <Row
                key={brief.id}
                title={brief.subjectName}
                badge={
                  brief.status === "new" ? (
                    <Badge tone="live">New</Badge>
                  ) : brief.status === "archived" ? (
                    <Badge tone="muted">Archived</Badge>
                  ) : undefined
                }
                meta={
                  <>
                    {brief.briefLabel} · {formatReceived(brief.createdAt)} · {answered} of {brief.answers.length}{" "}
                    answered
                    {brief.selectedPackage && <> · {brief.selectedPackage}</>}
                  </>
                }
                actions={
                  <>
                    <RowLink href={`/admin/briefs/${brief.id}`}>Open</RowLink>
                    <DeleteButton action={deleteBriefSubmission.bind(null, brief.id)} label="brief" />
                  </>
                }
              />
            );
          })}
        </DataList>
      )}
    </div>
  );
}
