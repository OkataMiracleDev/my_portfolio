import React from 'react'

type Props = {
    heading: string;
};

const SectionHeading = ({heading}: Props) => {
  return (
    <div className='w-full'>
        <h1 className='text-3xl font-bold'>{heading}</h1>
    </div>
  )
}

export default SectionHeading