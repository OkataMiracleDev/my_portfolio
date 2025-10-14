import SectionHeading from '@/components/Helper/SectionHeading'
import React from 'react'

const Contact = () => {
  return (
    <div className='ml-[4%] md:ml-[4%] lg:ml-[14%] w-full mt-[7rem] md:mt-[9rem] lg:mt-[10rem] 2xl:mt-[9rem] transition-all duration-400'>
      <div className='flex flex-col flex-wrap justify-center'>
        <div className='text-left max-w-[600px]'>
          <SectionHeading heading='Get in touch' />
          <p className='text-gray-700 leading-relaxed mt-4'>
            Ready to build the future? I&apos;m keen to connect with product teams and like-minded innovators to discuss challenging projects. 
            If you&apos;re looking for a developer who delivers record-time results and drives measurable impact, feel free to book a discovery 
            call or send an email to discuss your vision.
          </p>
        </div>
        <div className='mt-8'>
            <div className='flex flex-row'>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500">
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        placeholder="e.g., Jane Doe"
                        className="block rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                </div>

            </div>
        </div>        
      </div>
    </div>
  )
}

export default Contact
