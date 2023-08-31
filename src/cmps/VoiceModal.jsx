import React, { useState } from 'react' // Remember to import useState
import { convertTextToSpeech } from '../services/text-to-speech.service'

export function VoiceModal({ onSelectAudio, msg,closeModal }) {
  // Assuming onSelectAudio and msgText are props

  const [voice, setVoice] = useState('CYw3kZ02Hs0563khs1Fj')
  const voices = [
    { voice_id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave' },
    { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { voice_id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde' },
    { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  ]
  async function onSendAudio() {
    try {
        closeModal()
      const url = await convertTextToSpeech(msg, voice)
      console.log('url', url)
      // Instead of setting the audio URL in a state,
      // you can pass it to ChatWindow to handle the sending part.
      // Or handle the sending right here.
      onSelectAudio(url.file) // Assuming you want to use the onSelectFile prop for this purpose
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="voice-modal-container">
      <select
        className="voice-selector"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
      >
        {voices.map((voice) => (
          <option key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
          </option>
        ))}
      </select>
      <button onClick={onSendAudio}>send the msg</button>
    </div>
  )
}
