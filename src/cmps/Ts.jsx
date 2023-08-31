import React, { useState } from 'react'
import { convertAudioToText } from '../services/speech-to-text.service'
export function Ts() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  //   const apiKey = process.env.REACT_APP_WHISPER_KEY
  async function handleSubmit() {
    try {
      const data = await convertAudioToText(file)
      setText(data.text)
    } catch (error) {
      console.error('Error converting speech to text:', error)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleSubmit}>Convert</button>
      <h1>{text}</h1>
    </div>
  )
}
