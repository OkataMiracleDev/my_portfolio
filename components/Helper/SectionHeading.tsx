import React from 'react'

type Props = {
    heading: string;
};

const SectionHeading = ({heading}: Props) => {
  return (
    <h2 className='font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink'>
      {heading}
    </h2>
  )
}

export default SectionHeading
