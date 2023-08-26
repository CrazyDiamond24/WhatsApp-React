import React, { useState } from 'react'
import { generateTextFromVoice } from '../services/ai-voice.service'

export function SpeechToText() {
  const [audioFile, setAudioFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [theTxt, setText] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    // Validate if there's a file
    if (!audioFile) {
      console.error('Please provide an audio file first.')
      return
    }

    setLoading(true)

    // You need to adjust generateTextFromVoice function to work with audio file
    try {
      console.log('audioFile', audioFile)
      const text = await generateTextFromVoice(audioFile)
      setText(text)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    setAudioFile(e.target.files[0])
  }

  return (
    <div className="voice-modal-back-drop">
      <div className="voice-modal">
        <button className="close-voice-modal">
          {/* Implement closeVoiceModal to close the modal */}
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="openai">Generate AI Text from Voice</h1>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <button className="btn-generate" type="submit">
            <span>Generate Text</span>
          </button>
        </form>
        {loading && <span className="ai-loader"></span>}
      </div>
      <h1>{theTxt}</h1>
    </div>
  )
}
