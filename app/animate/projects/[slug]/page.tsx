import type { Metadata } from "next";
import Link from "next/link";
import ExpandableText from "@/components/Shared/ExpandableText";
import StoryboardGallery from "@/components/Animate/StoryboardGallery";
import VideoEmbed from "@/components/Animate/VideoEmbed";
import JsonLd from "@/components/Shared/JsonLd";
import { getMotionProjectBySlug } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getMotionProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found | Okata Miracle" };
  }

  const title = `${project.title} | Okata Miracle`;
  const url = `https://www.okata-miracle.site${project.href}`;

  return {
    title,
    description: project.description,
    keywords: [...project.tags, ...project.tools],
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
      images: [{ url: project.thumbnail }],
    },
    alternates: { canonical: url },
  };
}

const AnimateProjectPage = async ({ params }: Props) => {
  const { slug } = await params;
  const project = await getMotionProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Project not found
        </h1>
      </div>
    );
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.thumbnail,
    keywords: [...project.tags, ...project.tools].join(", "),
    creator: { "@type": "Person", name: "Okata Miracle", url: "https://www.okata-miracle.site" },
    url: `https://www.okata-miracle.site${project.href}`,
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <JsonLd data={projectJsonLd} />
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
          {project.title}
        </h1>
        <div className="mb-8">
          <ExpandableText
            text={project.description}
            className="text-lg text-ink/70"
            linkClassName="text-accent-animate"
          />
        </div>

        <div
          className="relative mb-8 w-full overflow-hidden rounded-card bg-band-dark"
          style={{ paddingBottom: "56.25%" }}
        >
          {project.videoEmbedUrl ? (
            <VideoEmbed embedUrl={project.videoEmbedUrl} title={project.title} />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-jetbrains-mono)] text-sm text-base/60">
              Reel coming soon
            </p>
          )}
        </div>

        {project.processSteps && project.processSteps.length > 0 && (
          <div className="mb-8 rounded-card bg-base-raised p-8">
            <p className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
              Process
            </p>
            <ol className="space-y-8 border-l border-ink/15 pl-8 sm:pl-10">
              {project.processSteps.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-12 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent-animate font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink sm:-left-14">
                    {i + 1}
                  </span>
                  <h3 className="mb-1 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="text-ink/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mb-8 rounded-card bg-base-raised p-8">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
            Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-pill bg-accent-animate/15 px-4 py-2 text-sm font-[family-name:var(--font-jetbrains-mono)] font-medium text-accent-animate"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {project.storyboardImages && project.storyboardImages.length > 0 && (
          <div className="mb-8 rounded-card bg-base-raised p-8">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
              Storyboard
            </p>
            <StoryboardGallery images={project.storyboardImages} altPrefix={project.title} />
          </div>
        )}

        <Link
          href="/animate/projects"
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          <span>←</span>
          <span>Back to Projects</span>
        </Link>
      </div>
    </div>
  );
};

export default AnimateProjectPage;
