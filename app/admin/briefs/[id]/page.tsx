import { notFound } from "next/navigation";
import {
  getBriefSubmission,
  markBriefSubmissionRead,
  setBriefSubmissionStatus,
} from "@/lib/actions/brief-submissions";
import type { BriefAnswer } from "@/lib/briefs/email";
import { PageHeader, BackLink, Panel, Badge } from "@/components/Admin/ui/Shell";
import { Meta } from "@/components/Shared/brand/Hud";
import { formatReceived } from "../format";

export const dynamic = "force-dynamic";

/**
 * Consecutive answers that share a section heading, in form order. Briefs
 * sent from a cached page before sections were recorded come through as one
 * untitled group, which still reads top to bottom like the form.
 */
function groupBySection(answers: BriefAnswer[]) {
  const groups: Array<{ section?: string; items: Array<BriefAnswer & { number: number }> }> = [];
  answers.forEach((answer, i) => {
    const last = groups[groups.length - 1];
    const item = { ...answer, number: i + 1 };
    if (last && last.section === answer.section) last.items.push(item);
    else groups.push({ section: answer.section, items: [item] });
  });
  return groups;
}

export default async function BriefSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await getBriefSubmission(id);
  if (!brief) notFound();

  if (brief.status === "new") await markBriefSubmissionRead(id);

  const answered = brief.answers.filter((a) => a.answer.trim()).length;
  const archived = brief.status === "archived";

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow={brief.briefLabel}
        title={brief.subjectName}
        description={
          <>
            Received {formatReceived(brief.createdAt)} · {answered} of {brief.answers.length} answered
          </>
        }
        action={<BackLink href="/admin/briefs">All briefs</BackLink>}
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {archived && <Badge tone="muted">Archived</Badge>}
        <form action={setBriefSubmissionStatus.bind(null, id, archived ? "read" : "archived")}>
          <button
            type="submit"
            className="rounded-pill border border-ink/15 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/60 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
          >
            {archived ? "Restore" : "Archive"}
          </button>
        </form>
        <form action={setBriefSubmissionStatus.bind(null, id, "new")}>
          <button
            type="submit"
            className="rounded-pill border border-ink/15 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
          >
            Mark unread
          </button>
        </form>
      </div>

      {brief.selectedPackage && (
        <Panel className="mb-10 border-signal/40">
          <Meta className="mb-2 block text-signal">Selected package</Meta>
          <p className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
            {brief.selectedPackage}
            {brief.selectedPrice && <span className="text-signal"> — {brief.selectedPrice}</span>}
          </p>
        </Panel>
      )}

      <div className="space-y-12">
        {groupBySection(brief.answers).map((group, g) => (
          <section key={g}>
            {group.section && (
              <h2 className="mb-5 border-b border-ink/10 pb-3 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold tracking-[-0.01em] text-ink">
                {group.section}
              </h2>
            )}
            <ol className="space-y-6">
              {group.items.map((item) => {
                const empty = !item.answer.trim();
                return (
                  <li key={item.number}>
                    <Meta className="mb-1.5 block text-signal">Q{String(item.number).padStart(2, "0")}</Meta>
                    <p className="mb-2 font-medium leading-snug text-ink">{item.question}</p>
                    <div
                      className={`whitespace-pre-wrap break-words rounded-xl border border-ink/10 bg-frame px-4 py-3 text-[0.9375rem] leading-relaxed ${
                        empty ? "italic text-ink/35" : "text-ink/85"
                      }`}
                    >
                      {empty ? "(not given)" : item.answer}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
