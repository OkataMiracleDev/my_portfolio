import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getClientByShareToken } from "@/lib/actions/clients";
import MimiLogo from "@/components/Shared/MimiLogo";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import PrintButton from "@/components/Portal/PrintButton";
import { currencyBadgeLabel } from "@/lib/constants/currencies";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project portal | Mimi Studios",
  robots: { index: false, follow: false },
};

type LineItem = { section?: string; title: string; description: string; price: string; unit: string };

function groupBySection(items: LineItem[]) {
  const order: string[] = [];
  const groups = new Map<string, LineItem[]>();
  for (const item of items) {
    const key = item.section?.trim() || "";
    if (!groups.has(key)) {
      order.push(key);
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  return order.map((key) => ({ section: key, items: groups.get(key)! }));
}

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  conversation: "First conversation",
  meeting: "Meeting",
  proposal_sent: "Proposal sent",
  deposit_paid: "Deposit paid",
  in_progress: "In progress",
  completed: "Completed",
  lost: "Lost",
};

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getClientByShareToken(token);

  if (!data) notFound();
  const { client, updates, rateCards } = data;

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto max-w-2xl">
        <MimiLogo className="mb-16" />

        <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
          {STAGE_LABELS[client.stage] ?? client.stage}
        </p>
        <h1 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-5xl">
          {client.name}
        </h1>
        {client.company && <p className="mb-12 text-ink/60">{client.company}</p>}
        {!client.company && <div className="mb-12" />}

        {rateCards.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
              Rate card
            </h2>
            {rateCards.map((card) => {
              const sections = groupBySection(card.lineItems);
              return (
                <div key={card.id} className="mb-8 rounded-card border border-ink/10 bg-base-raised p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
                      {card.title}
                    </p>
                    <span className="rounded-pill border border-accent-animate/30 bg-accent-animate/10 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.06em] text-accent-animate">
                      {currencyBadgeLabel(card.currency)}
                    </span>
                  </div>

                  {sections.map((group, gi) => (
                    <div key={group.section || gi} className="mb-8 last:mb-0">
                      {card.layout === "sectioned" && group.section && (
                        <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
                          Track {String(gi + 1).padStart(2, "0")} — {group.section}
                        </p>
                      )}
                      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-ink/10 sm:grid-cols-2">
                        {group.items.map((item, i) => (
                          <div key={i} className="bg-base p-5">
                            <p className="mb-1 text-sm font-semibold text-ink">{item.title}</p>
                            {item.description && (
                              <p className="mb-4 text-xs text-ink/50">{item.description}</p>
                            )}
                            <p className="font-[family-name:var(--font-jetbrains-mono)] text-base text-accent-animate">
                              {item.price}
                            </p>
                            {item.unit && (
                              <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.06em] text-ink/40">
                                {item.unit}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {card.terms.length > 0 && (
                    <div className="mt-8 border-t border-ink/10 pt-6">
                      <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
                        Terms
                      </p>
                      <ul className="space-y-2">
                        {card.terms.map((term, i) => (
                          <li key={i} className="flex gap-3 text-sm text-ink/60">
                            <span className="text-accent-animate" aria-hidden="true">
                              →
                            </span>
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3 border-t border-ink/10 pt-6">
                    <a
                      href={`mailto:okatamiracle.dev@gmail.com?subject=${encodeURIComponent(
                        `Ready to move forward — ${card.title}`
                      )}`}
                      className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      Accept &amp; get started →
                    </a>
                    <PrintButton className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5" />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <section>
          <h2 className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
            Progress
          </h2>

          {updates.length === 0 ? (
            <p className="text-ink/50">No updates yet — check back soon.</p>
          ) : (
            <ol className="space-y-10 border-l border-ink/15 pl-8">
              {updates.map((update) => (
                <li key={update.id} className="relative">
                  <span className="absolute -left-[2.6rem] top-1 h-3 w-3 rounded-full bg-accent-animate" />
                  <p className="mb-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-ink/40">
                    {new Date(update.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                    {update.title}
                  </h3>
                  {update.body && <p className="mb-4 text-sm leading-relaxed text-ink/70">{update.body}</p>}

                  {update.videoEmbedUrl && (
                    <div className="relative mb-4 w-full overflow-hidden rounded-card bg-base-raised" style={{ paddingBottom: "56.25%" }}>
                      <VideoEmbed embedUrl={update.videoEmbedUrl} title={update.title} />
                    </div>
                  )}

                  {update.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {update.images.map((url, i) => (
                        <div key={`${url}-${i}`} className="relative aspect-square overflow-hidden rounded-xl">
                          <Image src={url} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
