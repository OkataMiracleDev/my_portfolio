import { footLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full px-6 py-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='rounded-card bg-base-raised p-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='text-sm text-ink/60'>
            © 2025 Okata Miracle. All rights reserved.
          </p>

          <div className='flex gap-6'>
            {footLinks.map((link) => (
              <Link
                href={link.url}
                key={link.id}
                className='text-ink/60 transition-transform duration-200 ease-out hover:scale-110 hover:text-ink'
              >
                <span className='text-xl'>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
