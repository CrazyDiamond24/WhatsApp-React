import React, { useState, useRef, useEffect } from 'react'

export function AudioMsg({ msg }) {
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  return (
    <>
      <audio ref={audioRef} className="audio-display" controls>
        <source src={msg?.content} type="audio/ogg"></source>
      </audio>

      <select
        value={playbackRate}
        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
      >
        <option value="0.5">0.5x</option>
        <option value="1">1x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
    </>
  )
}
