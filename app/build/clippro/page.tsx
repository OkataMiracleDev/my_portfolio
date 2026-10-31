import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import JsonLd from "@/components/Shared/JsonLd";
import Footer from "@/components/Home/Footer/Footer";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { FrameTicks, Meta, Tally } from "@/components/Shared/brand/Hud";
import { DownloadButton, SourceLink } from "@/components/Shared/ClipPro/ClipProButtons";
import { CLIPPRO, formatReleaseDate, formatSize, getClipProReleases } from "@/lib/clippro";
import { SITE_URL } from "@/lib/site";
import { PERSON_ID, STUDIO_ID, breadcrumbNode, graph } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

const url = `${SITE_URL}${CLIPPRO.pagePath}`;

export const metadata: Metadata = {
  title: "ClipPro, footage selects for editors | Okata Studios",
  description:
    "ClipPro is a free, open-source Windows app that scores footage for focus, exposure, motion and sound and exports the best parts to Premiere, Resolve, Final Cut or Avid.",
  keywords: [...CLIPPRO.technology, "video editing", "footage selects", "DaVinci Resolve", "Premiere Pro"],
  openGraph: {
    title: "ClipPro | Okata Studios",
    description: CLIPPRO.tagline,
    url,
    type: "website",
    images: [{ url: `${SITE_URL}${CLIPPRO.shots[0].src}` }],
  },
  alternates: { canonical: url },
};

/**
 * ClipPro's page: the project-page layout (header, facts, screens, the build) with the
 * download where the live link would be, plus the release notes, read live from GitHub.
 */
