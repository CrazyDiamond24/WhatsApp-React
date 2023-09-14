import React from 'react'

export function TickIcon({ onClick, className  }) {
  return (
    <svg
      viewBox='0 0 24 24'
      height='24'
      width='24'
      preserveAspectRatio='xMidYMid meet'
      className={className}
      version='1.1'
      x='0px'
      y='0px'
      onClick={onClick}
    >
      <path
        fill='#B1B1B1'
        d='M9,17.2l-4-4l-1.4,1.3L9,19.9L20.4,8.5L19,7.1L9,17.2z'
      ></path>
    </svg>
  )
}
