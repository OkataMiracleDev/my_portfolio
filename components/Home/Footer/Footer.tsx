import { footLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full px-6 py-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='card p-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          {/* Copyright */}
          <p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
            © 2025 Okata Miracle. All rights reserved.
          </p>

          {/* Social Links */}
          <div className='flex gap-6'>
            {footLinks.map((link) => (
              <Link 
                href={link.url} 
                key={link.id}
                className='transition-all duration-300 hover:scale-110'
                style={{ color: 'var(--color-text-secondary)' }}
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
