import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Footer from "@/components/Home/Footer/Footer";
import { getPostBySlug } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found | Okata Miracle" };
  return { title: `${post.title} | Okata Miracle`, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <article className="prose mx-auto max-w-3xl">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-ink">{post.title}</h1>
        <ReactMarkdown>{post.bodyMarkdown}</ReactMarkdown>
      </article>
      <Footer />
    </div>
  );
}
