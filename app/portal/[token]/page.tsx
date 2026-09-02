import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getClientByShareToken } from "@/lib/actions/clients";
import MimiLogo from "@/components/Shared/MimiLogo";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import RateCardBlock from "@/components/Portal/RateCardBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project portal | Mimi Studios",
  robots: { index: false, follow: false },
};

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
    <div className="min-h-screen px-6 pb-24 pt-12">
      <div className="mx-auto max-w-3xl">
        <MimiLogo className="mb-14" />

        <header className="border-b border-ink/15 pb-8">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
            {STAGE_LABELS[client.stage] ?? client.stage}
          </p>
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-5xl">
            {client.name}
          </h1>
          {client.company && <p className="mt-3 text-ink/60">{client.company}</p>}
        </header>

        {rateCards.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
              Rate card
            </h2>
            {rateCards.map((card) => (
              <RateCardBlock key={card.id} card={card} />
            ))}
          </section>
        )}

        <section className="mt-14">
          <h2 className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
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
