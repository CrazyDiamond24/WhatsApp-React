import React from 'react'
export function AudioMsg({ msg }) {
  return (
    <audio className="audio-display" controls>
      <source src={msg?.content} type="audio/ogg"></source>
    </audio>
  )
}
