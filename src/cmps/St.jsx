import React, { useState } from 'react'
import { convertTextToSpeech } from '../services/text-to-speech.service'
// import fileName from '../../../whatsapp-react-backend/Audio/UserAudio/'
export function St() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const url = await convertTextToSpeech(text)
      console.log('url', url)
      // console.log('Audio URL:', response.file)
      setAudioURL(url.file)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Convert Text to Speech</h1>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
        <button type="submit">Convert</button>
      </form>
      {loading && <span>Loading...</span>}

      {audioURL && (
        <audio controls>
          <source src={audioURL} />
        </audio>
      )}
    </div>
  )
}
