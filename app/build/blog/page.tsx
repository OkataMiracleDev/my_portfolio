import Footer from '@/components/Home/Footer/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedPosts } from '@/lib/data/public'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Okata Miracle — Software Development Notes",
  description:
    "Writing on software development, frontend engineering, and building products by Okata Miracle.",
  openGraph: {
    title: "Blog | Okata Miracle",
    description: "Writing on software development and frontend engineering.",
    url: "https://www.okata-miracle.site/build/blog",
    siteName: "Okata Miracle",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/build/blog",
  },
};

const BlogPage = async () => {
  const posts = await getPublishedPosts(["build", "general"]);

  return (
    <div className='pt-[15rem] pb-10 w-full'>
        <div className='flex flex-col justify-center items-center gap-10'>
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h1 className='font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink'>Blog Posts</h1>
            <p className='text-ink/60 text-center font-medium text-base md:text-lg'>Thoughts, startup news and insights on software development</p>
        </div>
        {posts.length === 0 ? (
          <h1 className='text-ink/60 font-medium text-base md:text-lg'>No articles available yet</h1>
        ) : (
          <div className="flex w-full max-w-3xl flex-col gap-6 px-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/build/blog/${post.slug}`}
                className="rounded-card bg-base-raised p-6 transition-transform duration-150 ease-out hover:-translate-y-0.5"
              >
                <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
        </div>
        <Footer />
    </div>
  )
}

export default BlogPage
