import Footer from '@/components/Home/Footer/Footer'
import React from 'react'

const BlogPage = () => {
  return (
    <div className='pt-[15rem] pb-10 w-full'>
        <div className='flex flex-col justify-center items-center gap-10'>
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h1 className='font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink'>Blog Posts</h1>
            <p className='text-ink/60 text-center font-medium text-base md:text-lg'>Thoughts, startup news and insights on software development</p>
        </div>
        <h1 className='text-ink/60 font-medium text-base md:text-lg'>No articles available yet</h1>

        </div>
        <Footer />
    </div>
  )
}

export default BlogPage
