import React from 'react'

type Props = {
    heading: string;
};

const SectionHeading = ({heading}: Props) => {
  return (
    <h2 className='heading-2' style={{ color: 'var(--color-text-primary)' }}>
      {heading}
    </h2>
  )
}

export default SectionHeading
