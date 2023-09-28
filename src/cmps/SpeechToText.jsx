import React, { useState } from 'react'
import { generateTextFromVoice } from '../services/ai-voice.service'

export function SpeechToText() {
  const [audioUrl, setAudioUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [theTxt, setText] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (!audioUrl) {
      console.error('Please provide a blob URL.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(audioUrl)
      console.log('response', response)
      const blob = await response.blob()
      const file = new File([blob], 'audio.wav', { type: blob.type })

      const text = await generateTextFromVoice(file)
      setText(text)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="voice-modal-back-drop">
      {/* ... */}
      <form onSubmit={handleSubmit}>
        <h1 className="openai">Generate AI Text from Voice</h1>
        <input
          type="text"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          placeholder="Enter blob URL"
        />
        <button className="btn-generate" type="submit">
          <span>Generate Text</span>
        </button>
      </form>
      {/* ... */}
      {theTxt && <h1>{theTxt}</h1>}
    </div>
  )
}
