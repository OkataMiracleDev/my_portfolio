import { Meta } from "@/components/Shared/brand/Hud";
import JsonLd from "@/components/Shared/JsonLd";
import { ANIMATE_FAQ } from "@/lib/seo/animate-faq";
import { faqNode, graph } from "@/lib/seo/structured-data";

/**
 * "Before you ask" — the plain-language answers someone hiring a motion
 * designer in Nigeria is searching for, in the route's own register.
 *
 * Native <details> rather than a JS accordion: the answers are in the HTML
 * from the first byte, so crawlers and AI assistants read every one of them
 * without executing anything, and it works with JavaScript off and with a
 * keyboard for free.
 */
export default function AnimateFaq() {
  return (
    <section className="section px-6 md:px-12" aria-labelledby="animate-faq-heading">
      <JsonLd data={graph(faqNode(ANIMATE_FAQ))} />

      <div className="mx-auto max-w-[84rem]">
        <div className="mb-12 md:mb-16">
          <Meta className="mb-5 block text-ink/40">Before you ask</Meta>
          <h2
            id="animate-faq-heading"
            className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink"
          >
            Motion design,
            <br />
            made in Nigeria<span className="text-signal">.</span>
          </h2>
        </div>

        <ol className="divide-y divide-ink/10 border-y border-ink/10">
          {ANIMATE_FAQ.map((entry, i) => (
            <li key={entry.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 transition-colors duration-200 ease-out hover:text-ink md:gap-8 md:py-7 [&::-webkit-details-marker]:hidden">
                  <Meta className="w-10 shrink-0 tabular-nums text-signal">
                    {`Q${String(i + 1).padStart(2, "0")}`}
                  </Meta>
                  <h3 className="flex-1 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold leading-snug tracking-tight text-ink/85 group-open:text-ink md:text-2xl">
                    {entry.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-lg text-ink/35 transition-transform duration-200 ease-out group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] pb-7 pl-[3.75rem] text-base leading-relaxed text-ink/60 md:pl-[4.5rem]">
                  {entry.answer}
                </p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
