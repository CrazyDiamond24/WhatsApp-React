import React from 'react'

export function StoryNextArrow({ onClick, className }) {
  return (
    <svg
      className={className}
      onClick={onClick}
      xmlns='http://www.w3.org/2000/svg'
      width='50'
      height='50'
      viewBox='0 0 24 24'
      fill='white'
    >
      <g>
        <path d='M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z' />
        <polygon points='13.293 7.293 8.586 12 13.293 16.707 14.707 15.293 11.414 12 14.707 8.707 13.293 7.293' />
      </g>
    </svg>
  )
}
