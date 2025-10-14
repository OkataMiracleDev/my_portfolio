import React from 'react'

// FIX: Stubs the missing SectionHeading component to resolve the import error.
const SectionHeading = ({ heading }: { heading: string }) => {
    return (
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {heading}
        </h2>
    );
};

const Contact = () => {
    // NOTE: In a real application, you would add useState and handleSubmit logic here
    // as demonstrated in the previous, full code block. For now, this is static HTML.

    return (
        <div className='ml-[4%] md:ml-[4%] lg:ml-[14%] w-full mt-[7rem] md:mt-[9rem] lg:mt-[10rem] 2xl:mt-[9rem] transition-all duration-400'>
            <div className='flex flex-col flex-wrap justify-center'>
                
                {/* Introduction Text */}
                <div className='text-left max-w-[600px]'>
                    <SectionHeading heading='Get in touch' />
                    <p className='text-gray-700 leading-relaxed mt-4'>
                        Ready to build the future? I&apos;m keen to connect with product teams and like-minded innovators to discuss challenging projects. 
                        If you&apos;re looking for a developer who delivers record-time results and drives measurable impact, feel free to book a discovery 
                        call or send an email to discuss your vision.
                    </p>
                </div>
                
                {/* Contact Form */}
                <form className='mt-8 w-full gap-[2rem] flex flex-col'> 
                    
                    {/* Name and Email Fields */}
                    <div className='flex flex-col md:flex-row gap-[2rem] w-full'> 
                        
                        {/* Full Name */}
                        <div className='w-1/2 md:w-1/3'> 
                            <label htmlFor="fullName" className="block text-sm md:text-lg font-medium text-gray-500">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    autoComplete="name"
                                    placeholder="e.g., Jane Doe"
                                    className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className='w-2/3 md:w-3/6 lg:w-2/5'>
                            <label htmlFor="email" className="block text-sm md:text-lg font-medium text-gray-500">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    autoComplete="email" 
                                    placeholder="e.g., test@gmail.com"
                                    className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Message Area */}
                    <div className='w-[90%] md:w-[87%] lg:w-[77%] '> 
                        <label htmlFor="message" className="block text-sm md:text-lg font-medium text-gray-500">
                            Write Your Message
                        </label>
                        <div className="mt-1">
                            <textarea
                                name="message"
                                id="message"
                                rows={4} 
                                placeholder="Let me know how I can help you with your project..."
                                className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
                            />
                        </div>
                    </div>

                    <div className='mt-4 w-full'>
                        <button
                            type="submit"
                            className="w-[90%] md:w-[87%] lg:w-[77%] bg-black hover:bg-blue-200 text-white hover:text-gray-700 font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-400 ease-in-out"
                        >
                            Send Message
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Contact