export default async function ClipProPage() {
  const { latest, earlier } = await getClipProReleases();

  const facts = [
    { label: "Type", value: "Desktop app" },
    { label: "Platform", value: CLIPPRO.platform },
    { label: "Licence", value: CLIPPRO.licence },
    { label: "Latest", value: latest ? `v${latest.version}` : "Coming soon" },
    ...(latest ? [{ label: "Released", value: formatReleaseDate(latest.date) }] : []),
  ];

  const jsonLd = graph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: CLIPPRO.name,
      description: CLIPPRO.summary,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Windows 10, Windows 11",
      ...(latest ? { softwareVersion: latest.version, datePublished: latest.date, downloadUrl: latest.installer?.url ?? CLIPPRO.latestInstallerUrl } : {}),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      image: `${SITE_URL}${CLIPPRO.shots[0].src}`,
      license: `${CLIPPRO.repoUrl}/blob/main/LICENSE`,
      codeRepository: CLIPPRO.repoUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": STUDIO_ID },
      url,
    },
    breadcrumbNode([
      { name: "Okata Studios", path: "/" },
      { name: "Frontend development", path: "/build" },
      { name: "ClipPro", path: CLIPPRO.pagePath },
    ])
  );

  return (
    <>
      <JsonLd data={jsonLd} />

      <header className="okata-stage relative overflow-hidden px-6 pb-14 pt-36 md:px-12 md:pb-20 md:pt-48">
        <OkataRing className="okata-ring-drift pointer-events-none absolute -right-48 -top-32 h-[34rem] w-[34rem] opacity-[0.055]" />
        <div className="relative mx-auto max-w-[84rem]">
          <Meta className="okata-rise mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/40">
            <Link href="/build" className="transition-colors duration-200 ease-out hover:text-ink">
              Build
            </Link>
            <span aria-hidden="true" className="text-ink/20">
              /
            </span>
            <span>Software</span>
          </Meta>

          <h1 className="max-w-[18ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.86] tracking-[-0.035em] text-ink">
            <span className="okata-line">
              <span>
                ClipPro<span className="text-signal">.</span>
              </span>
            </span>
          </h1>

          <p className="okata-rise mt-7 max-w-2xl text-lg leading-relaxed text-ink/60" style={{ animationDelay: "300ms" }}>
            {CLIPPRO.summary}
          </p>

          <div className="okata-rise mt-10 grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-12" style={{ animationDelay: "360ms" }}>
            <dl className="grid grid-cols-2 gap-6 md:col-span-6 md:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>
                    <Meta className="text-ink/35">{fact.label}</Meta>
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="md:col-span-6 md:pl-8">
              <Meta className="text-ink/35">Built with</Meta>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {CLIPPRO.technology.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-pill border border-accent-build/25 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-accent-build"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="okata-rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "420ms" }}>
            <DownloadButton release={latest} accent="build" />
            <SourceLink />
            {latest?.portable && (
              <a href={latest.portable.url} className="px-2 text-sm font-medium text-ink/55 transition-colors duration-200 ease-out hover:text-ink">
                Portable ZIP ({formatSize(latest.portable.size)})
              </a>
            )}
          </div>
          <p className="okata-rise mt-4" style={{ animationDelay: "460ms" }}>
            <Meta className="text-ink/30">
              {latest ? "Free · open source · installs per user, no admin needed · updates itself" : "The first release is on its way"}
            </Meta>
          </p>
        </div>
      </header>

      <main>
        <section className="px-4 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-[96rem] space-y-5">
            {CLIPPRO.shots.map((shot, i) => (
              <div key={shot.src} className="rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 md:p-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:rounded-[calc(2rem-0.5rem)]">
                  <Image src={shot.src} alt={shot.alt} fill sizes="100vw" quality={90} priority={i === 0} className="object-cover object-top" />
                  <FrameTicks className="m-5" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-stage/70 to-transparent px-5 pb-4 pt-10 md:px-7 md:pb-5">
                    <Meta className="text-ink/50">
                      {String(i + 1).padStart(2, "0")} / {String(CLIPPRO.shots.length).padStart(2, "0")}
                    </Meta>
                    <Meta className="text-ink/50">{shot.label}</Meta>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 md:px-12 md:pb-28">
          <div className="mx-auto grid max-w-[84rem] gap-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <Meta className="mb-8 block text-ink/35">The build</Meta>
              <div className="okata-prose max-w-3xl">
                <p>
                  Editors lose hours scrubbing through footage that was never usable: soft focus, blown highlights, a
                  shaky pan, a dead mic. ClipPro does that first pass. It decodes each clip once, measures focus,
                  exposure, camera and subject motion and the audio at every sample, and scores the result against a
                  preset you can tune with sliders, a weighting radar and a camera-movement wheel.
                </p>
                <p>
                  The selects go to the edit as a real timeline: FCP7 XML and FCPXML for Premiere, Resolve and Final
                  Cut, AAF and ALE for Avid, OTIO and EDL for everything else, with markers that carry the scores. It
                  can also read an edit back, score every shot in it and suggest better takes.
                </p>
                <p>
                  Local AI is optional and stays on the machine: face detection and People, CLIP shot types and
                  visual search, Whisper transcripts with filler and flub detection, and speaker turns. The core is
                  Rust (FFmpeg for decoding, ONNX Runtime and whisper.cpp for the models); the interface is React
                  inside Tauri, designed to feel like a native Mac app on Windows.
                </p>
              </div>
            </div>

            <div className="md:col-span-5">
              <Meta className="mb-8 block text-ink/35">Release notes</Meta>
              {latest ? (
                <div className="rounded-[1.75rem] border border-ink/10 bg-frame/50 p-7 md:p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Tally tone="accent" className="text-accent-build">
                      v{latest.version}
                    </Tally>
                    <Meta className="text-ink/35">{formatReleaseDate(latest.date)}</Meta>
                  </div>
                  <div className="okata-prose text-[0.975rem]">
                    <ReactMarkdown>{latest.notes || `ClipPro ${latest.version}.`}</ReactMarkdown>
                  </div>
                  {earlier.length > 0 && (
                    <div className="mt-8 border-t border-ink/10 pt-6">
                      <Meta className="mb-3 block text-ink/35">Earlier</Meta>
                      <ul className="space-y-2">
                        {earlier.map((r) => (
                          <li key={r.version} className="flex items-center justify-between gap-4 text-sm">
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink/70 transition-colors duration-200 ease-out hover:text-ink">
                              v{r.version}
                            </a>
                            <Meta className="text-ink/30">{formatReleaseDate(r.date)}</Meta>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <a
                    href={CLIPPRO.releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent-build transition-opacity duration-200 ease-out hover:opacity-80"
                  >
                    Every release on GitHub
                  </a>
                </div>
              ) : (
                <p className="text-ink/50">
                  The first release is on its way. Follow{" "}
                  <a href={CLIPPRO.releasesUrl} target="_blank" rel="noopener noreferrer" className="text-accent-build">
                    the releases on GitHub
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12 md:pb-32">
          <div className="mx-auto flex max-w-[84rem] flex-col items-center gap-6 rounded-[1.75rem] border border-ink/10 bg-frame/50 px-6 py-14 text-center">
            <Tally tone="accent" className="text-ink/45">
              Open for work
            </Tally>
            <p className="max-w-lg font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[0.95] tracking-tight text-ink">
              Want a tool like this built for your team?
            </p>
            <Link
              href="/build#contact"
              className="group inline-flex items-center gap-2 rounded-pill bg-accent-build py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
            >
              <span>Start a project</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
