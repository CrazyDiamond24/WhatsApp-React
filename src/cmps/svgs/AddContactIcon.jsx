import React from 'react'

export function AddContactIcon({ onClick, className }) {
  return (
    <svg
      fill="#F7F9FA"
      height="20px"
      width="20px"
      className={className}
      onClick={onClick}
      viewBox="-0.01 0 20.026 20.026"
    >
      <g id="add-user-left-8" transform="translate(-2 -1.974)">
        <title>Add Contact</title>
        <path
          id="secondary"
          fill="#128c7e"
          d="M11,17a6,6,0,0,0-3.4-5.4A6,6,0,1,1,19,9a5.94,5.94,0,0,1-1.34,3.77,1,1,0,0,0,.28,1.45A7,7,0,0,1,21,20a1,1,0,0,1-1,1H9.46A5.93,5.93,0,0,0,11,17Z"
        />
        <path
          id="primary"
          d="M3,17H7M5,19V15"
          fill="none"
          stroke="#F7F9FA"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          id="primary-2"
          data-name="primary"
          d="M7.35,11a5.9,5.9,0,0,1-.27-3A6,6,0,0,1,19,9a5.94,5.94,0,0,1-1.34,3.77,1,1,0,0,0,.28,1.45A7,7,0,0,1,21,20a1,1,0,0,1-1,1H9"
          fill="none"
          stroke="#222222"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  )
}
