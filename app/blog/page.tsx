import Footer from '@/components/Home/Footer/Footer'
import React from 'react'

const BlogPage = () => {
  return (
    <div className='pt-[15rem] pb-10 w-full'>
        <div className='flex flex-col justify-center items-center gap-10'>
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h1 className='text-2xl md:text-5xl text-gray-800 font-bold'>Blog Posts</h1>
            <p className='text-gray-500 text-center font-medium text-base md"text-lg'>Thoughts, startup news and insights on software development</p>
        </div>
        <h1 className='text-gray-500 font-medium text-base md"text-lg'>No articles available yet</h1>

        </div>
        <Footer />
    </div>
  )
}

export default BlogPage