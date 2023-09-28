import React from 'react'
export function VideoMsg({ msg }) {
  return (
    <video autoPlay loop muted controls>
      <source src={msg?.content} type="video/mp4"></source>
    </video>
  )
}
